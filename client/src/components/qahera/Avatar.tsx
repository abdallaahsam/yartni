import React from 'react';
import { QaheraSize, QaheraShape } from './types';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: QaheraSize;
  shape?: QaheraShape;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  initials,
  size = 'md',
  shape = 'circle',
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'qhr-avatar',
    `qhr-avatar--${size}`,
    `qhr-avatar--${shape}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {src ? (
        <img src={src} alt={alt} className="qhr-avatar-img" />
      ) : initials ? (
        <span className="qhr-avatar-initials">{initials}</span>
      ) : (
        children
      )}
    </span>
  );
};
