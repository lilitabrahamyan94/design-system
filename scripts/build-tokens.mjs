// Builds colors.css and colors.ts from the DTCG source colors.json
import fs from 'node:fs';
const src = JSON.parse(fs.readFileSync(new URL('../src/tokens/colors.json', import.meta.url)));
const flat = {}; // "color.gray.02" -> {value, desc}
(function walk(node, path) {
  if (node.$value !== undefined) { flat[path.join('.')] = { value: node.$value, desc: node.$description }; return; }
  const num = k => Number(k.replace(/^a/, ''));
  const keys = Object.keys(node).filter(k => !k.startsWith('$'));
  if (keys.every(k => /^a?\d+$/.test(k))) keys.sort((x, y) => num(x) - num(y));
  for (const k of keys) walk(node[k], [...path, k]);
})(src, []);
const cssName = p => '--' + p.replace(/\./g, '-');
const toCss = v => v.replace(/\{([^}]+)\}/g, (_, r) => `var(${cssName(r)})`);
let css = '/* AUTO-GENERATED from colors.json — do not edit by hand */\n:root {\n';
for (const [p, t] of Object.entries(flat)) css += `  ${cssName(p)}: ${toCss(t.value)};${t.desc ? ` /* ${t.desc} */` : ''}\n`;
css += '}\n';
fs.writeFileSync(new URL('../src/tokens/colors.css', import.meta.url), css);
const resolve = v => { let s = v; while (/^\{/.test(s)) s = flat[s.slice(1, -1)].value; return s; };
let ts = '// AUTO-GENERATED from colors.json — do not edit by hand\nexport const colors = {\n';
for (const [p, t] of Object.entries(flat)) ts += `  '${p.replace(/^color\./, '')}': { css: 'var(${cssName(p)})', hex: '${resolve(t.value)}' },\n`;
ts += '} as const;\nexport type ColorToken = keyof typeof colors;\n';
fs.writeFileSync(new URL('../src/tokens/colors.ts', import.meta.url), ts);
console.log(Object.keys(flat).length + ' tokens');
