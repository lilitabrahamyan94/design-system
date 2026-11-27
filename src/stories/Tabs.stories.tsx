import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, type TabsProps } from '../components/Tabs';
import { notes } from './helpers';

const NAMES = ['Overview', 'Trends', 'Insights', 'Performance', 'Forecast', 'Notes', 'Sources', 'Archive', 'Settings', 'History', 'Exports', 'Owners'];
const tabs = (n: number, content: boolean, disabledLast: boolean) => Array.from({ length: n }, (_, i) => ({
  id: `t${i}`, label: NAMES[i], disabled: disabledLast && i === n - 1 && n > 1,
  content: content ? <p style={{ margin: 0, color: 'var(--color-gray-56)' }}>Content for <b>{NAMES[i]}</b>.</p> : undefined,
}));
type Args = TabsProps & { count: number; withPanel: boolean; disabledLast: boolean };

const meta: Meta<Args> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { variant: 'solo', count: 4, withPanel: true, disabledLast: false, label: 'Report sections', items: [] },
  argTypes: {
    variant: { control: 'inline-radio', options: ['built-in', 'solo'], description: 'Built in: inside a card or popup. Solo: standalone in the page.' },
    count: { name: 'number of tabs', control: { type: 'range', min: 2, max: 12, step: 1 }, description: 'More than 8 switches to scrolling tabs with arrows', table: { category: 'Preview' } },
    withPanel: { name: 'show content', table: { category: 'Preview' } },
    disabledLast: { name: 'last tab disabled', table: { category: 'Preview' } },
    items: { table: { disable: true } },
  },
  render: ({ count, withPanel, disabledLast, ...args }) => <Tabs key={`${count}-${args.variant}`} {...args} items={tabs(count, withPanel, disabledLast)} defaultValue="t1" />,
  parameters: { docs: { description: { component: notes('Tabs group information into sections, so users can switch between them without leaving the page. All tabs should hold the same kind of content. Use tabs when there are more than 2 groups.\n\n**Built in** sits inside a popup or card. **Solo** stands on its own. Up to 8 tabs share the width equally. With more, tabs get a fixed width and scroll with arrows. **Keyboard:** ←/→, Home, End.', [
    '**"Twilight Blue 100 alpha" variables use the 080 colour (#006ECE)**, while "Twilight Blue 100" is #0058A5. The focus state mixes both.',
  ]) } } },
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
