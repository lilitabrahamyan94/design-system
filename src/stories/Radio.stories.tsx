import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from '../components/Choice';
import { StateTable } from './helpers';

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  args: { name: 'period', label: 'Report period', options: ['Weekly', 'Monthly', 'Quarterly'], defaultValue: 'Monthly', inline: true },
  parameters: { docs: { description: { component: 'Use radio buttons to pick exactly one option from a short list, where all options are visible. Arrow keys move between options in a group.' } } },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const AllStates: Story = {
  name: 'All states', parameters: { controls: { disable: true } },
  render: () => <StateTable cols={['Default', 'Hover', 'Disabled']} rows={[false, true].map(on => ({ label: on ? 'Checked' : 'Unchecked', cells: ['', 'is-hover', 'disabled'].map(st => <Radio name={`s-${on}-${st}`} label="Label" defaultChecked={on} disabled={st === 'disabled'} className={st === 'is-hover' ? st : undefined} />) }))} />,
};
