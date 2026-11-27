// Builds typography.css (variables + .text-* classes) and typography.ts from typography.json
import fs from 'node:fs';
const src = JSON.parse(fs.readFileSync(new URL('../src/tokens/typography.json', import.meta.url)));
const v = path => '--' + path.replace(/\./g, '-');
const ref = s => s.replace(/^\{(.+)\}$/, (_, r) => `var(${v(r)})`);
const val = x => Array.isArray(x) ? x.map(f => /\s/.test(f) ? `"${f}"` : f).join(', ') : x;
const num = k => (/^\d+$/.test(k) ? +k : NaN);
let css = '/* AUTO-GENERATED from typography.json — do not edit by hand */\n:root {\n';
for (const [group, items] of Object.entries(src.font)) {
  const keys = Object.keys(items); if (keys.every(k => !isNaN(num(k)))) keys.sort((a, b) => num(a) - num(b));
  for (const k of keys) css += `  ${v(`font.${group}.${k}`)}: ${val(items[k].$value)};${items[k].$description ? ` /* ${items[k].$description} */` : ''}\n`;
}
css += '}\n';
const styles = [];
for (const [group, items] of Object.entries(src.text)) for (const [k, t] of Object.entries(items)) styles.push({ name: `${group}-${k}`, t });
for (const { name, t } of styles) {
  const s = t.$value;
  css += `\n/* ${t.$extensions.figma}${t.$description ? ' — ' + t.$description : ''} */\n.text-${name} {\n`
    + `  font-family: ${ref(s.fontFamily)};\n  font-weight: ${ref(s.fontWeight)};\n  font-size: ${ref(s.fontSize)};\n`
    + `  line-height: ${ref(s.lineHeight)};\n  letter-spacing: ${ref(s.letterSpacing)};\n}\n`;
}
fs.writeFileSync(new URL('../src/tokens/typography.css', import.meta.url), css);
const resolve = s => { const m = s.match(/^\{font\.(.+?)\.(.+)\}$/); return m ? src.font[m[1]][m[2]].$value : s; };
let ts = '// AUTO-GENERATED from typography.json — do not edit by hand\nexport const typography = {\n';
for (const { name, t } of styles) {
  const r = Object.fromEntries(Object.entries(t.$value).map(([k, x]) => [k, resolve(x)]));
  ts += `  '${name}': { className: 'text-${name}', figma: '${t.$extensions.figma}', fontWeight: ${r.fontWeight}, fontSize: '${r.fontSize}', lineHeight: '${r.lineHeight}', letterSpacing: '${r.letterSpacing}' },\n`;
}
ts += '} as const;\nexport type TypographyToken = keyof typeof typography;\n';
fs.writeFileSync(new URL('../src/tokens/typography.ts', import.meta.url), ts);
console.log(styles.length + ' text styles');
