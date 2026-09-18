import React from 'react';
import { QaheraVariant, QaheraSize } from './types';
import { Icon } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  tone?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'danger' | 'warning' | 'dark' | 'light';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'default' | 'rounded' | 'flat' | 'circle';
  buttonStyle?: 'solid' | 'gradient' | 'light' | 'outline' | 'outline-light';
  isLoading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  tone,
  size = 'md',
  shape = 'default',
  buttonStyle = 'solid',
  isLoading = false,
  disabled = false,
  className = '',
  iconStart,
  iconEnd,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const classes = [
    'qhr-btn',
    `qhr-btn--${variant}`,
    `qhr-btn--${size}`,
    tone ? `qhr-btn--tone-${tone}` : '',
    shape !== 'default' ? `qhr-btn--${shape}` : '',
    buttonStyle === 'gradient' ? 'qhr-btn--gradient' : '',
    buttonStyle === 'light' ? 'qhr-btn--light' : '',
    buttonStyle === 'outline-light' ? 'qhr-btn--outline-light' : '',
    isLoading ? 'is-loading' : '',
    isDisabled ? 'is-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      data-variant={variant}
      data-size={size}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="qhr-btn-icon-start">
          <Icon name="spinner" size={size} />
        </span>
      ) : iconStart ? (
        <span className="qhr-btn-icon-start">{iconStart}</span>
      ) : null}

      {children && <span className="qhr-btn-label">{children}</span>}

      {!isLoading && iconEnd && (
        <span className="qhr-btn-icon-end">{iconEnd}</span>
      )}
    </button>
  );
};
