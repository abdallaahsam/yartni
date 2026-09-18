import React from 'react';

export interface SealProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'subtle' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  subtext?: string;
}

export const Seal: React.FC<SealProps> = ({
  children,
  variant = 'solid',
  size = 'md',
  label = 'معتمد',
  subtext = 'ALWKALA',
  className = '',
  ...props
}) => {
  const classes = [
    'qhr-seal',
    `qhr-seal--${variant}`,
    `qhr-seal--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="status" {...props}>
      <div className="qhr-seal__ring">
        <div className="qhr-seal__emblem">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a6 6 0 100 12 6 6 0 000-12zm-8 14h16M6 18v2m12-2v2"/></svg>
        </div>
        <span className="qhr-seal__label">{label}</span>
        {subtext && <span className="qhr-seal__subtext">{subtext}</span>}
        {children}
      </div>
    </div>
  );
};
