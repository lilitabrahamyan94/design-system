import { useEffect, useId, useRef, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { Icon } from '../icons';
import { cx } from './cx';

export type MessageType = 'info' | 'success' | 'warning' | 'error';
export type FieldBaseProps = {
  /** Field label, shown above the control */
  label: string;
  /** Shows the red asterisk and sets `required` on the control */
  required?: boolean;
  /** Extra context shown from the info icon next to the label */
  hint?: string;
  /** Assistive message under the field */
  message?: string;
  /** Type of the assistive message */
  messageType?: MessageType;
  /** Error text. Turns the field red and overrides `message`. */
  error?: string;
  /** Shows "n/max symbols" under the field */
  showCounter?: boolean;
  /** Leading icon inside the field. `true` shows the account icon from Figma. */
  leadingIcon?: boolean | string;
  /** Wrapper class, e.g. "is-hover" or "is-focus" to show a state in docs */
  className?: string;
};

const MSG_ICON: Record<MessageType, string> = { info: 'field-info', success: 'field-success', warning: 'field-warning', error: 'field-error' };

export function AssistiveMessage({ type = 'info', id, children }: { type?: MessageType; id?: string; children: ReactNode }) {
  return (
    <span className={cx('field__msg', type !== 'info' && `field__msg--${type}`)} id={id}>
      <Icon name={`ui-component/${MSG_ICON[type]}`} /><span>{children}</span>
    </span>
  );
}

type ShellProps = FieldBaseProps & { id: string; state: { disabled?: boolean; readOnly?: boolean }; count?: number; max?: number; variant?: string; children: ReactNode; after?: ReactNode };
function Shell({ label, required, hint, message, messageType = 'info', error, showCounter, id, state, count = 0, max, variant, className, children, after }: ShellProps) {
  const msg = error ?? message;
  return (
    <div className={cx('field', variant, error && 'is-error', state.disabled && 'is-disabled', state.readOnly && 'is-readonly', className)}>
      <div className="field__head">
        <label className="field__label" htmlFor={id}>{required && <span className="field__req" aria-hidden="true">*</span>}{label}</label>
        {hint && <span className="field__hint" title={hint} role="img" aria-label={hint}><Icon name="ui-component/field-info" /></span>}
      </div>
      {children}
      {(msg || showCounter) && (
        <div className="field__foot">
          {msg ? <AssistiveMessage type={error ? 'error' : messageType} id={`${id}-msg`}>{msg}</AssistiveMessage> : <span />}
          {showCounter && max && <span className="field__count">{count}/{max} symbols</span>}
        </div>
      )}
      {after}
    </div>
  );
}

const leading = (li: FieldBaseProps['leadingIcon']) => li ? <span className="field__icon" aria-hidden="true"><Icon name={li === true ? 'ui-component/field-account' : li} /></span> : null;

export type InputProps = FieldBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> & {
  /** Fixed text before the value, e.g. "$" */
  prefix?: string;
  /** Fixed text after the value, e.g. "kg" */
  suffix?: string;
};

/** Single-line text or numeric input. */
export function Input({ label, required, hint, message, messageType, error, showCounter, leadingIcon, className, prefix, suffix, id, maxLength = showCounter ? 150 : undefined, onChange, ...input }: InputProps) {
  const auto = useId(); const fid = id ?? auto;
  const [count, setCount] = useState(String(input.value ?? input.defaultValue ?? '').length);
  useEffect(() => { if (input.value !== undefined) setCount(String(input.value).length); }, [input.value]);
  return (
    <Shell {...{ label, required, hint, message, messageType, error, showCounter, className }} id={fid} state={input} count={count} max={maxLength}>
      <div className="field__control">
        {leading(leadingIcon)}
        <span className="field__body">
          {prefix && <span className="field__affix">{prefix}</span>}
          <input className="field__input" id={fid} required={required} maxLength={maxLength} aria-invalid={error ? true : undefined}
            aria-describedby={error || message ? `${fid}-msg` : undefined}
            onChange={e => { setCount(e.target.value.length); onChange?.(e); }} {...input} />
        </span>
        {suffix && <span className="field__affix field__suffix">{suffix}</span>}
      </div>
    </Shell>
  );
}

export type TextAreaProps = FieldBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;
/** Multi-line text, like comments or descriptions. */
export function TextArea({ label, required, hint, message, messageType, error, showCounter, leadingIcon, className, id, maxLength = showCounter ? 150 : undefined, onChange, rows = 3, ...ta }: TextAreaProps) {
  const auto = useId(); const fid = id ?? auto;
  const [count, setCount] = useState(String(ta.value ?? ta.defaultValue ?? '').length);
  return (
    <Shell {...{ label, required, hint, message, messageType, error, showCounter, className }} variant="field--textarea" id={fid} state={ta} count={count} max={maxLength}>
      <div className="field__control">
        {leading(leadingIcon)}
        <span className="field__body">
          <textarea className="field__input" id={fid} rows={rows} required={required} maxLength={maxLength} aria-invalid={error ? true : undefined}
            aria-describedby={error || message ? `${fid}-msg` : undefined}
            onChange={e => { setCount(e.target.value.length); onChange?.(e); }} {...ta} />
        </span>
      </div>
    </Shell>
  );
}

export type SelectOption = string | { value: string; label: string };
export type SelectProps = FieldBaseProps & {
  options: SelectOption[];
  /** Allow several choices, shown as removable labels */
  multiple?: boolean;
  /** Controlled value: a string, or an array when `multiple` */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** Opens the dropdown on first render (useful for docs) */
  defaultOpen?: boolean;
  id?: string;
};

/** Pick one or several options from a fixed list. */
export function Select({ label, required, hint, message, messageType, error, leadingIcon = false, className, options, multiple, value, defaultValue, onChange, placeholder = 'Placeholder', disabled, readOnly, defaultOpen = false, id }: SelectProps) {
  const auto = useId(); const fid = id ?? auto; const lid = `${fid}-list`;
  const opts = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);
  const toArr = (v?: string | string[]) => v === undefined ? [] : Array.isArray(v) ? v : v ? [v] : [];
  const [inner, setInner] = useState<string[]>(toArr(defaultValue));
  const sel = value !== undefined ? toArr(value) : inner;
  const [open, setOpen] = useState(defaultOpen);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const trig = useRef<HTMLButtonElement>(null);
  const locked = disabled || readOnly;
  const commit = (next: string[]) => { setInner(next); onChange?.(multiple ? next : next[0] ?? ''); };
  const pick = (v: string) => {
    if (multiple) commit(sel.includes(v) ? sel.filter(x => x !== v) : [...sel, v]);
    else { commit([v]); setOpen(false); trig.current?.focus(); }
  };
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const onKey = (e: React.KeyboardEvent) => {
    if (locked) return;
    const move = (d: number) => { e.preventDefault(); setOpen(true); setActive(a => (a + d + opts.length) % opts.length); };
    if (e.key === 'ArrowDown') move(1); else if (e.key === 'ArrowUp') move(-1);
    else if ((e.key === 'Enter' || e.key === ' ') && open && active > -1) { e.preventDefault(); pick(opts[active].value); }
    else if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'Backspace' && multiple && sel.length) commit(sel.slice(0, -1));
  };
  const labelOf = (v: string) => opts.find(o => o.value === v)?.label ?? v;
  return (
    <Shell {...{ label, required, hint, message, messageType, error, className }} variant={cx('field--select', open && 'is-open')} id={fid} state={{ disabled, readOnly }}>
      <div className="field__box" ref={box}>
        <div className="field__control" onClick={() => !locked && setOpen(o => !o)}>
          {leading(leadingIcon)}
          <button ref={trig} type="button" className="field__trigger" id={fid} role="combobox" aria-haspopup="listbox" aria-controls={lid} aria-expanded={open}
            aria-activedescendant={open && active > -1 ? `${lid}-${active}` : undefined} aria-invalid={error ? true : undefined}
            aria-readonly={readOnly || undefined} disabled={disabled} onKeyDown={onKey}>
            {multiple && sel.length ? (
              <span className="ftags">{sel.map(v => (
                <span className="ftag" key={v}>{labelOf(v)}
                  {!locked && <span className="ftag__x" role="button" aria-label={`Remove ${labelOf(v)}`} onClick={e => { e.stopPropagation(); commit(sel.filter(x => x !== v)); }}><Icon name="ui-component/field-chip-close" /></span>}
                </span>))}</span>
            ) : <span className={cx('field__value', !sel.length && 'is-placeholder')}>{sel.length ? labelOf(sel[0]) : placeholder}</span>}
          </button>
          {!multiple && sel.length > 0 && !locked && (
            <button type="button" className="field__btn field__btn--clear" aria-label="Clear selection" onClick={e => { e.stopPropagation(); commit([]); }}><Icon name="ui-component/field-clear" /></button>
          )}
          <span className="field__btn" aria-hidden="true">{!readOnly && <Icon name={open ? 'ui-component/field-arrow-up' : 'ui-component/field-arrow-down'} />}</span>
        </div>
        <ul className="dropdown" id={lid} role="listbox" aria-multiselectable={multiple || undefined} aria-label={label} hidden={!open}>
          {opts.map((o, i) => (
            <li key={o.value} id={`${lid}-${i}`} role="option" aria-selected={sel.includes(o.value)} className={cx('dropdown__item', i === active && 'is-active')}
              onMouseDown={e => e.preventDefault()} onClick={() => pick(o.value)}>{o.label}</li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
