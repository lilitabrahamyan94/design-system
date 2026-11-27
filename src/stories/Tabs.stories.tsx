import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '../components/Tabs';
import { notes } from './helpers';

const tabs = (n: number, content = false) => Array.from({ length: n }, (_, i) => {
  const label = ['Overview', 'Trends', 'Insights', 'Performance', 'Forecast', 'Notes', 'Sources', 'Archive', 'Settings', 'History'][i] ?? `Tab ${i + 1}`;
  return { id: `t${i}`, label, content: content ? <p style={{ margin: 0, color: 'var(--color-gray-56)' }}>Content for <b>{label}</b>.</p> : undefined };
});
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { items: tabs(4, true), defaultValue: 't1', variant: 'solo', label: 'Report sections' },
  argTypes: { variant: { control: 'inline-radio', options: ['built-in', 'solo'] } },
  parameters: { docs: { description: { component: notes('Tabs group information into sections, so users can switch between them without leaving the page. All tabs should hold the same kind of content. Use tabs when there are more than 2 groups.\n\n**Built in** sits inside a popup or card. **Solo** stands on its own. Up to 8 tabs share the width equally. With more, tabs get a fixed width and scroll with arrows. **Keyboard:** ←/→, Home, End.', [
    '**"Twilight Blue 100 alpha" variables use the 080 colour (#006ECE)**, while "Twilight Blue 100" is #0058A5. The focus state mixes both.',
  ]) } } },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const BuiltIn: Story = { name: 'Built in · 8 tabs', args: { items: tabs(8), variant: 'built-in', defaultValue: 't1' } };
export const Solo: Story = { name: 'Solo · 8 tabs', args: { items: tabs(8), variant: 'solo', defaultValue: 't0' } };
export const TwoTabs: Story = { name: 'Two tabs', args: { items: tabs(2), variant: 'solo' }, decorators: [S => <div style={{ width: 240 }}><S /></div>] };
export const Scrollable: Story = { name: 'More than 8 tabs', args: { items: tabs(10), variant: 'built-in', defaultValue: 't1' } };
export const WithDisabled: Story = { name: 'Disabled tab', args: { items: [...tabs(3), { id: 'x', label: 'Locked', disabled: true }], variant: 'solo' } };
