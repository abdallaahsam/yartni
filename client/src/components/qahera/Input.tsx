import React from 'react';
import { QaheraSize } from './types';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: QaheraSize;
  error?: boolean | string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  size = 'md',
  error = false,
  startAdornment,
  endAdornment,
  className = '',
  disabled,
  ...props
}) => {
  const hasError = Boolean(error);

  const wrapperClasses = [
    'qhr-input-wrapper',
    `qhr-input-wrapper--${size}`,
    hasError ? 'is-invalid' : '',
    disabled ? 'is-disabled' : '',
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'qhr-input',
    `qhr-input--${size}`,
    hasError ? 'is-invalid' : '',
    className,
  ].filter(Boolean).join(' ');

  if (startAdornment || endAdornment) {
    return (
      <div className={wrapperClasses}>
        {startAdornment && (
          <span className="qhr-input-adornment qhr-input-adornment--start">
            {startAdornment}
          </span>
        )}
        <input
          className={inputClasses}
          disabled={disabled}
          aria-invalid={hasError}
          {...props}
        />
        {endAdornment && (
          <span className="qhr-input-adornment qhr-input-adornment--end">
            {endAdornment}
          </span>
        )}
      </div>
    );
  }

  return (
    <input
      className={inputClasses}
      disabled={disabled}
      aria-invalid={hasError}
      {...props}
    />
  );
};
