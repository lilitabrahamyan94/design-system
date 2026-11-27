import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    a11y: { test: 'todo' },
    options: {
      storySort: { order: ['Introduction', 'Foundations', ['Colors', 'Typography', 'Icons'], 'Components', ['Button', 'Button Group', 'Input', 'Text Area', 'Select', 'Toggle', 'Tabs', 'Checkbox', 'Radio', 'File Upload', 'Date Picker']] },
    },
    backgrounds: { options: { papyrus: { name: 'Papyrus', value: '#fafafa' }, paper: { name: 'Paper', value: '#ffffff' } } },
  },
  initialGlobals: { backgrounds: { value: 'paper' } },
  tags: ['autodocs'],
};
export default preview;
