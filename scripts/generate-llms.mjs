import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { format, resolveConfig } from 'prettier';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'src', 'components');
const docsDir = join(root, 'docs');
const llmsPath = join(root, 'llms.txt');

const BASE_URL = 'https://devschile.github.io/chucao';

function extractFirstDescription(content, skipHeading = false) {
  const lines = content.split('\n');
  let foundHeading = false;
  let description = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (description) {
        break;
      }
      continue;
    }
    if (trimmed.startsWith('#')) {
      foundHeading = true;
      continue;
    }
    if (skipHeading && !foundHeading) {
      continue;
    }
    if (trimmed.startsWith('>')) {
      continue;
    }
    if (trimmed.startsWith('<!--')) {
      continue;
    }
    if (trimmed.startsWith('|')) {
      continue;
    }
    if (trimmed.startsWith('```')) {
      continue;
    }
    if (trimmed.startsWith('-')) {
      continue;
    }
    if (trimmed.startsWith('*')) {
      continue;
    }
    description = trimmed;
    break;
  }

  return description || 'No description available';
}

function extractOverviewDescription(content) {
  const overviewMatch = content.match(/## Overview\s*\n([\s\S]*?)(?=\n## |$)/);
  if (overviewMatch) {
    const overviewText = overviewMatch[1].trim();
    const lines = overviewText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }
      if (trimmed.startsWith('<!--')) {
        continue;
      }
      if (trimmed.startsWith('>')) {
        continue;
      }
      if (trimmed.startsWith('|')) {
        continue;
      }
      if (trimmed.startsWith('```')) {
        continue;
      }
      if (trimmed.startsWith('-')) {
        continue;
      }
      if (trimmed.startsWith('*')) {
        continue;
      }
      return trimmed;
    }
  }
  return extractFirstDescription(content, true);
}

function readMarkdownFile(path) {
  return readFileSync(path, 'utf8');
}

function extractDocsDescription(filename) {
  const content = readMarkdownFile(join(docsDir, filename));
  return extractFirstDescription(content, true);
}

function extractComponentDescription(tag) {
  const readmePath = join(componentsDir, tag, 'readme.md');
  const content = readMarkdownFile(readmePath);
  const description = extractOverviewDescription(content);
  if (description === 'No description available') {
    return `${tag} component`;
  }
  return description;
}

async function generateLlmsTxt() {
  const lines = [];

  lines.push('# Chucao');
  lines.push('> Kit de marca + sistema de diseño web de devsChile');
  lines.push('');

  lines.push('## Getting Started');
  lines.push(`- [README](${BASE_URL}/README.md): Documentación principal del proyecto`);
  lines.push(`- [Design System](${BASE_URL}/DESIGN.md): Sistema de diseño y marca`);
  lines.push(`- [Changelog](${BASE_URL}/CHANGELOG.md): Historial de cambios`);
  lines.push('');

  const componentDirs = readdirSync(componentsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name.startsWith('ch-'))
    .map(entry => entry.name)
    .sort();

  lines.push('## Components');
  for (const tag of componentDirs) {
    const description = extractComponentDescription(tag);
    lines.push(`- [${tag}](${BASE_URL}/components/${tag}/): ${description}`);
  }
  lines.push('');

  lines.push('## Design Tokens');
  lines.push(`- [Tokens](${BASE_URL}/tokens/README.md): Tokens de diseño generados por toki`);
  lines.push('');

  const docsFiles = readdirSync(docsDir)
    .filter(file => file.endsWith('.md'))
    .sort();

  lines.push('## Documentation');
  for (const file of docsFiles) {
    const description = extractDocsDescription(file);
    const name = file.replace('.md', '');
    const title = name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    lines.push(`- [${title}](${BASE_URL}/docs/${file}): ${description}`);
  }
  lines.push('');

  return lines.join('\n');
}

async function writeGenerated(path, content) {
  const options = await resolveConfig(path);
  const formatted = await format(content, { parser: 'markdown', ...options });
  writeFileSync(path, formatted);
}

async function main() {
  const content = await generateLlmsTxt();
  await writeGenerated(llmsPath, content);
  console.log(`[llms] Generated llms.txt with ${readdirSync(componentsDir, { withFileTypes: true }).filter(e => e.isDirectory() && e.name.startsWith('ch-')).length} components`);
}

main();
