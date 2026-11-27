import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from '../components/Field';
import { StateTable } from './helpers';

const meta = {
  title: 'Components/Text Area',
  component: TextArea,
  args: { label: 'Label', required: true, hint: 'More about this field', placeholder: 'Placeholder', message: 'info message', showCounter: true, leadingIcon: true },
  argTypes: { messageType: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] }, leadingIcon: { control: 'boolean' } },
  decorators: [(S, c) => c.parameters.fullWidth ? <S /> : <div style={{ width: 240 }}><S /></div>],
  parameters: { docs: { description: { component: 'Text Area takes longer, multi-line text, like comments, descriptions or messages. It shares the label, messages and states of Input.' } } },
} satisfies Meta<typeof TextArea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithText: Story = { args: { defaultValue: 'Text' } };
export const Error: Story = { args: { defaultValue: 'Text', error: 'error message' } };
const STATES: Array<[string, string]> = [['', 'Default'], ['is-hover', 'Hover'], ['is-focus', 'Focused'], ['error', 'Error'], ['disabled', 'Disabled'], ['readonly', 'Read-only']];
export const AllStates: Story = {
  name: 'All states',  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => <StateTable cols={['No text entered', 'Text entered']} rows={STATES.map(([st, l]) => ({ label: l, cells: [false, true].map(v => (
    <div style={{ width: 220 }}><TextArea label="Label" required hint="More about this field" leadingIcon placeholder="Placeholder" message="info message" showCounter
      defaultValue={v ? 'Text' : undefined} className={st.startsWith('is-') ? st : undefined} error={st === 'error' ? 'error message' : undefined} disabled={st === 'disabled'} readOnly={st === 'readonly'} /></div>)) }))} />,
};
