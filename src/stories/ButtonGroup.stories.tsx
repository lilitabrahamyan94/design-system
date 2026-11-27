import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonGroup } from '../components/Button';

const meta = {
  title: 'Components/Button Group',
  component: ButtonGroup,
  parameters: { docs: { description: { component: 'Groups cluster actions for the same context. Buttons are 8px apart. Primary and Secondary can share a group; the Primary sits last and is only for the most important action.' } } },
  args: { children: null },
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const group = (n: number, size: 'm' | 's') => (
  <ButtonGroup aria-label="Actions">{Array.from({ length: n }, (_, i) => <Button key={i} size={size} variant={i === n - 1 ? 'primary' : 'secondary'}>Button Label</Button>)}</ButtonGroup>
);
export const PrimaryAndSecondary: Story = { name: 'Primary + Secondary · M', render: () => <div style={{ display: 'grid', gap: 12 }}>{[2, 3, 4, 5].map(n => <div key={n}>{group(n, 'm')}</div>)}</div> };
export const SizeS: Story = { name: 'Primary + Secondary · S', render: () => <div style={{ display: 'grid', gap: 12 }}>{[2, 3, 4, 5].map(n => <div key={n}>{group(n, 's')}</div>)}</div> };
export const Tertiary: Story = { name: 'Tertiary', render: () => <ButtonGroup aria-label="Table actions">{['Selected period', 'Configure', 'Filter'].map(l => <Button key={l} variant="tertiary" leadingIcon>{l}</Button>)}</ButtonGroup> };
