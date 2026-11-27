import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../icons';
import { cx } from './cx';

export type TabItem = { id: string; label: string; disabled?: boolean; content?: ReactNode };
export type TabsProps = {
  items: TabItem[];
  /** Controlled selected tab id */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Built in: inside a card or popup. Solo: standalone in the page. */
  variant?: 'built-in' | 'solo';
  /** Accessible name of the tab list */
  label?: string;
  className?: string;
};

/** Switch between sections of the same kind of content. Equal widths up to 8 tabs; more tabs scroll with arrows. */
export function Tabs({ items, value, defaultValue, onChange, variant = 'built-in', label = 'Tabs', className }: TabsProps) {
  const uid = useId();
  const [inner, setInner] = useState(defaultValue ?? items.find(i => !i.disabled)?.id);
  const sel = value ?? inner;
  const scroll = items.length > 8;
  const list = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [edge, setEdge] = useState({ start: true, end: false });
  const select = (id: string) => { setInner(id); onChange?.(id); refs.current[id]?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); };
  const enabled = items.filter(i => !i.disabled);
  const onKey = (e: React.KeyboardEvent, id: string) => {
    const i = enabled.findIndex(t => t.id === id);
    const to = e.key === 'ArrowRight' ? enabled[(i + 1) % enabled.length] : e.key === 'ArrowLeft' ? enabled[(i - 1 + enabled.length) % enabled.length]
      : e.key === 'Home' ? enabled[0] : e.key === 'End' ? enabled[enabled.length - 1] : null;
    if (to) { e.preventDefault(); refs.current[to.id]?.focus(); select(to.id); }
  };
  useEffect(() => {
    const el = list.current; if (!el || !scroll) return;
    const upd = () => setEdge({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
    upd(); el.addEventListener('scroll', upd); const ro = new ResizeObserver(upd); ro.observe(el);
    return () => { el.removeEventListener('scroll', upd); ro.disconnect(); };
  }, [scroll]);
  const current = items.find(i => i.id === sel);
  return (
    <div className={className}>
      <div className={cx('ds-tabs', variant === 'solo' && 'ds-tabs--solo', scroll && 'ds-tabs--scroll')}>
        {scroll && <button type="button" className="ds-tabs__arrow ds-tabs__arrow--prev" aria-label="Scroll tabs left" disabled={edge.start} onClick={() => list.current?.scrollBy({ left: -280 })}><Icon name="ui-component/ctl-arrow-left" /></button>}
        <div className="ds-tabs__list" role="tablist" aria-label={label} ref={list}>
          {items.map(t => (
            <button key={t.id} ref={el => { refs.current[t.id] = el; }} type="button" role="tab" id={`${uid}-${t.id}`} className="ds-tab"
              aria-selected={t.id === sel} aria-controls={t.content !== undefined ? `${uid}-panel` : undefined} aria-disabled={t.disabled || undefined}
              tabIndex={t.id === sel ? 0 : -1} onClick={() => !t.disabled && select(t.id)} onKeyDown={e => onKey(e, t.id)}><span>{t.label}</span></button>
          ))}
        </div>
        {scroll && <button type="button" className="ds-tabs__arrow ds-tabs__arrow--next" aria-label="Scroll tabs right" disabled={edge.end} onClick={() => list.current?.scrollBy({ left: 280 })}><Icon name="ui-component/ctl-arrow-right" /></button>}
      </div>
      {current?.content !== undefined && <div className="ds-tabpanel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${current.id}`} tabIndex={0}>{current.content}</div>}
    </div>
  );
}
