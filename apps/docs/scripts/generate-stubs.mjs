#!/usr/bin/env node
/**
 * Generate rich MDX pages for every component in the registry. Each page
 * has frontmatter, a live `<Preview>` showing the actual component, an
 * Installation block, and a Usage code snippet. Always overwrites pages
 * in `components/`, `text-animations/`, `animations/`, and `domain/`;
 * the `docs/` collection is hand-maintained and never touched.
 *
 *   node scripts/generate-stubs.mjs
 */
import { mkdir, readFile, writeFile, access, constants } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const REGISTRY_PATH = join(ROOT, 'src/lib/registry.ts');
const CONTENT_ROOT = join(ROOT, 'src/content');

function pascal(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const COLLECTION_DIR = {
  'getting-started': 'docs',
  components: 'components',
  'text-animations': 'text-animations',
  animations: 'animations',
  domain: 'domain',
};

const AUTO_GENERATE = new Set(['components', 'text-animations', 'animations', 'domain']);

const USAGE_SNIPPETS = {
  'split-text': `<SplitText as="h1" splitBy="words" stagger={0.05}>
  Document intelligence, automated.
</SplitText>`,
  'type-writer': `<TypeWriter
  text={['document intelligence', 'meeting summaries', 'lead qualification']}
/>`,
  'scramble-text': `<ScrambleText>extracting invoice fields...</ScrambleText>`,
  'decrypt-text': `<DecryptText durationPerChar={80}>classifying inbox queue...</DecryptText>`,
  'gradient-text': `<GradientText as="h1">AI products that ship.</GradientText>`,
  'shiny-text': `<ShinyText>Premium · Pro · Enterprise</ShinyText>`,
  'count-up': `<CountUp to={48210} format="currency" currency="EUR" />`,
  'reveal-text': `<RevealText>Scroll-triggered reveals are accessible by default.</RevealText>`,
  'marquee-text': `<MarqueeText speed={28}>
  {logos.map((logo) => <span key={logo}>{logo}</span>)}
</MarqueeText>`,
  'rotating-text': `<RotatingText words={['Sales', 'Operations', 'Finance', 'Support']} />`,

  button: `<Button>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>`,
  input: `<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="hello@nyxis.dev" />`,
  textarea: `<Textarea placeholder="Tell us what changed..." />`,
  label: `<Label htmlFor="terms">Accept terms and conditions</Label>`,
  card: `<Card>
  <CardHeader>
    <CardTitle>Confidence: 92%</CardTitle>
    <CardDescription>Reviewed by Maria.</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>
    <Button>Approve</Button>
  </CardFooter>
</Card>`,
  badge: `<Badge>Default</Badge>
<Badge variant="success" dot>Live</Badge>
<Badge variant="destructive">Failed</Badge>`,
  avatar: `<Avatar>
  <AvatarImage src="/julio.png" alt="@juliodaal" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`,
  separator: `<Separator />
<Separator orientation="vertical" />`,
  skeleton: `<Skeleton className="size-12 rounded-full" />
<Skeleton className="h-4 w-3/4" />`,
  dialog: `<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
  sheet: `<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent>...</SheetContent>
</Sheet>`,
  drawer: `<Drawer>
  <DrawerTrigger asChild>
    <Button>Open</Button>
  </DrawerTrigger>
  <DrawerContent>...</DrawerContent>
</Drawer>`,
  popover: `<Popover>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>Filters go here.</PopoverContent>
</Popover>`,
  tooltip: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover</Button>
    </TooltipTrigger>
    <TooltipContent>92% confidence</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
  select: `<Select>
  <SelectTrigger><SelectValue placeholder="Pick one" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="datev">DATEV</SelectItem>
    <SelectItem value="netsuite">NetSuite</SelectItem>
  </SelectContent>
</Select>`,
  combobox: `<Combobox
  options={[
    { value: 'datev', label: 'DATEV' },
    { value: 'netsuite', label: 'NetSuite' },
  ]}
/>`,
  checkbox: `<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms</Label>`,
  switch: `<Switch id="airplane" />
<Label htmlFor="airplane">Airplane mode</Label>`,
  'radio-group': `<RadioGroup defaultValue="email">
  <RadioGroupItem value="email" id="email" />
  <RadioGroupItem value="sms" id="sms" />
</RadioGroup>`,
  'dropdown-menu': `// The ThemeToggle composes DropdownMenu internally — see the preview.
<ThemeToggle />`,
  tabs: `<Tabs defaultValue="preview">
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">...</TabsContent>
  <TabsContent value="code">...</TabsContent>
</Tabs>`,
  accordion: `<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>Question</AccordionTrigger>
    <AccordionContent>Answer.</AccordionContent>
  </AccordionItem>
</Accordion>`,
  command: `<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem>New extraction</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
  toast: `<Toaster />
<Button onClick={() => toast('Saved')}>Notify</Button>`,
  form: `const form = useForm({ resolver: zodResolver(schema) });

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  </Form>
);`,

  'magnetic-button': `<MagneticButton strength={0.45} distance={140}>
  Hover me
</MagneticButton>`,
  'spotlight-cursor': `<SpotlightCursor>
  <section>...your content...</section>
</SpotlightCursor>`,
  'parallax-container': `<ParallaxContainer depth={120}>
  <h2>I move slower than the page.</h2>
</ParallaxContainer>`,
  'stagger-reveal': `<StaggerReveal>
  {items.map((item) => <div key={item.id}>{item.label}</div>)}
</StaggerReveal>`,
  'tilt-card': `<TiltCard>
  <Card>...</Card>
</TiltCard>`,
  'aurora-background': `<AuroraBackground>
  <Hero />
</AuroraBackground>`,
  'dot-grid-background': `<DotGridBackground>
  <Hero />
</DotGridBackground>`,
  'mesh-gradient-background': `<MeshGradientBackground>
  <Hero />
</MeshGradientBackground>`,

  'confidence-badge': `<ConfidenceBadge score={0.97} />
<ConfidenceBadge score={0.74} />
<ConfidenceBadge score={0.42} />`,
  'sentiment-indicator': `<SentimentIndicator score={0.78} />
<SentimentIndicator score={0.05} />
<SentimentIndicator score={-0.62} />`,
  'kpi-card': `<KPICard
  label="MRR"
  value="€48,210"
  period="last 30d"
  delta={0.124}
  sparkline={[0.2, 0.35, 0.5, 0.7, 0.85]}
/>`,
  'citation-card': `<CitationCard
  rank={1}
  source="Employee handbook"
  locator="§4.2"
  href="#"
  snippet="The fiscal year ends on March 31."
/>`,
  'chat-message': `<ChatMessage role="user">Hello</ChatMessage>
<ChatMessage role="assistant" streaming>
  Compiling answer
</ChatMessage>`,
  'chat-input': `<ChatInput
  placeholder="Ask AskCompany anything..."
  onSubmit={(value) => sendMessage(value)}
/>`,
  'action-item': `<ActionItem
  text="Send Q3 reconciliation deck"
  assignee="MS"
  due="Tue · 3pm"
  status="pending"
/>`,
  'audit-log-item': `<AuditLogItem
  timestamp="2026-05-03 14:21"
  actor="Maria Schmidt"
  action="approved extraction for"
  target="INV-04812"
/>`,
  'lead-card': `<LeadCard
  company="Acme GmbH"
  contact="Lukas Müller · CFO"
  segment="Manufacturing"
  score={0.82}
  tags={['Enterprise', 'EU']}
/>`,
  'email-triage-card': `<EmailTriageCard
  from="lukas@acme.de"
  subject="Pricing for the enterprise plan"
  category="sales"
  preview="..."
  draft="Hi Lukas, thanks for reaching out..."
/>`,
  'file-dropzone': `<FileDropzone
  accept="application/pdf,image/*"
  maxSize={25 * 1024 * 1024}
  onFilesChange={(files) => upload(files)}
/>`,
  'data-table': `<DataTable
  columns={columns}
  data={data}
  pageSize={10}
/>`,
};

const PREVIEW_PROPS = {
  'spotlight-cursor': { fullBleed: true, minHeight: 'lg' },
  'aurora-background': { fullBleed: true, minHeight: 'lg' },
  'dot-grid-background': { fullBleed: true, minHeight: 'lg' },
  'mesh-gradient-background': { fullBleed: true, minHeight: 'lg' },
  'parallax-container': { minHeight: 'sm' },
  'reveal-text': { minHeight: 'sm' },
  'marquee-text': { fullBleed: true, minHeight: 'sm' },
};

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function parseRegistry(source) {
  const match = source.match(/REGISTRY[^=]*=\s*\[([\s\S]*?)\]\s*as\s*const/);
  if (!match) throw new Error('Could not locate REGISTRY in registry.ts');

  const body = match[1];
  const entries = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < body.length; i += 1) {
    const ch = body[i];
    if (ch === '{') {
      if (depth === 0) start = i;
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        entries.push(body.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return entries.map((raw) => {
    const get = (key) => {
      const m = raw.match(new RegExp(`${key}\\s*:\\s*['\"]([^'\"]*)['\"]`));
      return m ? m[1] : undefined;
    };
    const arr = (key) => {
      const m = raw.match(new RegExp(`${key}\\s*:\\s*\\[([^\\]]*)\\]`));
      if (!m) return undefined;
      return Array.from(m[1].matchAll(/['\"]([^'\"]+)['\"]/g)).map((m) => m[1]);
    };
    return {
      slug: get('slug'),
      name: get('name'),
      category: get('category'),
      description: get('description'),
      status: get('status') ?? 'planned',
      saasContext: arr('saasContext'),
    };
  });
}

function buildMdx(entry) {
  // Use the registry-declared name so acronyms like KPICard are preserved.
  const Demo = `${entry.name}Demo`;
  const previewProps = PREVIEW_PROPS[entry.slug] ?? {};
  const previewAttrs = Object.entries(previewProps)
    .map(([k, v]) => (typeof v === 'boolean' ? (v ? k : '') : `${k}="${v}"`))
    .filter(Boolean)
    .join(' ');
  const subpath = entry.slug;
  const usage = USAGE_SNIPPETS[entry.slug] ?? `<${entry.name}>...</${entry.name}>`;

  const lines = [
    '---',
    `title: ${entry.name}`,
    `description: ${entry.description}`,
    `category: ${entry.category}`,
    `status: ${entry.status}`,
  ];
  if (entry.saasContext && entry.saasContext.length > 0) {
    lines.push('saas:');
    for (const s of entry.saasContext) lines.push(`  - ${s}`);
  }
  lines.push('---', '');

  lines.push(
    `import Preview from '../../components/docs/Preview.astro';`,
    `import { ${Demo} } from '../../components/demos/demos';`,
    '',
  );

  lines.push(
    '## Preview',
    '',
    `<Preview${previewAttrs ? ' ' + previewAttrs : ''}>`,
    `  <${Demo} client:load />`,
    `</Preview>`,
    '',
  );

  if (entry.saasContext && entry.saasContext.length > 0) {
    lines.push('## Used in', '', ...entry.saasContext.map((s) => `- **${s}**`), '');
  }

  lines.push(
    '## Installation',
    '',
    '```bash',
    'pnpm add nyxis-ui',
    '```',
    '',
    '## Usage',
    '',
    '```tsx',
    `import { ${entry.name} } from 'nyxis-ui';`,
    '// or, for stricter tree-shaking:',
    `// import { ${entry.name} } from 'nyxis-ui/${subpath}';`,
    '',
    usage,
    '```',
    '',
  );

  return lines.join('\n');
}

async function main() {
  const source = await readFile(REGISTRY_PATH, 'utf8');
  const entries = parseRegistry(source);

  let written = 0;
  let skipped = 0;
  for (const entry of entries) {
    if (!entry.slug || !entry.category) continue;
    const collection = COLLECTION_DIR[entry.category];
    if (!collection) continue;

    const path = join(CONTENT_ROOT, collection, `${entry.slug}.mdx`);
    if (!AUTO_GENERATE.has(entry.category)) {
      if (await fileExists(path)) {
        skipped += 1;
        continue;
      }
    }

    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, buildMdx(entry));
    written += 1;
  }

  console.log(`[generate-stubs] wrote ${written} page(s), skipped ${skipped} hand-maintained file(s)`);
}

main().catch((err) => {
  console.error('[generate-stubs] failed:', err);
  process.exit(1);
});
