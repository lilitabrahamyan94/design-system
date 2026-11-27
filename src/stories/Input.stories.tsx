import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, AssistiveMessage } from '../components/Field';
import { StateTable, notes } from './helpers';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { label: 'Label', required: true, hint: 'More about this field', placeholder: 'Placeholder', message: 'info message', showCounter: true, leadingIcon: true, prefix: 'Prefix', suffix: 'Suffix', disabled: false, readOnly: false },
  argTypes: { messageType: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] }, leadingIcon: { control: 'boolean' } },
  decorators: [(S, c) => c.parameters.fullWidth ? <S /> : <div style={{ width: 240 }}><S /></div>],
  parameters: { docs: { description: { component: notes('Input takes a single line of text or numbers, like a name, email or password. It uses a real `<input>`, so all native attributes work (`type`, `inputMode`, `autoComplete`...).\n\n**Anatomy:** asterisk (required) · label · field description (info icon) · leading icon · prefix/suffix · placeholder · value · assistive message · symbol counter.', [
    '**Disabled and Read-only look swapped.** Disabled keeps a white background, and Read-only uses the variable named "Background Disabled" (#EBEBEB).',
    '**Disabled fields still show a blue info message.**',
    '**Focus is a 1px colour change only**, which is easy to miss next to Hover.',
    '**Warning text #F2A455 is about 2:1 on white**, and Success #48A348 about 3.2:1. 11px text needs 4.5:1.',
  ]) } } },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: 'Value' } };
export const Error: Story = { args: { defaultValue: 'Value', error: 'error message' } };
export const Disabled: Story = { args: { defaultValue: 'Value', disabled: true } };
export const ReadOnly: Story = { name: 'Read-only', args: { defaultValue: 'Value', readOnly: true } };
export const Minimal: Story = { args: { label: 'Email', type: 'email', placeholder: 'name@company.com', prefix: undefined, suffix: undefined, leadingIcon: false, showCounter: false, message: undefined, hint: undefined } };

const STATES: Array<[string, string]> = [['', 'Default'], ['is-hover', 'Hover'], ['is-focus', 'Focused'], ['error', 'Error'], ['disabled', 'Disabled'], ['readonly', 'Read-only']];
export const AllStates: Story = {
  name: 'All states',
  
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => <StateTable cols={['No value entered', 'Value entered']} rows={STATES.map(([st, l]) => ({ label: l, cells: [false, true].map(v => (
    <div style={{ width: 220 }}><Input label="Label" required hint="More about this field" leadingIcon prefix="Prefix" suffix="Suffix" placeholder="Placeholder" message="info message" showCounter
      defaultValue={v ? 'Value' : undefined} className={st.startsWith('is-') ? st : undefined} error={st === 'error' ? 'error message' : undefined} disabled={st === 'disabled'} readOnly={st === 'readonly'} /></div>)) }))} />,
};
export const MessageTypes: Story = {
  name: 'Assistive message types',  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => <div style={{ display: 'flex', gap: 32, fontSize: 11, lineHeight: '16px' }}>{(['info', 'success', 'error', 'warning'] as const).map(t => <AssistiveMessage key={t} type={t}>{t} message</AssistiveMessage>)}</div>,
};
