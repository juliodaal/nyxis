'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Brain, Check, ChevronDown, Code2, FileImage, Headphones, Mic, Wrench } from 'lucide-react';

import { cn } from '../../../lib/utils.js';
import { PROVIDERS, PROVIDER_ORDER, findModel } from '../../../ai/adapters/registry.js';
import type { AIModel, AIModelCapability, AIProviderId } from '../../../ai/types.js';

export interface ModelPickerProps {
  /** Selected model id (controlled). */
  value?: string;
  /** Default uncontrolled value. */
  defaultValue?: string;
  /** Called whenever the user picks a model. */
  onValueChange?: (modelId: string, provider: AIProviderId) => void;
  /** Restrict to a single provider. */
  provider?: AIProviderId;
  /** Restrict to models with all of these capabilities. */
  requireCapabilities?: readonly AIModelCapability[];
  /** Disable the trigger. */
  disabled?: boolean;
  className?: string;
}

const CAPABILITY_ICON: Partial<Record<AIModelCapability, typeof Wrench>> = {
  tools: Wrench,
  vision: FileImage,
  'audio-in': Mic,
  'audio-out': Headphones,
  reasoning: Brain,
  'json-mode': Code2,
};

/**
 * Dropdown that lists models grouped by provider, with capability icons,
 * context window size, and pricing where known.
 */
export function ModelPicker({
  value,
  defaultValue,
  onValueChange,
  provider,
  requireCapabilities,
  disabled,
  className,
}: ModelPickerProps) {
  const current = value ?? defaultValue ?? '';
  const currentModel = current ? findModel(current) : undefined;

  const providers = provider ? [provider] : PROVIDER_ORDER.filter((id) => id !== 'custom');

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
          aria-label={`Model: ${currentModel?.label ?? 'choose'}`}
        >
          <span className="flex-1 truncate text-left">
            {currentModel ? (
              <span className="flex items-center gap-2">
                <span className="text-foreground font-medium">{currentModel.label}</span>
                <span className="text-muted-foreground text-xs">
                  {(currentModel.contextWindow / 1000).toFixed(0)}k ctx
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">Choose a model</span>
            )}
          </span>
          <ChevronDown className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="border-border bg-popover text-popover-foreground shadow-elevated z-50 max-h-[28rem] min-w-[24rem] overflow-y-auto rounded-md border p-1"
        >
          {providers.map((providerId) => {
            const info = PROVIDERS[providerId];
            const filtered = info.models.filter((m) => modelMatches(m, requireCapabilities));
            if (filtered.length === 0) return null;
            return (
              <DropdownMenu.Group key={providerId}>
                <DropdownMenu.Label className="text-muted-foreground px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider">
                  {info.label}
                </DropdownMenu.Label>
                {filtered.map((model) => {
                  const active = model.id === current;
                  return (
                    <DropdownMenu.Item
                      key={model.id}
                      onSelect={() => onValueChange?.(model.id, providerId)}
                      className={cn(
                        'relative flex cursor-pointer items-start gap-3 rounded-sm px-2 py-2 text-sm outline-none',
                        'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{model.label}</span>
                          {model.status === 'preview' ? (
                            <span className="border-warning/30 bg-warning/10 text-warning rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                              preview
                            </span>
                          ) : null}
                          {model.status === 'deprecated' ? (
                            <span className="border-destructive/30 bg-destructive/10 text-destructive rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                              deprecated
                            </span>
                          ) : null}
                        </div>
                        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                          <span className="font-mono tabular-nums">
                            {(model.contextWindow / 1000).toFixed(0)}k ctx
                          </span>
                          {model.pricing?.inputPerMTokens !== undefined && (
                            <span className="font-mono tabular-nums">
                              ${model.pricing.inputPerMTokens.toFixed(2)}/M in
                            </span>
                          )}
                          {model.pricing?.outputPerMTokens !== undefined && (
                            <span className="font-mono tabular-nums">
                              ${model.pricing.outputPerMTokens.toFixed(2)}/M out
                            </span>
                          )}
                          <span className="ml-auto inline-flex items-center gap-1.5">
                            {model.capabilities.map((cap) => {
                              const Icon = CAPABILITY_ICON[cap];
                              if (!Icon) return null;
                              return <Icon key={cap} className="size-3" aria-label={cap} />;
                            })}
                          </span>
                        </div>
                      </div>
                      {active ? (
                        <Check className="text-primary mt-1 size-4" aria-hidden="true" />
                      ) : null}
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Group>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function modelMatches(model: AIModel, required?: readonly AIModelCapability[]): boolean {
  if (!required || required.length === 0) return true;
  return required.every((cap) => model.capabilities.includes(cap));
}
