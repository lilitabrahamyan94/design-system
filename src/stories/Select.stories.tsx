import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '../components/Field';
import { StateTable, notes } from './helpers';

const OPTIONS = ['Weekly', 'Monthly', 'Quarterly', 'Half-year', 'Yearly', 'Custom range'];
const meta = {
  title: 'Components/Select',
  component: Select,
  args: { label: 'Label', required: true, hint: 'More about this field', options: OPTIONS, placeholder: 'Placeholder', message: 'info message', leadingIcon: true, multiple: false, disabled: false, readOnly: false },
  argTypes: { leadingIcon: { control: 'boolean' } },
  decorators: [(S, c) => c.parameters.fullWidth ? <S /> : <div style={{ width: 240, minHeight: 330 }}><S /></div>],
  parameters: { docs: { description: { component: notes('Select picks one option (with a clear button) or several (shown as removable labels) from a fixed list.\n\n**Keyboard:** ↓/↑ open and move, Enter or Space picks, Esc closes, Backspace removes the last label in multi-select.', [
    '**Selected items use Inter Bold (700)**, which is not in the type scale (400/500/600).',
    'The chevron is #9698A2, an off-palette grey.',
    'The multi-select chip is called "Label", the same name as the field label.',
  ]) } } },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const SingleSelected: Story = { name: 'Single choice', args: { defaultValue: 'Quarterly' } };
export const MultiSelected: Story = { name: 'Multi choice', args: { multiple: true, defaultValue: ['Weekly', 'Monthly'] } };
export const Open: Story = { name: 'Focused + dropdown', args: { defaultValue: 'Quarterly', defaultOpen: true } };
export const Error: Story = { args: { error: 'error message' } };

const STATES: Array<[string, string]> = [['', 'Default'], ['is-hover', 'Hover'], ['is-focus', 'Focused'], ['error', 'Error'], ['disabled', 'Disabled'], ['readonly', 'Read-only']];
export const AllStates: Story = {
  name: 'All states',  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => <StateTable cols={['No value selected', 'Single-choice selected', 'Multi-choice selected']} rows={STATES.map(([st, l]) => ({ label: l, cells: ['', 'Quarterly', ['Weekly', 'Monthly']].map((v, i) => (
    <div style={{ width: 220 }}><Select label="Label" required hint="More about this field" leadingIcon options={OPTIONS} message="info message" multiple={i === 2}
      defaultValue={v || undefined} className={st.startsWith('is-') ? st : undefined} error={st === 'error' ? 'error message' : undefined} disabled={st === 'disabled'} readOnly={st === 'readonly'} /></div>)) }))} />,
};
