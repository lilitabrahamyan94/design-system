import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { StateTable, notes, stateControl } from './helpers';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button Label', variant: 'primary', size: 'm', leadingIcon: true, menu: false, block: false, disabled: false, className: 'default' },
  argTypes: {
    className: stateControl(['hover', 'click', 'focus']),
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'inline-radio', options: ['m', 's'] },
    leadingIcon: { control: 'boolean' },
    menu: { name: 'menu (nested option)' },
    block: { name: 'block (centered)' },
  },
  parameters: {
    docs: { description: { component: notes('Buttons trigger an operation. Choose the type by how important the action is: **Primary** once per view, **Secondary** for other actions, **Tertiary** for low-emphasis actions.\n\n**Label dependent** buttons fit their label and can have a nested option (`menu`). **Centered** buttons (`block`) fill their container.', [
      '**Focus ring is too faint.** Primary uses #006ECE at 16% (about 1.2:1 on white), and Secondary and Tertiary use 32%. WCAG 2.2 asks for 3:1.',
      '**Tertiary hover and click look the same.** Both are hard-coded #185284, not a token.',
      'The Figma component has a **Dark surface mode** that is not documented yet.',
      'Variable name typos: "Tertirary", "Backgroung".',
    ]) } },
  },
  decorators: [(S, c) => c.args.block ? <div style={{ width: 280 }}><S /></div> : <S />],
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

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
export const AllStates: Story = {
  name: 'All states',
  render: () => <><h3 style={{ font: '500 14px var(--font-family-sans)' }}>Label dependent</h3>{matrix({ menu: true })}<h3 style={{ font: '500 14px var(--font-family-sans)' }}>Centered</h3>{matrix({ block: true })}</>,
  parameters: { controls: { disable: true } },
};
