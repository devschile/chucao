#!/usr/bin/env node
// Warns when a merged pull request mentions open issues without closing them.
//
// A PR that says `Refs #42` and ships #42's work is correct while the issue is
// still a decision to be ratified, but nothing re-reads those references once
// the PR is merged. #42 and #92 shipped in 2.5.0 and stayed open until someone
// audited them by hand, which is how work goes looking finished while the
// tracker says otherwise.
//
// Closing keywords (`closes`, `fixes`, `resolves`) already auto-close top-level
// lines, and that behaviour is correct. This check covers the rest: an issue
// named with an advancing marker (`Refs`, `Part of`, `Advances`) whose work
// shipped but whose state is still open gets reported, so the author can
// either close it or say what is left.
//
// A bare mention does not count. Bodies routinely say things like "not #24,
// that is multi-theme" or list issues that stay open on purpose, and flagging
// those would train everyone to ignore the check.
//
// It reports rather than fails by default: a `Refs` that genuinely advances an
// issue without finishing it is legitimate. Pass --strict to make it exit 1.
//
// Usage:
//
//   node scripts/check-merged-issue-refs.mjs --pr 116
//   node scripts/check-merged-issue-refs.mjs --pr 116 --strict
//
// Requires GH_TOKEN with `pull-requests` and `issues` read access.

const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
if (!token) {
  console.error('check-merged-issue-refs: GH_TOKEN or GITHUB_TOKEN is required');
  process.exit(1);
}

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const prIndex = args.indexOf('--pr');
const pr = prIndex === -1 ? null : args[prIndex + 1];

if (!pr) {
  console.error('check-merged-issue-refs: pass --pr <number>');
  process.exit(1);
}

const repo = process.env.GITHUB_REPOSITORY ?? 'devschile/chucao';

async function gh(path) {
  const response = await fetch(`https://api.github.com/repos/${repo}/${path}`, {
    headers: {
      'accept': 'application/vnd.github+json',
      'authorization': `Bearer ${token}`,
      'user-agent': 'chucao-check-merged-issue-refs',
    },
  });
  if (!response.ok) {
    throw new Error(`${path} answered ${response.status} ${response.statusText}`);
  }
  return response.json();
}

const pull = await gh(`pulls/${pr}`);
if (!pull.merged) {
  console.log(`pr #${pr} is not merged, nothing to audit`);
  process.exit(0);
}

const title = pull.title ?? '';
const body = pull.body ?? '';
const commits = (await gh(`pulls/${pr}/commits?per_page=100`)).map(c => c.commit?.message ?? '');

// Closing keywords only autoclose on a top-level line; everything else is a
// reference. The keyword list matches what GitHub itself recognises.
const closingKeyword = /^(?:closes|fixes|resolves)\s/i;
const closedByKeywords = new Set();
for (const line of `${title}\n${body}`.split('\n')) {
  if (closingKeyword.test(line.trim())) {
    for (const m of line.matchAll(/#(\d+)/g)) {
      closedByKeywords.add(Number(m[1]));
    }
  }
}

// `Refs #12`, `Refs: #12`, `Part of #34`, `Advances #56` — the markers this repo
// uses for "this PR moves the issue forward without finishing it".
const advancing = /\b(?:refs?|part of|advances?)\b:?\s+([^\n]*)/gi;
const referenced = new Set();
for (const text of [title, body, ...commits]) {
  for (const marker of text.matchAll(advancing)) {
    for (const m of marker[1].matchAll(/#(\d+)/g)) {
      referenced.add(Number(m[1]));
    }
  }
}

const candidates = [...referenced].filter(n => n !== Number(pr) && !closedByKeywords.has(n)).sort((a, b) => a - b);

const stillOpen = [];
for (const number of candidates) {
  const issue = await gh(`issues/${number}`);
  if (!issue.pull_request && issue.state === 'open') {
    stillOpen.push(issue);
  }
}

if (stillOpen.length === 0) {
  console.log(`pr #${pr}: every referenced issue is closed`);
  process.exit(0);
}

console.error(`check-merged-issue-refs: pr #${pr} was merged but mentions ${stillOpen.length} issue(s) still open:`);
for (const issue of stillOpen) {
  const labels = issue.labels.map(l => l.name).join(', ');
  console.error(`- #${issue.number} ${issue.title}${labels ? ` [${labels}]` : ''}`);
}
console.error('');
console.error('Close the ones this PR finished, or leave a comment on each explaining what is left.');

process.exit(strict ? 1 : 0);
