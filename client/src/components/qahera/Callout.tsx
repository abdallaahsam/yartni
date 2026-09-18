import React from 'react';
import { QaheraTone } from './types';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  tone?: QaheraTone;
  icon?: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({
  title,
  tone = 'neutral',
  icon,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'qhr-callout',
    tone !== 'neutral' ? `qhr-callout--${tone}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div role="note" className={classes} {...props}>
      {icon && <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>}
      <div style={{ flex: 1 }}>
        {title && <h4 className="qhr-callout-title">{title}</h4>}
        <div className="qhr-callout-body">{children}</div>
      </div>
    </div>
  );
};
