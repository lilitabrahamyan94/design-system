import type { ReactNode } from 'react';

/** Grid of labelled cells used by the "All states" stories. */
export function StateTable({ cols, rows }: { cols: string[]; rows: Array<{ label: string; cells: ReactNode[] }> }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--font-family-sans)', fontSize: 12 }}>
        <thead><tr><th />{cols.map(c => <th key={c} style={{ textAlign: 'left', fontWeight: 500, color: 'var(--color-gray-56)', fontSize: 11, padding: '6px 14px' }}>{c}</th>)}</tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.label} style={{ borderTop: '1px solid var(--color-gray-08)' }}>
            <th style={{ textAlign: 'left', fontWeight: 500, padding: '12px 14px 12px 0', whiteSpace: 'nowrap' }}>{r.label}</th>
            {r.cells.map((c, i) => <td key={i} style={{ padding: '12px 14px', verticalAlign: 'top' }}>{c}</td>)}
          </tr>))}</tbody>
      </table>
    </div>
  );
}
export const notes = (title: string, items: string[]) => `${title}\n\n**Notes from Figma**\n\n${items.map(i => `- ${i}`).join('\n')}`;

/**
 * "State" dropdown for the Playground. It drives the component's className,
 * so you can preview Hover / Click / Focus without using the mouse.
 */
export const stateControl = (states: Array<'hover' | 'click' | 'focus'>) => ({
  name: 'state',
  description: 'Preview an interaction state. In a real app these happen on hover, press and keyboard focus.',
  control: 'select' as const,
  options: ['default', ...states],
  mapping: { default: undefined, hover: 'is-hover', click: 'is-active', focus: 'is-focus' },
});
