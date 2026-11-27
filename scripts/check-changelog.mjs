#!/usr/bin/env node
// Fails when a release would ship a CHANGELOG entry with no items.
//
// Two things produced empty entries in 2.5.0 and both are silent:
//
// 1. `getLatestTagFromAllRefs: true` makes release-it pick the newest tag as
//    the *previous* tag. If the version being released already has a tag, the
//    range becomes `X...X`, git returns no commits, and the changelog is born
//    empty. This is the normal case when a release is retried after a failed
//    publish or CDN step.
// 2. conventional-changelog only writes commits whose type is listed in the
//    preset. A release whose only commits are `ci:` — or the `release: 1.2.3`
//    squash subject this repo used for the release PR itself — produces a
//    heading and nothing under it.
//
// Either way the release still succeeds, so the emptiness has to be caught
// here rather than noticed later.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const version = process.argv[2] ?? process.env.npm_package_version;
if (!version) {
  console.error('check-changelog: no version given');
  process.exit(1);
}

const changelog = readFileSync('CHANGELOG.md', 'utf8');
const lines = changelog.split('\n');

// The entry starts at its `## [x.y.z]` heading and ends at the next `## `.
const start = lines.findIndex(line => line.startsWith(`## [${version}]`));
if (start === -1) {
  console.error(`check-changelog: no entry for ${version} in CHANGELOG.md`);
  process.exit(1);
}

let end = lines.length;
for (let i = start + 1; i < lines.length; i++) {
  if (lines[i].startsWith('## ')) {
    end = i;
    break;
  }
}

const body = lines.slice(start + 1, end);
const bullets = body.filter(line => /^\s*[*-] \S/.test(line));
const hasContent = bullets.length > 0 || body.some(line => /^###\s/.test(line));

if (!hasContent) {
  const tags = execFileSync('git', ['tag', '-l', version], { encoding: 'utf8' }).trim();
  const hints = [`The ${version} entry in CHANGELOG.md has no changes listed.`, '', 'Likely causes:'];
  if (tags) {
    hints.push(
      `- The tag ${version} already exists, so release-it diffed ${version}...${version} and found nothing.`,
      `  Delete it first (git tag -d ${version} and git push origin :refs/tags/${version}) and re-run.`,
    );
  }
  hints.push(
    '- The commits since the previous tag have no type that conventional-changelog renders',
    '  (`ci:`, `chore:`, or a `release:` squash subject produce no bullets).',
    '',
    'Either rewrite the entry by hand or merge with a conventional subject',
    'such as `feat: ...` / `fix: ...` before releasing.',
  );
  console.error(`check-changelog: ${hints.join('\n')}`);
  process.exit(1);
}

console.log(`check-changelog: ${version} lists ${bullets.length} change(s)`);
