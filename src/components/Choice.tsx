import { forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../icons';
import { cx } from './cx';

type Base = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Text next to the control. Omit only when another element labels it (then pass aria-label). */
  label?: ReactNode;
  /** Wrapper class, e.g. "is-hover" to show a state in docs */
  className?: string;
};

export type ToggleProps = Base;
/** Switch for a setting that applies immediately, like on/off. */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle({ label, className, ...input }, ref) {
  return (
    <label className={cx('ds-toggle', className)}>
      <input ref={ref} type="checkbox" role="switch" {...input} />
      <span className="ds-toggle__track" aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
});

export type CheckboxProps = Base & {
  /** "Some selected" dash, for a select-all checkbox */
  indeterminate?: boolean;
};
/** Pick any number of options, or confirm one statement. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, className, indeterminate = false, ...input }, ref) {
  const inner = useRef<HTMLInputElement | null>(null);
  useEffect(() => { if (inner.current) inner.current.indeterminate = indeterminate; }, [indeterminate]);
  return (
    <label className={cx('ds-check', className)}>
      <input type="checkbox" {...input} ref={el => { inner.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }} />
      <span className="ds-check__box" aria-hidden="true">
        <span className="ds-check__tick"><Icon name="ui-component/ctl-check" /></span>
        <span className="ds-check__line"><Icon name="ui-component/ctl-line" /></span>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
});

export type RadioProps = Base;
/** One option in a RadioGroup. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ label, className, ...input }, ref) {
  return (
    <label className={cx('ds-radio', className)}>
      <input ref={ref} type="radio" {...input} />
      <span className="ds-radio__box" aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
});

export type RadioGroupProps = {
  /** Group name, shared by all radios */
  name: string;
  /** Accessible name of the group */
  label: string;
  options: Array<string | { value: string; label: string; disabled?: boolean }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Lay options out in a row */
  inline?: boolean;
};
/** Pick exactly one option from a short, visible list. */
export function RadioGroup({ name, label, options, value, defaultValue, onChange, inline = true }: RadioGroupProps) {
  return (
    <div role="radiogroup" aria-label={label} style={{ display: 'flex', flexDirection: inline ? 'row' : 'column', flexWrap: 'wrap', gap: inline ? '12px 24px' : 12 }}>
      {options.map(o => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        return <Radio key={opt.value} name={name} value={opt.value} label={opt.label} disabled={'disabled' in opt ? opt.disabled : undefined}
          {...(value !== undefined ? { checked: value === opt.value } : { defaultChecked: defaultValue === opt.value })}
          onChange={() => onChange?.(opt.value)} />;
      })}
    </div>
  );
}
