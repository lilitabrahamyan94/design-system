import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from '../components/Choice';
import { StateTable, notes } from './helpers';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Label', defaultChecked: false, indeterminate: false, disabled: false },
  parameters: { docs: { description: { component: notes('Use checkboxes to pick any number of options, or to confirm a single statement. `indeterminate` shows the dash for a select-all checkbox when only some items are selected.', [
    '**The checked stroke is hard-coded #D4D4D4**, not the Checkbox/Stroke token (#C2C2C2).',
    'The partly-selected row is labelled "Unchecked Enabled" in Figma.',
  ]) } } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { name: 'Partly selected', args: { indeterminate: true } };

function SelectAll() {
  const regions = ['EMEA', 'APAC', 'Americas'];
  const [on, setOn] = useState<string[]>(['EMEA', 'Americas']);
  const all = on.length === regions.length;
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <Checkbox label="All regions" checked={all} indeterminate={!all && on.length > 0} onChange={() => setOn(all ? [] : regions)} />
      <div style={{ display: 'grid', gap: 10, paddingLeft: 24 }}>{regions.map(r => <Checkbox key={r} label={r} checked={on.includes(r)} onChange={() => setOn(o => o.includes(r) ? o.filter(x => x !== r) : [...o, r])} />)}</div>
    </div>
  );
}
export const SelectAllExample: Story = { name: 'Select all (live)', render: () => <SelectAll />, parameters: { controls: { disable: true } } };
export const AllStates: Story = {
  name: 'All states', parameters: { controls: { disable: true } },
  render: () => <StateTable cols={['Default', 'Hover', 'Disabled']} rows={[['Unchecked', {}], ['Checked', { defaultChecked: true }], ['Partly selected', { indeterminate: true }]].map(([l, p]) => ({ label: l as string, cells: ['', 'is-hover', 'disabled'].map(st => <Checkbox aria-label={`${l} ${st || 'default'}`} {...(p as object)} disabled={st === 'disabled'} className={st === 'is-hover' ? st : undefined} />) }))} />,
};
