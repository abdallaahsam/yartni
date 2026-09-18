/**
 * Qahera UI Kit — React 19 & TypeScript Strict Types
 * 
 * Strict controlled vocabulary matching canonical contracts:
 * - variants: primary, secondary, outline, ghost, link, destructive
 * - sizes: xs, sm, md, lg, xl
 * - tones: neutral, info, success, warning, danger
 * - states: default, hover, focus, disabled, loading
 */

export type QaheraVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive';

export type QaheraSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type QaheraTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type QaheraShape = 'circle' | 'rounded' | 'square';

export type QaheraIconName =
  // Navigation
  | 'search'
  | 'menu'
  | 'close'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-start'
  | 'arrow-end'
  | 'external-link'
  // Actions
  | 'plus'
  | 'edit'
  | 'delete'
  | 'save'
  | 'download'
  | 'upload'
  | 'copy'
  | 'refresh'
  | 'filter'
  | 'sort'
  | 'eye'
  | 'eye-off'
  // Status
  | 'check'
  | 'alert-circle'
  | 'x-circle'
  | 'info'
  | 'help-circle'
  | 'spinner'
  // Objects
  | 'user'
  | 'users'
  | 'folder'
  | 'file'
  | 'calendar'
  | 'clock'
  | 'image'
  | 'link'
  | 'lock'
  | 'settings'
  | 'bell'
  | 'sun'
  | 'moon'
  // Heritage
  | 'cartouche'
  | 'shen-ring'
  | 'lotus'
  | 'obelisk'
  | 'frieze'
;
