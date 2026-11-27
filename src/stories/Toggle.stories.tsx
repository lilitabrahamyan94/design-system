import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '../components/Choice';
import { StateTable, notes, stateControl } from './helpers';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: { label: 'Label', defaultChecked: false, disabled: false, className: 'default' },
  argTypes: { className: stateControl(['hover']), defaultChecked: { name: 'on' } },
  render: args => <Toggle key={String(args.defaultChecked)} {...args} />,
  parameters: { docs: { description: { component: notes('Use a switch to change a setting or a standalone option. It makes a binary choice, like on and off. The change applies immediately, with no Save button. It is a real checkbox with `role="switch"`.', [
    '**The active green is not in the palette.** Active #82BF00, hover #6B9C00 and active disabled #ABABAB are hard-coded. Leaf Green 080 is the nearest token.',
    '**The inactive disabled toggle is darker than the enabled one** (track and knob are #333 at 48%). Disabled should look lighter.',
  ]) } } },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const AllStates: Story = {
  name: 'All states', parameters: { controls: { disable: true } },
  render: () => <>
    <StateTable cols={['Default', 'Hover', 'Disabled']} rows={[false, true].map(on => ({ label: on ? 'Active' : 'Inactive', cells: ['', 'is-hover', 'disabled'].map(st => <Toggle label="Label" defaultChecked={on} disabled={st === 'disabled'} className={st === 'is-hover' ? st : undefined} />) }))} />
    <h3 style={{ font: '500 14px var(--font-family-sans)', margin: '32px 0 12px' }}>In a settings list</h3>
    <div style={{ display: 'grid', gap: 12 }}>{['Summary', 'Trends', 'Insights & Bridge Shifts', 'Performance'].map((l, i) => <Toggle key={l} label={l} defaultChecked={i < 2} />)}</div>
  </>,
};
