import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from '../components/DatePicker';
import { notes } from './helpers';

const meta = {
  title: 'Components/Date Picker',
  component: DatePicker,
  args: { mode: 'single', defaultValue: new Date(2025, 8, 16), defaultMonth: new Date(2025, 8, 1) },
  argTypes: { mode: { control: 'inline-radio', options: ['single', 'range'] } },
  parameters: { docs: { description: { component: notes('Pick a single date, or a range across two months. In range mode, the first click sets the start and the second sets the end.', [
    '**Selected date text is #EBEBEB on #006ECE**, about 4.4:1, just under the 4.5:1 needed for 12px text. White would pass.',
    'The Date Picker headings in Figma say "File / Uploaded with Checkbox Checked" (copied from Attach File).',
  ]) } } },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};
export const Range: Story = { args: { mode: 'range', defaultRange: { start: new Date(2025, 8, 16), end: new Date(2025, 9, 8) } } };
