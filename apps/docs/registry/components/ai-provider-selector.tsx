'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown, Server } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getProviderInfo, PROVIDER_ORDER } from '@nyxis/core';
import type { AIProviderId, ProviderInfo } from '@nyxis/core';

const FALLBACK_INFO: ProviderInfo = {
  id: 'anthropic',
  label: 'Custom provider',
  defaultModel: '',
  models: [],
};

export interface AIProviderSelectorProps {
  /** Selected provider (controlled). */
  value?: AIProviderId;
  /** Default uncontrolled value. */
  defaultValue?: AIProviderId;
  /** Called whenever the user picks a provider. */
  onValueChange?: (provider: AIProviderId) => void;
  /** Limit which providers appear in the dropdown. */
  providers?: readonly AIProviderId[];
  /** Hide the provider's tagline in the dropdown. */
  compact?: boolean;
  /** Disable the trigger. */
  disabled?: boolean;
  className?: string;
}

const PROVIDER_GLYPH: Record<AIProviderId, string> = {
  anthropic: 'A',
  openai: 'O',
  google: 'G',
  mistral: 'M',
  ollama: '◇',
  custom: '+',
};

/**
 * Dropdown that lets the user pick an AI provider. Reads its options from
 * the curated `PROVIDERS` catalog so future provider additions land here
 * automatically.
 */
export function AIProviderSelector({
  value,
  defaultValue = 'anthropic',
  onValueChange,
  providers = PROVIDER_ORDER,
  compact = false,
  disabled,
  className,
}: AIProviderSelectorProps) {
  const current = value ?? defaultValue;
  const info = getProviderInfo(current) ?? { ...FALLBACK_INFO, id: current, label: current };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'border-border bg-background inline-flex h-10 w-full items-center gap-2 rounded-md border px-3 text-sm transition-colors',
            'hover:bg-muted focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          aria-label={`Provider: ${info.label}`}
        >
          <ProviderGlyph id={current} />
          <span className="text-foreground flex-1 truncate text-left font-medium">
            {info.label}
          </span>
          <ChevronDown className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="border-border bg-popover text-popover-foreground shadow-elevated z-50 min-w-[18rem] overflow-hidden rounded-md border p-1"
        >
          <DropdownMenu.Label className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
            Choose a provider
          </DropdownMenu.Label>
          {providers.map((id) => {
            const provider =
              getProviderInfo(id) ?? ({ ...FALLBACK_INFO, id, label: id } as ProviderInfo);
            const active = id === current;
            return (
              <DropdownMenu.Item
                key={id}
                onSelect={() => onValueChange?.(id)}
                className={cn(
                  'relative flex cursor-pointer items-start gap-3 rounded-sm px-2 py-2 text-sm outline-none',
                  'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                )}
              >
                <ProviderGlyph id={id} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{provider.label}</span>
                    {provider.local ? (
                      <span className="border-border bg-muted text-muted-foreground rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                        local
                      </span>
                    ) : null}
                  </div>
                  {!compact && provider.tagline ? (
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {provider.tagline}
                    </p>
                  ) : null}
                </div>
                {active ? <Check className="text-primary mt-1 size-4" aria-hidden="true" /> : null}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function ProviderGlyph({ id }: { id: AIProviderId }) {
  if (id === 'custom') {
    return (
      <span
        aria-hidden="true"
        className="border-border text-muted-foreground grid size-7 shrink-0 place-items-center rounded-md border border-dashed"
      >
        <Server className="size-3.5" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="bg-primary/10 text-primary grid size-7 shrink-0 place-items-center rounded-md font-mono text-xs font-bold"
    >
      {PROVIDER_GLYPH[id]}
    </span>
  );
}
