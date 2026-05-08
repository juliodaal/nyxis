/**
 * Tiny registry client. Fetches the manifesto and per-item JSON from the
 * Nyxis registry over HTTPS, with an in-memory cache so repeat tool calls
 * inside a single MCP session don't re-hit the network.
 *
 * Override the base URL with env var `NYXIS_REGISTRY_URL` (defaults to
 * the production deploy). Useful for local development against
 * `http://localhost:4321/r`.
 */

export interface RegistryManifest {
  $schema?: string;
  name: string;
  homepage: string;
  items: ManifestItem[];
}

export interface ManifestItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; type: string }[];
  categories?: string[];
}

export interface RegistryItem extends ManifestItem {
  $schema?: string;
  files: {
    path: string;
    type: string;
    target?: string;
    content?: string;
  }[];
}

const DEFAULT_BASE_URL = 'https://nyxisai.vercel.app/r';

export class RegistryClient {
  readonly baseUrl: string;
  private manifestCache: RegistryManifest | null = null;
  private itemCache = new Map<string, RegistryItem>();

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl ?? process.env.NYXIS_REGISTRY_URL ?? DEFAULT_BASE_URL).replace(
      /\/+$/,
      '',
    );
  }

  /** Fetch the registry manifesto (full catalog without inlined source). */
  async manifest(): Promise<RegistryManifest> {
    if (this.manifestCache) return this.manifestCache;
    const res = await fetch(`${this.baseUrl}/registry.json`);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch registry manifest from ${this.baseUrl}/registry.json (${res.status} ${res.statusText})`,
      );
    }
    const json = (await res.json()) as RegistryManifest;
    this.manifestCache = json;
    return json;
  }

  /** Fetch a single item with inlined source content. */
  async item(name: string): Promise<RegistryItem> {
    const cached = this.itemCache.get(name);
    if (cached) return cached;
    const res = await fetch(`${this.baseUrl}/${encodeURIComponent(name)}.json`);
    if (res.status === 404) {
      throw new Error(`Registry item "${name}" not found at ${this.baseUrl}.`);
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch registry item "${name}" (${res.status} ${res.statusText})`);
    }
    const json = (await res.json()) as RegistryItem;
    this.itemCache.set(name, json);
    return json;
  }

  /** Return the canonical URL for an item — useful for `npx shadcn add`. */
  itemUrl(name: string): string {
    return `${this.baseUrl}/${encodeURIComponent(name)}.json`;
  }
}
