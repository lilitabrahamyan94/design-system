import type { HTMLAttributes } from 'react';
import manifest from './icons.json';

/** Every SVG in src/icons, keyed by path without extension, e.g. "ui-16pt/trash". */
const files = import.meta.glob('./**/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const svgs: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.replace(/^\.\//, '').replace(/\.svg$/, ''), svg]),
);

export type IconEntry = { group: string; sub: string; label: string; size: string; file: string; mono: boolean; note?: string };
export const iconManifest = manifest as IconEntry[];

export type IconProps = HTMLAttributes<HTMLSpanElement> & {
  /** Icon path, e.g. "ui-16pt/trash" or "ui-component/field-info" */
  name: string;
  /** Accessible name. Leave empty for decorative icons (default). */
  label?: string;
};

/** Renders an icon from the design system. Single-colour icons inherit `color` from the parent. */
export function Icon({ name, label, style, ...rest }: IconProps) {
  const svg = svgs[name];
  if (!svg) return null;
  return (
    <span
      {...rest}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ display: 'inline-flex', flex: 'none', ...style }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
