import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../icons';
import { Button } from './Button';
import { Checkbox } from './Choice';
import { cx } from './cx';

export type UploaderProps = {
  /** L: stacked, 96px tall. S: one row. */
  size?: 'l' | 's';
  title?: string;
  hint?: string;
  /** Passed to the file input, e.g. ".pdf" */
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
  className?: string;
};

/** Drop zone + browse button for documents. */
export function Uploader({ size = 'l', title = 'Drag & Drop or Browse Document', hint = 'max 120mb (format .pdf)', accept, multiple, onFiles, className }: UploaderProps) {
  const [drag, setDrag] = useState(false);
  const send = (list: FileList | null) => list && list.length && onFiles?.([...list]);
  return (
    <label className={cx('ds-upload', size === 's' && 'ds-upload--s', drag && 'is-drag', className)}
      onDragEnter={e => { e.preventDefault(); setDrag(true); }} onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); send(e.dataTransfer.files); }}>
      <input type="file" accept={accept} multiple={multiple} onChange={e => { send(e.target.files); e.target.value = ''; }} />
      <span className="ds-upload__icon" aria-hidden="true"><Icon name="ui-component/ctl-upload" /></span>
      <span><span className="ds-upload__title">{title}</span><br /><span className="ds-upload__hint">{hint}</span></span>
    </label>
  );
}

export type FileStatus = 'uploaded' | 'success' | 'progress' | 'error';
export type FileItemProps = {
  name: string;
  status?: FileStatus;
  /** Second line: upload date, or error reason */
  meta?: string;
  /** 0–100, for status "progress" */
  progress?: number;
  /** L shows the meta line, S shows the name only */
  size?: 'l' | 's';
  /** Shows a checkbox instead of the file icon */
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onRemove?: () => void;
  /** Shown on error rows */
  onReplace?: () => void;
  className?: string;
};

const STATUS_ICON: Record<FileStatus, string> = { uploaded: 'ctl-file', progress: 'ctl-file', success: 'ctl-success', error: 'ctl-error' };

/** One uploaded document, with its status. */
export function FileItem({ name, status = 'uploaded', meta, progress = 0, size = 'l', selectable, selected, onSelect, onRemove, onReplace, className }: FileItemProps) {
  const line = meta ?? (status === 'progress' ? `Uploaded ${Math.round(progress)}%` : 'Uploaded: 00.00.0000');
  return (
    <div className={cx('ds-file', size === 's' && 'ds-file--s', status === 'success' && 'ds-file--success', status === 'error' && 'ds-file--error', selectable && 'ds-file--check', className)}>
      <span className="ds-file__icon">{selectable ? <Checkbox aria-label={`Select ${name}`} checked={!!selected} onChange={e => onSelect?.(e.target.checked)} /> : <Icon name={`ui-component/${STATUS_ICON[status]}`} />}</span>
      <span className="ds-file__body"><span className="ds-file__name">{name}</span><span className="ds-file__meta">{line}</span></span>
      {status === 'error' && onReplace && <Button variant="secondary" size="s" onClick={onReplace}>Replace</Button>}
      {status !== 'progress' && onRemove && <button type="button" className="ds-file__remove" aria-label={`Remove ${name}`} onClick={onRemove}><Icon name="ui-component/ctl-close" /></button>}
      {status === 'progress' && <span className="ds-file__bar" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`Uploading ${name}`} />}
    </div>
  );
}

export function FileList({ children }: { children: ReactNode }) {
  return <div className="ds-files" aria-live="polite">{children}</div>;
}

type Row = { id: number; file: File; status: FileStatus; progress: number; meta?: string };
/** Demo of the full flow: drop files, see progress, then success or an error. Nothing is uploaded. */
export function FileUploadDemo({ accept = '.pdf', maxMb = 120 }: { accept?: string; maxMb?: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const next = useRef(1);
  useEffect(() => {
    if (!rows.some(r => r.status === 'progress')) return;
    const t = setTimeout(() => setRows(rs => rs.map(r => {
      if (r.status !== 'progress') return r;
      const p = Math.min(100, r.progress + 8 + Math.random() * 18);
      return p >= 100 ? { ...r, status: 'success', progress: 100, meta: `Uploaded: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}` } : { ...r, progress: p };
    })), 180);
    return () => clearTimeout(t);
  }, [rows]);
  const add = (files: File[]) => setRows(rs => [...files.map(f => {
    const okType = f.name.toLowerCase().endsWith(accept.replace('*', ''));
    const okSize = f.size <= maxMb * 1024 * 1024;
    return { id: next.current++, file: f, status: (okType && okSize ? 'progress' : 'error') as FileStatus, progress: 0,
      meta: !okType ? `Only ${accept} files are allowed` : !okSize ? `File is over ${maxMb} MB` : undefined };
  }), ...rs]);
  return (
    <div style={{ maxWidth: 432, display: 'grid', gap: 8 }}>
      <Uploader accept={accept} multiple onFiles={add} />
      <FileList>{rows.map(r => <FileItem key={r.id} name={r.file.name} status={r.status} progress={r.progress} meta={r.meta} onRemove={() => setRows(rs => rs.filter(x => x.id !== r.id))} />)}</FileList>
    </div>
  );
}
