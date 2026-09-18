import React from 'react';
import { QaheraTone, QaheraSize } from './types';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'subtle';

export type BadgeTone =
  | QaheraTone
  | 'primary'
  | 'secondary'
  | 'light'
  | 'dark'
  | 'grey';

export type BadgeShape = 'default' | 'pill';

export interface BadgeVariantsOptions {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: BadgeShape;
  className?: string;
}

/**
 * Utility function equivalent to Shadcn's badgeVariants cva helper.
 * Generates authoritative Qahera CSS classes with zero runtime dependency.
 */
export function badgeVariants({
  variant = 'default',
  tone,
  size = 'md',
  shape = 'default',
  className = '',
}: BadgeVariantsOptions = {}): string {
  // Normalize Shadcn variants to Qahera canonical classes
  const isOutline = variant === 'outline';
  const isSubtle = variant === 'subtle';
  const isDestructive = variant === 'destructive';
  
  let resolvedTone = tone;
  if (!resolvedTone) {
    if (variant === 'default' || variant === 'primary') resolvedTone = 'primary';
    else if (variant === 'secondary') resolvedTone = 'secondary';
    else if (isDestructive) resolvedTone = 'danger';
  }

  return [
    'qhr-badge',
    resolvedTone && `qhr-badge--${resolvedTone}`,
    isDestructive && 'qhr-badge--destructive',
    isOutline && 'qhr-badge--outline',
    isSubtle && 'qhr-badge--subtle',
    size && `qhr-badge--${size}`,
    shape === 'pill' && 'qhr-badge--pill',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: BadgeShape;
  icon?: React.ReactNode;
  asChild?: boolean;
  href?: string;
}

/**
 * Qahera Badge Component (0kb RSC / React 19 Strict)
 * Supports canonical Qahera design tokens and Shadcn-compatible props & asChild pattern.
 */
export const Badge = React.forwardRef<HTMLElement, BadgeProps>(({
  children,
  variant = 'default',
  tone,
  size = 'md',
  shape = 'default',
  icon,
  className = '',
  asChild = false,
  href,
  ...props
}, ref) => {
  const computedClass = badgeVariants({ variant, tone, size, shape, className });

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: [computedClass, child.props.className].filter(Boolean).join(' '),
      ...props,
    });
  }

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={computedClass}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {icon && <span className="qhr-badge-icon">{icon}</span>}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={computedClass}
      {...props}
    >
      {icon && <span className="qhr-badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
});

Badge.displayName = 'Badge';
