import type { Preview } from '@storybook/react-vite';
import type { ArgTypesEnhancer } from 'storybook/internal/types';
import '../src/styles/index.css';

/**
 * Keeps the "state" control first in every Controls panel.
 * Storybook lists ungrouped controls before grouped ones, so every other
 * control goes into a "Properties" group and "state" stays on top.
 */
const stateFirst: ArgTypesEnhancer = ({ argTypes, initialArgs }) => {
  const all = { ...argTypes };
  // args with no argType yet (e.g. native "disabled", "children") would be listed ungrouped, above "state"
  for (const [key, value] of Object.entries(initialArgs ?? {})) {
    if (all[key]) continue;
    const control = typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : typeof value === 'string' ? 'text' : 'object';
    all[key] = { name: key, control: { type: control } } as (typeof all)[string];
  }
  return Object.fromEntries(Object.entries(all).map(([key, t]) =>
    [key, t.name === 'state' ? t : { ...t, table: { ...t.table, category: t.table?.category ?? 'Properties' } }]));
};
// run after Storybook has added the argTypes it infers from args
stateFirst.secondPass = true;

// Keep copied snippets clean: drop internal keys and props that equal their default.
const cleanSnippet = (code: string) =>
  code
    .replace(/\s+key=(?:"[^"]*"|\{[^}]*\})/g, '')
    .replace(/\s+\w+=\{(?:false|undefined)\}/g, '')
    .replace(/\s+\w+=""/g, '');

const preview: Preview = {
  argTypesEnhancers: [stateFirst],
  parameters: {
    docs: { source: { transform: cleanSnippet } },
    layout: 'padded',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    a11y: { test: 'todo' },
    options: {
      storySort: { order: ['Introduction', 'Foundations', ['Colors', 'Typography', 'Icons'], 'Components', ['Button', 'Button Group', 'Input', 'Text Area', 'Select', 'Toggle', 'Tabs', 'Checkbox', 'Radio', 'File Upload', 'Date Picker']] },
    },
    backgrounds: { options: { papyrus: { name: 'Papyrus', value: '#fafafa' }, paper: { name: 'Paper', value: '#ffffff' } } },
  },
  initialGlobals: { backgrounds: { value: 'paper' } },
  tags: ['autodocs'],
};
export default preview;
