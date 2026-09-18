import React from 'react';
import { QaheraTone } from './types';

export interface RibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'corner' | 'folded' | 'bookmark' | 'flat';
  placement?: 'start' | 'end';
  tone?: 'primary' | 'neutral' | 'dark' | 'success' | 'info' | 'warning' | 'danger' | 'luxury';
}

export const Ribbon: React.FC<RibbonProps> = ({
  variant = 'folded',
  placement = 'start',
  tone = 'primary',
  className = '',
  children,
  ...props
}) => {
  const variantClass = variant === 'folded' || variant === 'corner'
    ? `qhr-ribbon--${variant}-${placement}`
    : `qhr-ribbon--${variant}`;

  const classes = [
    'qhr-ribbon',
    variantClass,
    tone !== 'primary' ? `qhr-ribbon--${tone}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div role="status" className={classes} {...props}>
      {children}
    </div>
  );
};
