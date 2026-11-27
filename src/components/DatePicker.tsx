import { useState } from 'react';
import { Icon } from '../icons';
import { cx } from './cx';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const key = (d: Date) => d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();

export type DateRange = { start: Date | null; end: Date | null };
export type DatePickerProps = {
  /** Single date, or a range across two months */
  mode?: 'single' | 'range';
  /** Single mode: selected date */
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date) => void;
  /** Range mode: selected range */
  range?: DateRange;
  defaultRange?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  /** First month shown */
  defaultMonth?: Date;
  className?: string;
};

/** Calendar for picking a date or a date range. */
export function DatePicker({ mode = 'single', value, defaultValue = null, onChange, range, defaultRange = { start: null, end: null }, onRangeChange, defaultMonth, className }: DatePickerProps) {
  const start = defaultMonth ?? value ?? defaultValue ?? range?.start ?? defaultRange.start ?? new Date();
  const [view, setView] = useState({ y: start.getFullYear(), m: start.getMonth() });
  const [single, setSingle] = useState<Date | null>(defaultValue);
  const [rng, setRng] = useState<DateRange>(defaultRange);
  const day = value !== undefined ? value : single;
  const r = range ?? rng;
  const shift = (d: number) => setView(v => { const m = v.m + d; return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 }; });
  const choose = (d: Date) => {
    if (mode === 'single') { setSingle(d); onChange?.(d); return; }
    const next: DateRange = !r.start || r.end ? { start: d, end: null } : key(d) < key(r.start) ? { start: d, end: r.start } : { start: r.start, end: d };
    setRng(next); onRangeChange?.(next);
  };
  const month = (y: number, m: number, first: boolean, last: boolean) => {
    const lead = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate();
    return (
      <div className="ds-date__month" key={`${y}-${m}`}>
        <div className="ds-date__head">
          {first && <button type="button" className="ds-date__nav ds-date__nav--prev" aria-label="Previous month" onClick={() => shift(-1)}><Icon name="ui-component/ctl-arrow-right" /></button>}
          <span aria-live="polite">{MONTHS[m]} {y}</span>
          {last && <button type="button" className="ds-date__nav ds-date__nav--next" aria-label="Next month" onClick={() => shift(1)}><Icon name="ui-component/ctl-arrow-right" /></button>}
        </div>
        <div className="ds-date__grid" aria-label={`${MONTHS[m]} ${y}`} role="group">
          {WEEK.map(w => <span key={w} className="ds-date__wd" aria-hidden="true">{w}</span>)}
          {Array.from({ length: lead }, (_, i) => <span key={`e${i}`} />)}
          {Array.from({ length: n }, (_, i) => {
            const d = new Date(y, m, i + 1), k = key(d);
            const selected = mode === 'single' ? !!day && k === key(day) : (!!r.start && k === key(r.start)) || (!!r.end && k === key(r.end));
            const inRange = mode === 'range' && !!r.start && !!r.end && k > key(r.start) && k < key(r.end);
            return <button key={i} type="button" className={cx('ds-date__day', inRange && 'is-range')} aria-pressed={selected}
              aria-label={`${i + 1} ${MONTHS[m]} ${y}`} onClick={() => choose(d)}>{i + 1}</button>;
          })}
        </div>
      </div>
    );
  };
  const second = { y: view.m === 11 ? view.y + 1 : view.y, m: (view.m + 1) % 12 };
  return (
    <div className={cx('ds-date', className)} role="group" aria-label={mode === 'range' ? 'Choose a date range' : 'Choose a date'}>
      {mode === 'range' ? <>{month(view.y, view.m, true, false)}{month(second.y, second.m, false, true)}</> : month(view.y, view.m, true, true)}
    </div>
  );
}
