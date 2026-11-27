import { useMemo, useState } from 'react';
import colorsJson from '../tokens/colors.json';
import typoJson from '../tokens/typography.json';
import { iconManifest, svgs } from '../icons';
import './foundations.css';

type Tok = { $value: string; $description?: string; $extensions?: { figma?: string } };
const C = colorsJson as unknown as { color: Record<string, Record<string, Tok>>; semantic: Record<string, unknown> };
const keys = (o: object) => Object.keys(o).filter(k => !k.startsWith('$')).sort((a, b) => (+a || 0) - (+b || 0));
const label = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

function Swatch({ cssVar, t, shown }: { cssVar: string; t: Tok; shown: string }) {
  return (
    <figure className="fd-sw">
      <div className="fd-chip"><i style={{ background: `var(${cssVar})` }} /></div>
      <figcaption><b>{t.$extensions?.figma}</b><span className="fd-hex">{shown}</span><span className="fd-var">{cssVar}</span>{t.$description && <span className="fd-note">⚠ {t.$description}</span>}</figcaption>
    </figure>
  );
}

/** One colour family, e.g. family="gray" */
export function ColorFamily({ family, title, flag }: { family: string; title?: string; flag?: string }) {
  const fam = C.color[family];
  return (
    <div className="fd">
      <h3>{title ?? label(family)}{flag && <span className="fd-flag">{flag}</span>}</h3>
      <div className="fd-grid">{keys(fam).map(k => <Swatch key={k} cssVar={`--color-${family}-${k}`} t={fam[k]} shown={fam[k].$value.toUpperCase()} />)}</div>
    </div>
  );
}

export function SemanticColors() {
  const out: Array<[string, Tok]> = [];
  const walk = (n: Record<string, unknown>, p: string[]) => Object.entries(n).forEach(([k, v]) => {
    if (k.startsWith('$')) return;
    if ((v as Tok).$value) out.push([[...p, k].join('-'), v as Tok]); else walk(v as Record<string, unknown>, [...p, k]);
  });
  walk(C.semantic, ['semantic']);
  return <div className="fd"><div className="fd-grid">{out.map(([n, t]) => <Swatch key={n} cssVar={`--${n}`} t={t} shown={`→ ${t.$value.slice(1, -1).replace('color.', '')}`} />)}</div></div>;
}

type TT = { $value: Record<string, string>; $extensions: { figma: string }; $description?: string };
const T = typoJson as unknown as { font: Record<string, Record<string, { $value: string | number | string[] }>>; text: Record<string, Record<string, TT>> };
const res = (s: string) => { const m = s.match(/^\{font\.(.+?)\.(.+)\}$/); return m ? T.font[m[1]][m[2]].$value : s; };
const W: Record<string, string> = { 400: 'Regular', 500: 'Medium', 600: 'Semibold' };

export function TypeScale() {
  return (
    <div className="fd">
      {Object.entries(T.text).map(([g, items]) => (
        <div key={g}>
          <h3>{label(g)}</h3>
          {Object.entries(items).map(([k, t]) => {
            const v = t.$value, ls = String(res(v.letterSpacing));
            return (
              <div className="fd-row" key={k}>
                <div className="fd-meta"><b>{t.$extensions.figma}</b><span>{W[String(res(v.fontWeight))]} {String(res(v.fontWeight))}</span><span>{String(res(v.fontSize))} / {String(res(v.lineHeight))}</span>{ls !== '0em' && <span>Letter spacing {ls}</span>}<code>.text-{g}-{k}</code></div>
                <p className={`text-${g}-${k}`}>The quick brown fox jumps over the lazy dog</p>
                {t.$description && <span className="fd-note">⚠ {t.$description}</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function IconGallery() {
  const [q, setQ] = useState('');
  const [toast, setToast] = useState('');
  const list = useMemo(() => iconManifest.filter(i => i.label.toLowerCase().includes(q.trim().toLowerCase())), [q]);
  const groups = [...new Set(iconManifest.map(i => i.group))];
  const copy = async (file: string) => {
    const name = file.replace(/\.svg$/, '');
    let msg = `Copied <Icon name="${name}" />`;
    try { await navigator.clipboard.writeText(`<Icon name="${name}" />`); } catch { msg = `Icon name: ${name}`; }
    setToast(msg); setTimeout(() => setToast(''), 1800);
  };
  return (
    <div className="fd">
      <div className="fd-search"><label htmlFor="iq"><b>Search icons</b></label><input id="iq" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. arrow, folder, chart" /><span style={{ fontSize: 12, color: 'var(--color-gray-56)' }}>{list.length} icons · click to copy the component code</span></div>
      {groups.map(g => {
        const items = list.filter(i => i.group === g);
        if (!items.length) return null;
        return (
          <div key={g}><h3>{g}</h3>
            <div className="fd-icons">{items.map(i => {
              const name = i.file.replace(/\.svg$/, '');
              return (
                <button key={i.file} className="fd-ic" type="button" title={name} onClick={() => copy(i.file)}>
                  <span style={{ height: 34, display: 'flex', alignItems: 'center' }} dangerouslySetInnerHTML={{ __html: svgs[name] ?? '' }} />
                  <span className="n">{i.label}</span><span className="s">{i.size}{i.mono ? '' : ' · colour'}</span>{i.note && <em>{i.note}</em>}
                </button>
              );
            })}</div>
          </div>
        );
      })}
      {toast && <div className="fd-toast" role="status">{toast}</div>}
    </div>
  );
}
