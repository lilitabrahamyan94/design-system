import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileItem, FileUploadDemo, Uploader } from '../components/FileUpload';
import { StateTable, notes, stateControl } from './helpers';

const meta = {
  title: 'Components/File Upload',
  component: Uploader,
  args: { size: 'l', title: 'Drag & Drop or Browse Document', hint: 'max 120mb (format .pdf)', accept: '.pdf', className: 'default' },
  argTypes: { size: { control: 'inline-radio', options: ['l', 's'] }, className: stateControl(['hover']) },
  decorators: [(S, c) => c.parameters.fullWidth ? <S /> : <div style={{ maxWidth: 432 }}><S /></div>],
  parameters: { docs: { description: { component: notes('Lets users upload documents by drag and drop, or by browsing. Each file then shows its status: uploaded, in progress, success or error. `Uploader` is the drop zone, and `FileItem` is one file row.', [
    'The uploader text is off-token: the title is pure #000 and the hint is #8A8A8A. Gray-96 and Gray-48 are used instead.',
    '**A red ✕ removes files in every state**, including success. Red usually means error, so a grey ✕ would be calmer.',
    'The Attach File description is copied from Toggles ("Switches are best used…"). "Uploaderեռ" has stray Armenian letters. "Bacground" and "FIle" are typos.',
  ]) } } },
} satisfies Meta<typeof Uploader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const LiveFlow: Story = { name: 'Try it: upload flow', render: () => <FileUploadDemo />, parameters: { controls: { disable: true }, docs: { description: { story: 'Drop or choose a file. A PDF shows progress, then success. Any other type shows the error state. Nothing is uploaded.' } } } };

const noop = () => {};
const ROWS: Array<[string, object]> = [
  ['Uploaded', { status: 'uploaded' }], ['Success', { status: 'success' }], ['In progress', { status: 'progress', progress: 15 }],
  ['With checkbox', { selectable: true }], ['With checkbox, checked', { selectable: true, selected: true }], ['Error', { status: 'error', onReplace: noop }],
];
export const AllStates: Story = {
  name: 'All states', parameters: { controls: { disable: true }, fullWidth: true },
  render: () => <>
    <StateTable cols={['Size L', 'Size S']} rows={[['Default', ''], ['Hover', 'is-hover']].map(([l, st]) => ({ label: l, cells: [<div style={{ width: 432 }}><Uploader className={st || undefined} /></div>, <div style={{ width: 272 }}><Uploader size="s" className={st || undefined} /></div>] }))} />
    <h3 style={{ font: '500 14px var(--font-family-sans)', margin: '32px 0 12px' }}>File rows</h3>
    <StateTable cols={['Size L', 'Size L · hover', 'Size S']} rows={ROWS.map(([l, p]) => ({ label: l, cells: [
      <div style={{ width: 432 }}><FileItem name="thefilename.format" onRemove={noop} {...p} /></div>,
      <div style={{ width: 432 }}><FileItem name="thefilename.format" onRemove={noop} className="is-hover" {...p} /></div>,
      <div style={{ width: 272 }}><FileItem name="thefilename.format" onRemove={noop} size="s" {...p} /></div>,
    ] }))} />
  </>,
};
