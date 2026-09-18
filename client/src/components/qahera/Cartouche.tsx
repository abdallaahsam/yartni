import React from 'react';

export interface CartoucheProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
}

export const Cartouche: React.FC<CartoucheProps> = ({
  children,
  variant = 'elevated',
  size = 'md',
  className = '',
  ...props
}) => {
  const classes = [
    'qhr-cartouche',
    `qhr-cartouche--${variant}`,
    `qhr-cartouche--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="region" {...props}>
      {children}
      <div className="qhr-cartouche__knot">
        <div className="qhr-cartouche__knot-bar" />
      </div>
    </div>
  );
};

export const CartoucheHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`qhr-cartouche__header ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CartoucheTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`qhr-cartouche__title ${className}`.trim()} {...props}>
    {children}
  </h3>
);

export const CartoucheBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`qhr-cartouche__body ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CartoucheFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`qhr-cartouche__footer ${className}`.trim()} {...props}>
    {children}
  </div>
);
