import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonGroup } from '../components/Button';
import { StateTable, notes } from './helpers';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button Label', variant: 'primary', size: 'm', leadingIcon: true, menu: false, block: false, disabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'inline-radio', options: ['m', 's'] },
    leadingIcon: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: notes('Buttons trigger an operation. Choose the type by how important the action is: **Primary** once per view, **Secondary** for other actions, **Tertiary** for low-emphasis actions.\n\n**Label dependent** buttons fit their label and can have a nested option (`menu`). **Centered** buttons (`block`) fill their container.', [
      '**Focus ring is too faint.** Primary uses #006ECE at 16% (about 1.2:1 on white), and Secondary and Tertiary use 32%. WCAG 2.2 asks for 3:1.',
      '**Tertiary hover and click look the same.** Both are hard-coded #185284, not a token.',
      'The Figma component has a **Dark surface mode** that is not documented yet.',
      'Variable name typos: "Tertirary", "Backgroung".',
    ]) } },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };
export const SplitButton: Story = { name: 'With nested option', args: { menu: true, menuLabel: 'More export options', children: 'Export' } };
export const Centered: Story = { args: { block: true, children: 'Continue', leadingIcon: false }, decorators: [S => <div style={{ width: 280 }}><S /></div>] };
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: { disabled: true } };

const STATES = [['', 'Default'], ['is-hover', 'Hover'], ['is-active', 'Click Response'], ['disabled', 'Disabled'], ['is-focus', 'Focused']] as const;
const matrix = (extra: { menu?: boolean; block?: boolean }) => (['m', 's'] as const).map(size => (
  <div key={size} style={{ marginBottom: 24 }}>
    <h4 style={{ font: '500 12px var(--font-family-sans)', margin: '0 0 8px' }}>Size {size.toUpperCase()} · {size === 'm' ? 32 : 24}px</h4>
    <StateTable cols={STATES.map(s => s[1])} rows={(['primary', 'secondary', 'tertiary'] as const).map(v => ({
      label: v[0].toUpperCase() + v.slice(1),
      cells: STATES.map(([st]) => <div style={extra.block ? { width: 140 } : undefined}><Button variant={v} size={size} leadingIcon {...extra} disabled={st === 'disabled'} className={st && st !== 'disabled' ? st : undefined}>Button Label</Button></div>),
    }))} />
  </div>
));
export const AllStatesLabelDependent: Story = { name: 'All states · Label dependent', render: () => <>{matrix({ menu: true })}</>, parameters: { controls: { disable: true } } };
export const AllStatesCentered: Story = { name: 'All states · Centered', render: () => <>{matrix({ block: true })}</>, parameters: { controls: { disable: true } } };
