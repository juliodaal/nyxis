'use client';

import { Toaster as SonnerToaster, toast } from 'sonner';
import type { ComponentProps } from 'react';

export type ToasterProps = ComponentProps<typeof SonnerToaster>;

/**
 * Toast renderer. Mount once per app. Reads `data-theme` from the document
 * so toasts automatically match the active Nyxis theme.
 */
export function Toaster(props: ToasterProps) {
  const theme =
    typeof document !== 'undefined'
      ? (document.documentElement.getAttribute('data-theme') as
          | 'light'
          | 'dark'
          | 'dim'
          | 'high-contrast'
          | null)
      : null;

  const sonnerTheme: ComponentProps<typeof SonnerToaster>['theme'] =
    theme && theme !== 'light' ? 'dark' : 'light';

  return (
    <SonnerToaster
      theme={sonnerTheme}
      className="toaster"
      toastOptions={{
        classNames: {
          toast:
            'group rounded-md border border-border bg-popover text-popover-foreground shadow-elevated',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
      {...props}
    />
  );
}

export { toast };
