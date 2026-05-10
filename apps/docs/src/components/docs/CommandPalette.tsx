import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RegistryItem {
  slug: string;
  name: string;
  category: string;
  description: string;
  href: string;
}

interface Props {
  items: readonly RegistryItem[];
}

export default function CommandPalette({ items }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const grouped = items.reduce<Record<string, RegistryItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const groupOrder = ['getting-started', 'components', 'domain'];
  const groupLabels: Record<string, string> = {
    'getting-started': 'Getting started',
    components: 'Components',
    domain: 'Domain patterns',
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden md:inline">Search</span>
        <kbd className="border-border bg-muted ml-2 hidden rounded border px-1.5 py-0.5 text-[10px] font-medium md:inline">
          ⌘ K
        </kbd>
      </button>

      {open ? (
        // Modal dialog backdrop. Click outside / Escape close it; the
        // `Command.Input` inside owns focus on open. Adding a role+aria
        // here is the standard accessible-modal pattern.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
        >
          <div
            role="presentation"
            className="mx-auto mt-[14vh] w-full max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              label="Command palette"
              className="border-border bg-popover shadow-elevated overflow-hidden rounded-lg border"
              shouldFilter
            >
              <div className="border-border flex items-center gap-3 border-b px-4">
                <Search className="text-muted-foreground size-4" aria-hidden="true" />
                <Command.Input
                  // autoFocus is appropriate inside a modal dialog for keyboard-first UX
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search components, animations, docs..."
                  className="text-foreground placeholder:text-muted-foreground h-12 flex-1 bg-transparent text-sm outline-none"
                />
                <kbd className="border-border bg-muted text-muted-foreground rounded border px-1.5 py-0.5 text-[10px] font-medium">
                  ESC
                </kbd>
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="text-muted-foreground px-3 py-6 text-center text-sm">
                  No results.
                </Command.Empty>
                {groupOrder.map((groupId) => {
                  const groupItems = grouped[groupId];
                  if (!groupItems || groupItems.length === 0) return null;
                  return (
                    <Command.Group
                      key={groupId}
                      heading={groupLabels[groupId] ?? groupId}
                      className="[&_[cmdk-group-heading]]:text-muted-foreground mb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
                    >
                      {groupItems.map((item) => (
                        <Command.Item
                          key={item.slug}
                          value={`${item.name} ${item.description}`}
                          onSelect={() => {
                            window.location.href = item.href;
                          }}
                          className="text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground flex cursor-pointer flex-col gap-0.5 rounded-md px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground text-xs">{item.description}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </Command.List>
            </Command>
          </div>
        </div>
      ) : null}
    </>
  );
}
