import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../icons';
import { cx } from './cx';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual weight. Use Primary once per view, for the main action. */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** M = 32px, S = 24px */
  size?: 'm' | 's';
  /** Icon before the label. `true` shows the placeholder icon from Figma. */
  leadingIcon?: ReactNode | boolean;
  /** "Centered" alignment from Figma: fills its container. */
  block?: boolean;
  /** Adds a nested option (split button). Not available for Tertiary or Centered. */
  menu?: boolean;
  /** Called when the dropdown part of a split button is clicked. */
  onMenuClick?: () => void;
  /** Accessible name of the dropdown part. */
  menuLabel?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'm', leadingIcon, block, menu, onMenuClick, menuLabel = 'More options', className, children, disabled, type = 'button', ...rest },
  ref,
) {
  const icon = leadingIcon === true ? <Icon name="ui-component/icon-placeholder" className="btn__icon" /> : leadingIcon ? <span className="btn__icon" aria-hidden="true">{leadingIcon}</span> : null;
  const mods = cx(`btn--${variant}`, size === 's' && 'btn--s', block && 'btn--block');
  const inner = <>{icon}<span className="btn__label">{children}</span></>;

  if (menu && variant !== 'tertiary' && !block) {
    return (
      <div className={cx('btn-split', mods, disabled && 'is-disabled', className)}>
        <button ref={ref} type={type} className="btn__main" disabled={disabled} {...rest}>{inner}</button>
        <button type="button" className="btn__menu" aria-label={menuLabel} aria-haspopup="menu" disabled={disabled} onClick={onMenuClick}>
          <Icon name="ui-component/icon-arrow-drop-down" className="btn__icon" />
        </button>
      </div>
    );
  }
  return <button ref={ref} type={type} className={cx('btn', mods, className)} disabled={disabled} {...rest}>{inner}</button>;
});

export type ButtonGroupProps = { children: ReactNode; className?: string; 'aria-label'?: string };
/** Clusters actions for the same context. Buttons sit 8px apart; put Primary last. */
export function ButtonGroup({ children, className, ...rest }: ButtonGroupProps) {
  return <div role="group" className={cx('btn-group', className)} {...rest}>{children}</div>;
}
