import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonGroup } from '../components/Button';

type Args = { count: number; size: 'm' | 's'; kind: 'primary + secondary' | 'tertiary' };
const meta: Meta<Args> = {
  title: 'Components/Button Group',
  component: ButtonGroup as never,
  args: { count: 3, size: 'm', kind: 'primary + secondary' },
  argTypes: {
    count: { name: 'number of buttons', control: { type: 'range', min: 2, max: 7, step: 1 } },
    size: { control: 'inline-radio', options: ['m', 's'] },
    kind: { control: 'inline-radio', options: ['primary + secondary', 'tertiary'] },
  },
  render: ({ count, size, kind }) => (
    <ButtonGroup aria-label="Actions">{Array.from({ length: count }, (_, i) => kind === 'tertiary'
      ? <Button key={i} size={size} variant="tertiary" leadingIcon>Button Label</Button>
      : <Button key={i} size={size} variant={i === count - 1 ? 'primary' : 'secondary'}>Button Label</Button>)}</ButtonGroup>
  ),
  parameters: { docs: { description: { component: 'Groups cluster actions for the same context. Buttons are 8px apart. Primary and Secondary can share a group; the Primary sits last and is only for the most important action.' } } },
};
export default meta;
export const Playground: StoryObj<Args> = {};
