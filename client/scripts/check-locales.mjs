// Verifies every locale mirrors en.json: same keys, same array lengths,
// same {{placeholders}}. Run: node scripts/check-locales.mjs
import { readFileSync } from 'node:fs';

const load = l => JSON.parse(readFileSync(new URL(`../src/i18n/locales/${l}.json`, import.meta.url), 'utf8'));
const en = load('en');
const vars = s => (s.match(/{{\s*\w+\s*}}/g) || []).sort().join(',');
let failed = false;

for (const lang of ['fr', 'ja', 'zh', 'ko']) {
  const problems = [];
  const walk = (a, b, path) => {
    if (typeof a === 'string') {
      if (typeof b !== 'string') problems.push(`${path}: missing`);
      else if (vars(a) !== vars(b)) problems.push(`${path}: placeholders ${vars(a)} ≠ ${vars(b)}`);
      return;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || b.length !== a.length) { problems.push(`${path}: array length`); return; }
      a.forEach((v, i) => walk(v, b[i], `${path}[${i}]`));
      return;
    }
    for (const k of Object.keys(a)) {
      if (b == null || !(k in b)) { problems.push(`${path}.${k}: missing`); continue; }
      walk(a[k], b[k], path ? `${path}.${k}` : k);
    }
  };
  let data;
  try { data = load(lang); } catch (e) { problems.push(`invalid JSON: ${e.message}`); }
  if (data) walk(en, data, '');
  console.log(`${lang}: ${problems.length ? problems.length + ' problem(s)' : 'OK'}`);
  problems.slice(0, 15).forEach(p => console.log('   ' + p));
  if (problems.length) failed = true;
}
process.exit(failed ? 1 : 0);
