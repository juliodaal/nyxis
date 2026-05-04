'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, Contrast, Monitor, Moon, MoonStar, Sun } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { useTheme } from '../../lib/theme/use-theme.js';
import { THEMES, type Theme } from '../../lib/theme/theme-types.js';
import { cn } from '../../lib/utils.js';

const THEME_META: Record<Theme, { label: string; icon: typeof Sun }> = {
  light: { label: 'Light', icon: Sun },
  dark: { label: 'Dark', icon: Moon },
  dim: { label: 'Dim', icon: MoonStar },
  'high-contrast': { label: 'High contrast', icon: Contrast },
  system: { label: 'System', icon: Monitor },
};

export interface ThemeToggleProps extends ComponentPropsWithoutRef<'button'> {
  /** Visual style of the trigger. */
  variant?: 'default' | 'compact';
  /** Render the trigger label as a screen-reader-only string. */
  hideLabel?: boolean;
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, variant = 'default', hideLabel = false, ...props }, ref) => {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const Icon = THEME_META[theme].icon;
    const ariaLabel = `Theme: ${THEME_META[theme].label}`;

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            ref={ref}
            type="button"
            aria-label={ariaLabel}
            data-resolved-theme={resolvedTheme}
            className={cn(
              'border-border bg-background text-foreground inline-flex items-center justify-center gap-2 rounded-md border transition-colors',
              'hover:bg-muted focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              variant === 'default' ? 'h-10 px-3 text-sm' : 'size-9 p-0',
              className,
            )}
            {...props}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {!hideLabel && variant === 'default' ? (
              <span className="font-medium">{THEME_META[theme].label}</span>
            ) : null}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className={cn(
              'border-border bg-popover z-50 min-w-[10rem] overflow-hidden rounded-md border p-1',
              'text-popover-foreground shadow-elevated',
              'data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:slide-in-from-top-1',
            )}
          >
            <DropdownMenu.Label className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
              Appearance
            </DropdownMenu.Label>
            {THEMES.map((option) => {
              const OptionIcon = THEME_META[option].icon;
              const active = theme === option;
              return (
                <DropdownMenu.Item
                  key={option}
                  onSelect={() => setTheme(option)}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                    'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                  )}
                >
                  <OptionIcon className="size-4 shrink-0" aria-hidden="true" />
                  <span>{THEME_META[option].label}</span>
                  {active ? (
                    <Check className="text-primary ml-auto size-4" aria-hidden="true" />
                  ) : null}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  },
);

ThemeToggle.displayName = 'ThemeToggle';
