import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const root = resolve('dist');
assert(existsSync(root), 'Run npm run build first.');
for (const file of ['index.html', 'sample-audit.html', 'funding.html', 'privacy.html', 'sitemap.xml', 'robots.txt', 'favicon.svg']) {
  assert(existsSync(join(root, file)), `Missing required release file: ${file}`);
}
for (const file of ['launch', 'docs', 'businessplan.md', 'CashFlow&USP', '.env', '.env.local', '.git', 'node_modules']) {
  assert(!existsSync(join(root, file)), `Private or development material in release: ${file}`);
}
function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const files = walk(root);
const pages = files.filter(file => file.endsWith('.html'));
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  assert(/<html\s+lang="en-CA"/.test(html), `Missing document language in ${file}`);
  assert(/name="viewport"/.test(html), `Missing responsive viewport in ${file}`);
  for (const [, href] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const path = href.split(/[?#]/)[0];
    const target = join(root, path === '/' ? 'index.html' : path);
    assert(existsSync(target), `Broken local link in ${relative(root, file)}: ${href}`);
  }
}
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
assert(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), 'Incorrect sitemap namespace');
for (const [, location] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
  const url = new URL(location);
  assert.equal(url.origin, 'https://flowercityai.ca');
  assert(existsSync(join(root, url.pathname === '/' ? 'index.html' : url.pathname)), `Sitemap points to a missing page: ${location}`);
}
const total = files.reduce((size, file) => size + statSync(file).size, 0);
assert(total < 1_000_000, `Release exceeds the 1 MB static-file budget: ${total} bytes`);
console.log(`Release checks passed: ${pages.length} pages, ${files.length} files, ${(total / 1000).toFixed(1)} KB total. No planning material included.`);
