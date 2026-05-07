'use client';

/**
 * All component demos in one module. Each export is a self-contained
 * React component used by the docs site as a live preview. Islands are
 * hydrated per-instance (`<XxxDemo client:load />`) so each page only
 * pays for the demo it shows.
 *
 * Keep examples minimal and realistic — the goal is "you immediately get
 * what this thing is and what it's for", not "every prop demonstrated".
 */

import type { ColumnDef } from '@tanstack/react-table';
import { Bell, Github, MoreHorizontal, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  ABCompare,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ActionItem,
  AgentActivityFeed,
  AgentCard,
  AgentHandoff,
  AgentRoster,
  AgentStatusBadge,
  AudioPlayer,
  AuditLogItem,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChainOfThought,
  ChatInput,
  ChatMessage,
  ChatThread,
  Checkbox,
  ChunkCard,
  CitationCard,
  Combobox,
  ConversationFork,
  ConversationSidebar,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  ConfidenceBadge,
  DataTable,
  DatasetTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DocumentChunker,
  DrawerTitle,
  DrawerTrigger,
  EmailTriageCard,
  EmbeddingScatter,
  EvalRunCard,
  FileDropzone,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ImageGallery,
  ImageMessage,
  Input,
  KPICard,
  Label,
  MetricCard,
  LeadCard,
  MCPCapabilityBadge,
  MCPConnectionStatus,
  MCPLogStream,
  MCPPromptLibrary,
  MCPResourceBrowser,
  MCPServerCard,
  MCPServerList,
  MessageActions,
  ParameterForm,
  Popover,
  PromptCard,
  PromptVariableForm,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  RAGPipeline,
  ReasoningTrace,
  RetrievalResults,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SentimentIndicator,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  SkillAuthStatus,
  SkillCard,
  SkillInvocationLog,
  SkillMarketplace,
  SkillPermissions,
  SkillRegistry,
  TaskDelegation,
  StreamingCode,
  StreamingMarkdown,
  StreamingText,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeToggle,
  TranscriptionView,
  ThinkingIndicator,
  TokenCounter,
  ToolCall,
  ToolExecutionLog,
  ToolRegistry,
  ToolResult,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TypingIndicator,
  VectorSearchInput,
  VisionInput,
  VoiceWaveform,
  toast,
} from 'nyxis-ui';

// ─────────────────────────────────────────────────────────────────────
// Base UI components
// ─────────────────────────────────────────────────────────────────────

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}

export function InputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="hello@nyxis.dev" />
    </div>
  );
}

export function TextareaDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea id="notes" placeholder="Tell us what changed..." />
    </div>
  );
}

export function LabelDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms-label" />
      <Label htmlFor="terms-label">Accept terms and conditions</Label>
    </div>
  );
}

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Confidence: 92%</CardTitle>
        <CardDescription>Extracted invoice total · €4,830.00 · Reviewed by Maria.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        All required fields were located on page 1 and validated against the purchase order.
      </CardContent>
      <CardFooter>
        <Button size="sm">Approve</Button>
        <Button size="sm" variant="outline">
          Review
        </Button>
      </CardFooter>
    </Card>
  );
}

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success" dot>
        Live
      </Badge>
      <Badge variant="warning" dot>
        Pending
      </Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="muted">Archived</Badge>
    </div>
  );
}

export function AvatarDemo() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="https://github.com/juliodaal.png" alt="@juliodaal" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>NX</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function SeparatorDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3 text-sm">
      <p className="text-foreground font-medium">Nyxis</p>
      <p className="text-muted-foreground">A modern component library.</p>
      <Separator />
      <div className="text-muted-foreground flex h-5 items-center gap-3 text-xs">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Storybook</span>
        <Separator orientation="vertical" />
        <span>GitHub</span>
      </div>
    </div>
  );
}

export function SkeletonDemo() {
  return (
    <div className="flex w-full max-w-sm items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm extraction</DialogTitle>
          <DialogDescription>
            Push 412 reviewed invoices to DATEV? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Push to DATEV</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Source citations</SheetTitle>
          <SheetDescription>
            All passages used to compose this answer, ranked by relevance.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Confidence breakdown</DrawerTitle>
          <DrawerDescription>How we computed 92% on this extraction.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Approve</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <h4 className="text-foreground text-sm font-medium">Filters</h4>
        <p className="text-muted-foreground mt-1 text-xs">
          Adjust how the list is filtered. Changes apply immediately.
        </p>
      </PopoverContent>
    </Popover>
  );
}

export function TooltipDemo() {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>92% confidence — see audit trail</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Select a destination" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>ERP</SelectLabel>
          <SelectItem value="datev">DATEV</SelectItem>
          <SelectItem value="netsuite">NetSuite</SelectItem>
          <SelectItem value="sap">SAP S/4HANA</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Spreadsheets</SelectLabel>
          <SelectItem value="airtable">Airtable</SelectItem>
          <SelectItem value="sheets">Google Sheets</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function ComboboxDemo() {
  return (
    <Combobox
      placeholder="Pick an ERP"
      options={[
        { value: 'datev', label: 'DATEV' },
        { value: 'netsuite', label: 'NetSuite' },
        { value: 'sap', label: 'SAP S/4HANA' },
        { value: 'xero', label: 'Xero' },
        { value: 'quickbooks', label: 'QuickBooks Online' },
      ]}
    />
  );
}

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms-cb" defaultChecked />
      <Label htmlFor="terms-cb">Accept terms and conditions</Label>
    </div>
  );
}

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="airplane" defaultChecked />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  );
}

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="email" className="gap-3">
      {[
        ['email', 'Email'],
        ['sms', 'SMS'],
        ['none', 'No notifications'],
      ].map(([value, label]) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem value={value!} id={`rg-${value}`} />
          <Label htmlFor={`rg-${value}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export function DropdownMenuDemo() {
  return <ThemeToggle />;
}

export function TabsDemo() {
  return (
    <Tabs defaultValue="preview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="props">Props</TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        className="border-border text-muted-foreground rounded-md border p-4 text-sm"
      >
        Live preview of the component.
      </TabsContent>
      <TabsContent value="code" className="border-border rounded-md border p-4 text-sm">
        <pre className="font-mono text-xs">{`<Button>Hello</Button>`}</pre>
      </TabsContent>
      <TabsContent
        value="props"
        className="border-border text-muted-foreground rounded-md border p-4 text-sm"
      >
        Auto-generated props table.
      </TabsContent>
    </Tabs>
  );
}

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="a">
        <AccordionTrigger>What is Nyxis?</AccordionTrigger>
        <AccordionContent>
          A React component library for AI products. 54 components, 5 themes, GSAP animations.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Is it free?</AccordionTrigger>
        <AccordionContent>Yes — MIT licensed, public source, signed releases.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Does it support server components?</AccordionTrigger>
        <AccordionContent>
          Yes. Interactive components carry preserved <code>"use client"</code> directives.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function CommandDemo() {
  return (
    <Command className="border-border shadow-elevated w-full max-w-md rounded-lg border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            New extraction <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Search audit log <CommandShortcut>⌘L</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Push to DATEV <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function ToastDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Toaster position="top-right" />
      <div className="flex gap-2">
        <Button
          onClick={() =>
            toast('Extraction complete', { description: '412 invoices ready for review.' })
          }
        >
          Notify
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success('Pushed to DATEV', { description: '412 invoices synced.' })}
        >
          Success
        </Button>
        <Button
          variant="destructive"
          onClick={() => toast.error('Sync failed', { description: 'Network error. Retry?' })}
        >
          Error
        </Button>
      </div>
    </div>
  );
}

const formSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export function FormDemo() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          toast.success('Submitted', { description: values.email });
        })}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="hello@nyxis.dev" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <Toaster />
      </form>
    </Form>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Domain patterns
// ─────────────────────────────────────────────────────────────────────

export function ConfidenceBadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <ConfidenceBadge score={0.97} />
      <ConfidenceBadge score={0.74} />
      <ConfidenceBadge score={0.42} />
    </div>
  );
}

export function SentimentIndicatorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SentimentIndicator score={0.78} />
      <SentimentIndicator score={0.05} />
      <SentimentIndicator score={-0.62} />
    </div>
  );
}

const SPARKLINE = [0.2, 0.35, 0.3, 0.5, 0.55, 0.7, 0.6, 0.85];
const SPARKLINE_DOWN = [0.85, 0.7, 0.72, 0.6, 0.55, 0.4, 0.45, 0.3];

export function KPICardDemo() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      <KPICard label="MRR" value="€48,210" period="last 30d" delta={0.124} sparkline={SPARKLINE} />
      <KPICard
        label="Tickets / day"
        value="412"
        period="this week"
        delta={-0.083}
        sparkline={SPARKLINE_DOWN}
      />
      <KPICard label="Avg. confidence" value="92.4%" period="all time" delta={0} />
    </div>
  );
}

export function CitationCardDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <CitationCard
        rank={1}
        source="Employee handbook"
        locator="§4.2"
        href="https://example.com"
        snippet="The fiscal year ends on March 31. All quarterly reports must be submitted no later than ten business days after each quarter close."
      />
      <CitationCard
        rank={2}
        source="2025 Finance Q4 review"
        locator="slide 14"
        snippet="Quarterly cadence remains unchanged: ten-day reporting window, parallel review by audit and finance."
      />
    </div>
  );
}

export function ChatMessageDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <ChatMessage role="user" timestamp="14:02">
        When does the fiscal year end?
      </ChatMessage>
      <ChatMessage role="assistant" timestamp="14:02">
        The fiscal year ends on March 31. Quarterly reports are due within ten business days of each
        quarter close.
      </ChatMessage>
      <ChatMessage role="assistant" streaming>
        Compiling source citations
      </ChatMessage>
      <ChatMessage role="system">Conversation closed by user.</ChatMessage>
    </div>
  );
}

export function ChatInputDemo() {
  return (
    <div className="w-full max-w-md">
      <ChatInput
        attachments
        placeholder="Ask AI Assistant anything..."
        onSubmit={(value) => alert(`Sent: ${value}`)}
      />
    </div>
  );
}

export function ActionItemDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <ActionItem
        text="Send Q3 reconciliation deck to finance"
        assignee="MS"
        due="Tue · 3pm"
        status="pending"
      />
      <ActionItem
        text="Confirm DATEV credentials for the new tenant"
        assignee="JD"
        due="Today"
        status="in-progress"
      />
      <ActionItem text="Sign off on the migration plan" assignee="AT" status="done" />
    </div>
  );
}

export function AuditLogItemDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <AuditLogItem
        timestamp="2026-05-03 14:21"
        actor="Maria Schmidt"
        action="approved extraction for"
        target="INV-04812"
      />
      <AuditLogItem
        timestamp="2026-05-03 14:18"
        actor="Document AI"
        action="edited fields on"
        target="INV-04812"
        diff={[
          { field: 'total_eur', before: 4720, after: 4830 },
          { field: 'vat_rate', before: 0.18, after: 0.19 },
        ]}
      />
      <AuditLogItem
        timestamp="2026-05-03 14:02"
        actor="Document AI"
        action="extracted"
        target="INV-04812"
      />
    </div>
  );
}

export function LeadCardDemo() {
  return (
    <div className="w-full max-w-sm">
      <LeadCard
        company="Acme GmbH"
        contact="Lukas Müller · CFO"
        segment="Manufacturing · 200-500 FTE"
        score={0.82}
        tags={['Enterprise', 'EU', 'DATEV']}
        primaryAction={{ label: 'Open in HubSpot', href: '#' }}
        onEmail={() => alert('email')}
      />
    </div>
  );
}

export function EmailTriageCardDemo() {
  return (
    <div className="w-full max-w-lg">
      <EmailTriageCard
        from="lukas.muller@acme.de"
        subject="Pricing for the enterprise plan"
        category="sales"
        preview="Hi — we're evaluating Nyxis for our internal tooling. Could you share enterprise pricing and SAML support details?"
        draft="Hi Lukas, thanks for reaching out. Enterprise pricing starts at €2k/month and includes SSO via SAML, custom retention, and a dedicated SLA. I can hop on a call this week to walk you through it — does Thursday at 4pm CET work?"
      />
    </div>
  );
}

export function FileDropzoneDemo() {
  return (
    <div className="w-full max-w-lg">
      <FileDropzone />
    </div>
  );
}

interface InvoiceRow {
  id: string;
  vendor: string;
  total: string;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
}

const INVOICES: InvoiceRow[] = [
  {
    id: 'INV-04812',
    vendor: 'Acme GmbH',
    total: '€4,830.00',
    confidence: 0.97,
    status: 'approved',
  },
  { id: 'INV-04811', vendor: 'Globex AG', total: '€1,210.00', confidence: 0.74, status: 'pending' },
  { id: 'INV-04810', vendor: 'Initech KG', total: '€612.50', confidence: 0.41, status: 'rejected' },
  {
    id: 'INV-04809',
    vendor: 'Umbrella SE',
    total: '€9,210.00',
    confidence: 0.91,
    status: 'approved',
  },
  { id: 'INV-04808', vendor: 'Pied Piper', total: '€312.00', confidence: 0.69, status: 'pending' },
];

const INVOICE_COLUMNS: ColumnDef<InvoiceRow>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'vendor', header: 'Vendor' },
  { accessorKey: 'total', header: 'Total' },
  {
    accessorKey: 'confidence',
    header: 'Confidence',
    cell: ({ getValue }) => <ConfidenceBadge score={getValue<number>()} />,
  },
  { accessorKey: 'status', header: 'Status' },
];

export function DataTableDemo() {
  return (
    <div className="w-full max-w-3xl">
      <DataTable<InvoiceRow> columns={INVOICE_COLUMNS} data={INVOICES} pageSize={5} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Theming
// ─────────────────────────────────────────────────────────────────────

export function ThemeToggleDemo() {
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-lg border p-4">
      <div className="flex flex-col">
        <span className="text-foreground text-sm font-medium">Appearance</span>
        <span className="text-muted-foreground text-xs">Choose how Nyxis looks.</span>
      </div>
      <ThemeToggle />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · Models & Providers (Phase D)
// ─────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import {
  AIConfigCard,
  AIHaloBorder,
  AIProviderSelector,
  APIKeyInput,
  ContextWindowMeter,
  CostMeter,
  GradientAura,
  MaxTokensInput,
  ModelPicker,
  NeuralBackground,
  ProviderHealthBadge,
  SparkleField,
  SystemPromptEditor,
  TemperatureSlider,
  ThinkingOrb,
  TokenStream,
  TopPSlider,
} from 'nyxis-ui';
import type { AIProviderId } from 'nyxis-ui/ai';

export function AIProviderSelectorDemo() {
  const [provider, setProvider] = useState<AIProviderId>('anthropic');
  return (
    <div className="w-full max-w-sm">
      <AIProviderSelector value={provider} onValueChange={setProvider} />
    </div>
  );
}

export function ModelPickerDemo() {
  const [model, setModel] = useState('claude-sonnet-4-5');
  return (
    <div className="w-full max-w-md">
      <ModelPicker value={model} onValueChange={(id) => setModel(id)} />
    </div>
  );
}

export function APIKeyInputDemo() {
  const [key, setKey] = useState('');
  return (
    <div className="w-full max-w-sm">
      <APIKeyInput
        provider="anthropic"
        value={key}
        onValueChange={setKey}
        validate={async (k) =>
          k.startsWith('sk-ant-') ? 'valid' : k.length < 8 ? 'invalid' : 'rate-limited'
        }
      />
    </div>
  );
}

export function TemperatureSliderDemo() {
  const [v, setV] = useState(0.7);
  return (
    <div className="w-full max-w-sm">
      <TemperatureSlider value={v} onValueChange={setV} />
    </div>
  );
}

export function TopPSliderDemo() {
  const [v, setV] = useState(1);
  return (
    <div className="w-full max-w-sm">
      <TopPSlider value={v} onValueChange={setV} />
    </div>
  );
}

export function MaxTokensInputDemo() {
  const [v, setV] = useState(2048);
  return (
    <div className="w-full max-w-sm">
      <MaxTokensInput value={v} onValueChange={setV} modelId="claude-sonnet-4-5" />
    </div>
  );
}

export function SystemPromptEditorDemo() {
  const [v, setV] = useState(
    'You are a senior support engineer named {{agent_name}}.\n\nReply only with information from the {{knowledge_base}} corpus.',
  );
  return (
    <div className="w-full max-w-md">
      <SystemPromptEditor value={v} onValueChange={setV} />
    </div>
  );
}

export function ContextWindowMeterDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ContextWindowMeter used={42_000} modelId="claude-sonnet-4-5" />
      <ContextWindowMeter used={148_000} modelId="claude-sonnet-4-5" />
      <ContextWindowMeter used={195_000} modelId="claude-sonnet-4-5" />
    </div>
  );
}

export function CostMeterDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <CostMeter initial={0.0124} />
      <CostMeter initial={0.412} detailed />
    </div>
  );
}

export function ProviderHealthBadgeDemo() {
  return (
    <div className="flex flex-col items-start gap-2">
      <ProviderHealthBadge status="operational" latencyMs={210} />
      <ProviderHealthBadge status="degraded" latencyMs={1240} />
      <ProviderHealthBadge status="down" />
      <ProviderHealthBadge status="unknown" />
    </div>
  );
}

export function AIConfigCardDemo() {
  return (
    <div className="w-full max-w-xl">
      <AIConfigCard
        defaultConfig={{
          systemPrompt:
            'You are a senior support engineer named {{agent_name}}. Reply only with information from the {{knowledge_base}} corpus.',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · Chat 2.0 (Phase E)
// ─────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { Code2, Globe, Image as ImageIcon, Search } from 'lucide-react';
import type { AIMessage } from 'nyxis-ui/ai';
import type {
  ChainStep,
  ConversationItem,
  DocumentChunk,
  ForkNode,
  ParameterField,
  RegisteredTool,
  ToolExecution,
} from 'nyxis-ui';
import type {
  Agent,
  AgentActivity,
  DelegatedTask,
  EmbeddingPoint,
  EvalRow,
  EvalRun,
  HandoffEvent,
  MCPLogEntry,
  MCPPrompt,
  MCPResource,
  MCPServer,
  MediaAttachment,
  Prompt,
  RAGStage,
  RetrievedChunk,
  Skill,
  SkillInvocation,
  TranscriptSegment,
} from 'nyxis-ui/ai';

const STREAMING_SAMPLE =
  'Streaming responses make assistants feel responsive even when generation is slow.';

export function StreamingTextDemo() {
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(true);

  useEffect(() => {
    let i = 0;
    const tick = setInterval(() => {
      i += 2;
      setText(STREAMING_SAMPLE.slice(0, i));
      if (i >= STREAMING_SAMPLE.length) {
        clearInterval(tick);
        setStreaming(false);
      }
    }, 50);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="text-foreground w-full max-w-md text-base leading-relaxed">
      <StreamingText text={text} streaming={streaming} />
    </div>
  );
}

const MARKDOWN_SAMPLE = `Two reasons we ship adapters as **peer dependencies**:

1. **Bundle size** — apps targeting only Anthropic don't pay for OpenAI.
2. **Version freedom** — pin the AI SDK version that matches your server.

\`\`\`ts
import { createChatHandler, createModel } from 'nyxis-ui/ai/server';

export const POST = createChatHandler({
  model: createModel('anthropic', 'claude-sonnet-4-5'),
});
\`\`\`

> Adapter packages are loaded *lazily* — only providers you actually use end up in your bundle.
`;

export function StreamingMarkdownDemo() {
  return (
    <div className="bg-card border-border w-full max-w-2xl rounded-lg border p-6">
      <StreamingMarkdown text={MARKDOWN_SAMPLE} streaming={false} />
    </div>
  );
}

const CODE_SAMPLE = `import { useChat } from 'nyxis-ui/ai';

export function Chat() {
  const { messages, send, isStreaming } = useChat({
    api: '/api/chat',
  });

  return (
    <ChatThread
      messages={messages}
      streaming={isStreaming}
    />
  );
}`;

export function StreamingCodeDemo() {
  return (
    <div className="w-full max-w-2xl">
      <StreamingCode code={CODE_SAMPLE} language="tsx" filename="chat.tsx" />
    </div>
  );
}

export function TypingIndicatorDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <TypingIndicator />
      <TypingIndicator label="Assistant is thinking" />
      <TypingIndicator variant="bubble" label="Generating response" />
    </div>
  );
}

const THREAD_SEED: AIMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Why does Nyxis ship adapters as peer dependencies?',
    createdAt: '14:02',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      "Two reasons:\n\n1. **Bundle size** — apps targeting only Anthropic don't pay for OpenAI.\n2. **Version freedom** — pin the AI SDK version that matches your server.\n\n```ts\npnpm add nyxis-ui ai @ai-sdk/anthropic\n```",
    createdAt: '14:02',
  },
];

const FOLLOWUP_TEXT =
  'And on the server, `createChatHandler` lazy-loads the right adapter at request time — so the cold-start of an Edge function only pays for the provider it actually uses.';

export function ChatThreadDemo() {
  const [messages, setMessages] = useState<AIMessage[]>(THREAD_SEED);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => {
      setStreaming(true);
      setMessages((prev) => [
        ...prev,
        { id: '3', role: 'user', content: 'Anything else?', createdAt: '14:03' },
        { id: '4', role: 'assistant', content: '', createdAt: '14:03' },
      ]);
      let i = 0;
      const tick = setInterval(() => {
        i += 4;
        setMessages((prev) =>
          prev.map((m) => (m.id === '4' ? { ...m, content: FOLLOWUP_TEXT.slice(0, i) } : m)),
        );
        if (i >= FOLLOWUP_TEXT.length) {
          clearInterval(tick);
          setStreaming(false);
        }
      }, 60);
    }, 1000);
    return () => clearTimeout(start);
  }, []);

  return (
    <div className="border-border bg-background h-[480px] w-full max-w-2xl overflow-hidden rounded-lg border">
      <ChatThread messages={messages} streaming={streaming} />
    </div>
  );
}

export function MessageActionsDemo() {
  return (
    <div className="border-border bg-card flex w-full max-w-md flex-col gap-4 rounded-lg border p-4">
      <p className="text-foreground text-sm">
        The fiscal year ends on March 31. Quarterly reports are due within ten business days.
      </p>
      <MessageActions
        text="The fiscal year ends on March 31."
        actions={['copy', 'regenerate', 'edit', 'fork', 'share']}
      />
    </div>
  );
}

export function TokenCounterDemo() {
  const sample =
    'You are a senior support engineer. Reply only with information from the knowledge base. ' +
    'When unsure, say so. Format code with fenced blocks. Keep tone neutral and precise. '.repeat(
      8,
    );
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <TokenCounter text="Hello world" modelId="claude-sonnet-4-5" />
      <TokenCounter text={sample.slice(0, 600)} modelId="claude-sonnet-4-5" showBar />
      <TokenCounter text={sample} modelId="claude-sonnet-4-5" showBar />
    </div>
  );
}

const CONVERSATIONS: ConversationItem[] = [
  {
    id: '1',
    title: 'Streaming-first chat architecture',
    updatedAt: '2m ago',
    snippet: 'And on the server, createChatHandler lazy-loads the right adapter…',
    pinned: true,
  },
  {
    id: '2',
    title: 'Provider catalog and pricing',
    updatedAt: '1h ago',
    snippet: 'The catalog has every model from Anthropic, OpenAI, Google…',
    unread: 2,
  },
  {
    id: '3',
    title: 'Tool calls with type-safe schemas',
    updatedAt: 'Yesterday',
    snippet: 'Use Zod schemas for the parameters and validate at runtime.',
  },
  {
    id: '4',
    title: 'Theming and dark-mode tokens',
    updatedAt: '3d ago',
    snippet: 'Five themes ship by default: light, dark, midnight, paper, console.',
  },
];

export function ConversationSidebarDemo() {
  const [activeId, setActiveId] = useState('1');
  return (
    <div className="border-border bg-card h-[480px] w-full max-w-xs overflow-hidden rounded-lg border">
      <ConversationSidebar
        conversations={CONVERSATIONS}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={() => alert('New conversation')}
      />
    </div>
  );
}

const FORK_TREE: ForkNode = {
  id: 'root',
  label: 'Why does Nyxis ship adapters as peer deps?',
  role: 'user',
  children: [
    {
      id: 'a1',
      label: 'Bundle size + version freedom + lazy server load.',
      role: 'assistant',
      children: [
        {
          id: 'a1-u1',
          label: 'Got it — show me the server-side example.',
          role: 'user',
          children: [
            {
              id: 'a1-u1-a1',
              label: "Use createChatHandler with anthropic('claude-sonnet-4-5').",
              role: 'assistant',
            },
          ],
        },
      ],
    },
    {
      id: 'a2',
      label: 'Bundle size, version freedom, and OPTIONAL adapter loading.',
      role: 'assistant',
    },
  ],
};

export function ConversationForkDemo() {
  return (
    <div className="w-full max-w-lg">
      <ConversationFork
        root={FORK_TREE}
        activeLeafId="a1-u1-a1"
        onSelect={(id) => alert(`Switch to branch ${id}`)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · Reasoning (Phase F)
// ─────────────────────────────────────────────────────────────────────

const REASONING_SAMPLE = `The user is asking why Nyxis exposes adapters as peer dependencies.

Three angles to cover:
1. Bundle size — apps targeting only one provider shouldn't pay for the others.
2. Version freedom — provider SDKs evolve quickly; pinning lets consumers control upgrades.
3. Lazy loading on the server — createChatHandler resolves the right adapter at request time.

Best to lead with the bundle-size argument since it's the most visceral, then walk through the other two with a concrete code example.`;

export function ReasoningTraceDemo() {
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(true);

  useEffect(() => {
    let i = 0;
    const tick = setInterval(() => {
      i += 5;
      setText(REASONING_SAMPLE.slice(0, i));
      if (i >= REASONING_SAMPLE.length) {
        clearInterval(tick);
        setStreaming(false);
      }
    }, 50);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="w-full max-w-xl">
      <ReasoningTrace text={text} streaming={streaming} defaultOpen />
    </div>
  );
}

const COT_STEPS: ChainStep[] = [
  {
    id: '1',
    text: 'Plan: identify the three architectural choices behind peer-dep adapters',
    status: 'done',
  },
  {
    id: '2',
    text: 'Search the codebase for the createModel implementation',
    detail: 'Found in packages/ui/src/ai/adapters/create-model.ts',
    status: 'done',
  },
  {
    id: '3',
    text: 'Synthesise the answer as a numbered list with a code example',
    status: 'active',
  },
  {
    id: '4',
    text: 'Validate the example compiles against the Vercel AI SDK',
    status: 'pending',
  },
];

export function ChainOfThoughtDemo() {
  return (
    <div className="w-full max-w-md">
      <ChainOfThought steps={COT_STEPS} />
    </div>
  );
}

export function ThinkingIndicatorDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <ThinkingIndicator variant="shimmer" />
      <ThinkingIndicator variant="pulse" />
      <ThinkingIndicator variant="orbit" />
      <ThinkingIndicator variant="shimmer" icon="sparkles" label="Reasoning across documents…" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · Tools / Function Calling (Phase G)
// ─────────────────────────────────────────────────────────────────────

const TOOL_ARGS = {
  query: 'streaming chat protocol',
  filters: { lang: 'en', after: '2024-01-01' },
  limit: 5,
};

export function ToolCallDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <ToolCall name="search_documents" args={TOOL_ARGS} status="completed" durationMs={420} />
      <ToolCall name="fetch_url" args={{ url: 'https://nyxis.dev/docs' }} status="running" />
      <ToolCall name="execute_code" status="errored" durationMs={5000} />
      <ToolCall name="generate_image" status="pending" />
    </div>
  );
}

export function ToolResultDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <ToolResult
        label="search_documents"
        result={{
          hits: [
            { id: 'doc_1', title: 'Streaming chat architecture', score: 0.94 },
            { id: 'doc_2', title: 'Provider catalog', score: 0.88 },
          ],
          total: 2,
        }}
      />
      <ToolResult
        label="execute_code"
        error={'ReferenceError: x is not defined\n  at Object.<anonymous> (/sandbox/main.ts:12:7)'}
      />
    </div>
  );
}

const PARAM_FIELDS: ParameterField[] = [
  {
    name: 'query',
    type: 'string',
    description: 'Free-text search.',
    placeholder: 'streaming chat protocol',
    required: true,
  },
  { name: 'limit', type: 'number', description: 'Max results.', defaultValue: 5 },
  { name: 'language', type: 'enum', options: ['en', 'es', 'de', 'fr'], defaultValue: 'en' },
  { name: 'tags', type: 'string[]', description: 'Filter by tag.' },
  { name: 'fuzzy', type: 'boolean', description: 'Approximate matching.', defaultValue: true },
];

export function ParameterFormDemo() {
  const [v, setV] = useState<Record<string, unknown>>({});
  return (
    <div className="border-border bg-card w-full max-w-md rounded-lg border p-5">
      <ParameterForm
        fields={PARAM_FIELDS}
        value={v}
        onValueChange={setV}
        submitLabel="Run search_documents"
        onSubmit={(value) => alert(JSON.stringify(value, null, 2))}
      />
    </div>
  );
}

const REGISTRY_TOOLS: RegisteredTool[] = [
  {
    id: 'search',
    name: 'search_documents',
    description: 'Vector search over the indexed document corpus.',
    icon: <Search className="size-3.5" />,
    group: 'Retrieval',
  },
  {
    id: 'fetch',
    name: 'fetch_url',
    description: 'Fetch a URL and return cleaned readable text.',
    icon: <Globe className="size-3.5" />,
    group: 'Retrieval',
  },
  {
    id: 'execute',
    name: 'execute_code',
    description: 'Run JavaScript in a sandboxed environment.',
    icon: <Code2 className="size-3.5" />,
    group: 'Compute',
  },
  {
    id: 'image',
    name: 'generate_image',
    description: 'Produce an image from a text prompt.',
    icon: <ImageIcon className="size-3.5" />,
    group: 'Compute',
    enabled: false,
  },
];

export function ToolRegistryDemo() {
  return (
    <div className="w-full max-w-md">
      <ToolRegistry tools={REGISTRY_TOOLS} />
    </div>
  );
}

const NOW = new Date();
const ago = (s: number) => new Date(NOW.getTime() - s * 1000);
const EXECUTIONS: ToolExecution[] = [
  {
    id: '4',
    name: 'search_documents',
    args: { query: 'streaming protocol', limit: 5 },
    status: 'running',
    startedAt: ago(2),
  },
  {
    id: '3',
    name: 'fetch_url',
    args: { url: 'https://nyxis.dev/docs' },
    result: 'Nyxis is a React component library for AI products. 70+ components.',
    status: 'completed',
    startedAt: ago(18),
    durationMs: 480,
  },
  {
    id: '2',
    name: 'execute_code',
    args: { language: 'js', code: 'return 2 + 2;' },
    error: 'Sandbox unreachable: timeout after 5000ms',
    status: 'errored',
    startedAt: ago(34),
    durationMs: 5000,
  },
  {
    id: '1',
    name: 'list_models',
    args: {},
    result: { models: ['claude-sonnet-4-5', 'gpt-4o', 'gemini-1.5-pro'] },
    status: 'completed',
    startedAt: ago(52),
    durationMs: 90,
  },
];

export function ToolExecutionLogDemo() {
  return (
    <div className="w-full max-w-2xl">
      <ToolExecutionLog executions={EXECUTIONS} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · MCP (Phase H)
// ─────────────────────────────────────────────────────────────────────

const MCP_SERVERS: MCPServer[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Read/write repositories, issues, pull requests, and CI checks.',
    transport: 'stdio',
    endpoint: 'npx -y @modelcontextprotocol/server-github',
    state: 'connected',
    capabilities: ['tools', 'resources'],
    version: '0.4.1',
    latencyMs: 38,
  },
  {
    id: 'fs',
    name: 'Filesystem',
    description: 'Read-only access to the project workspace.',
    transport: 'stdio',
    endpoint: 'npx -y @modelcontextprotocol/server-filesystem /home/me/notes',
    state: 'connected',
    capabilities: ['resources', 'tools'],
    version: '0.6.2',
    latencyMs: 12,
  },
  {
    id: 'pg',
    name: 'Postgres',
    description: 'Read-only access to the analytics replica.',
    transport: 'websocket',
    endpoint: 'wss://mcp.internal/postgres',
    state: 'disconnected',
    capabilities: ['resources'],
  },
  {
    id: 'remote',
    name: 'Remote API',
    transport: 'sse',
    endpoint: 'https://mcp.example.com/sse',
    state: 'error',
    error: 'connect ECONNREFUSED 203.0.113.5:443',
    capabilities: ['tools', 'prompts', 'sampling'],
  },
];

export function MCPServerCardDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <MCPServerCard server={MCP_SERVERS[0]!} defaultOpen />
      <MCPServerCard server={MCP_SERVERS[3]!} />
    </div>
  );
}

export function MCPServerListDemo() {
  return (
    <div className="w-full max-w-2xl">
      <MCPServerList
        servers={MCP_SERVERS}
        onAdd={() => alert('add server')}
        onConnect={(id) => alert(`connect ${id}`)}
        onDisconnect={(id) => alert(`disconnect ${id}`)}
      />
    </div>
  );
}

export function MCPCapabilityBadgeDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <MCPCapabilityBadge capability="tools" />
        <MCPCapabilityBadge capability="prompts" />
        <MCPCapabilityBadge capability="resources" />
        <MCPCapabilityBadge capability="sampling" />
        <MCPCapabilityBadge capability="roots" />
        <MCPCapabilityBadge capability="logging" />
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <MCPCapabilityBadge capability="tools" compact />
        <MCPCapabilityBadge capability="prompts" compact />
        <MCPCapabilityBadge capability="resources" compact />
        <MCPCapabilityBadge capability="sampling" compact />
        <MCPCapabilityBadge capability="roots" compact />
        <MCPCapabilityBadge capability="logging" compact />
      </div>
    </div>
  );
}

export function MCPConnectionStatusDemo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <MCPConnectionStatus state="connected" latencyMs={42} />
      <MCPConnectionStatus state="connecting" />
      <MCPConnectionStatus state="disconnected" />
      <MCPConnectionStatus state="error" />
    </div>
  );
}

const MCP_RESOURCES: MCPResource[] = [
  {
    uri: 'file:///workspace/README.md',
    name: 'README.md',
    description: 'Project overview, install steps, link to the docs.',
    mimeType: 'text/markdown',
  },
  {
    uri: 'file:///workspace/src/index.ts',
    name: 'src/index.ts',
    description: 'Public surface of nyxis-ui.',
    mimeType: 'text/typescript',
  },
  {
    uri: 'file:///workspace/package.json',
    name: 'package.json',
    description: 'Manifest with peer deps and exports map.',
    mimeType: 'application/json',
  },
  {
    uri: 'db://analytics/users/42',
    name: 'users/42',
    description: 'Single row from the analytics replica.',
    mimeType: 'application/json',
  },
  {
    uri: 'db://analytics/sessions',
    name: 'sessions table',
    mimeType: 'application/json',
  },
  {
    uri: 'https://docs.nyxis.dev/api/index.html',
    name: 'API docs',
    description: 'Hosted API reference.',
    mimeType: 'text/html',
  },
];

export function MCPResourceBrowserDemo() {
  const [active, setActive] = useState('file:///workspace/README.md');
  return (
    <div className="w-full max-w-md">
      <MCPResourceBrowser
        resources={MCP_RESOURCES}
        activeUri={active}
        onSelect={(r) => setActive(r.uri)}
      />
    </div>
  );
}

const MCP_PROMPTS: MCPPrompt[] = [
  {
    name: 'summarise_pr',
    description: 'Summarise a pull request given its diff and recent activity.',
    arguments: [
      { name: 'repo', description: 'owner/name', required: true },
      { name: 'number', description: 'PR number', required: true },
      { name: 'tone', description: 'concise | detailed | bullet' },
    ],
  },
  {
    name: 'extract_entities',
    description: 'Pull named entities from a passage of text.',
    arguments: [
      { name: 'text', required: true },
      { name: 'types', description: 'Comma-separated list (PERSON, ORG, LOC...)' },
    ],
  },
  {
    name: 'list_open_incidents',
    description: 'No-arg prompt that returns the current incident list.',
  },
  {
    name: 'translate',
    description: 'Translate a passage between languages.',
    arguments: [
      { name: 'text', required: true },
      { name: 'target', required: true, description: 'BCP-47 language tag' },
      { name: 'register', description: 'formal | casual' },
    ],
  },
];

export function MCPPromptLibraryDemo() {
  return (
    <div className="w-full max-w-md">
      <MCPPromptLibrary prompts={MCP_PROMPTS} onSelect={(p) => alert(`pick ${p.name}`)} />
    </div>
  );
}

const MCP_LOG_NOW = new Date();
const mcpAgo = (ms: number) => new Date(MCP_LOG_NOW.getTime() - ms);
const MCP_LOG: MCPLogEntry[] = [
  {
    id: '8',
    timestamp: mcpAgo(120),
    direction: 'out',
    method: 'tools/call',
    payload: { name: 'list_repos', arguments: { owner: 'juliodaal' } },
  },
  {
    id: '7',
    timestamp: mcpAgo(180),
    direction: 'in',
    method: 'tools/call (response)',
    payload: { content: [{ type: 'json', json: { repos: ['nyxis', 'taller'] } }] },
  },
  {
    id: '6',
    timestamp: mcpAgo(420),
    direction: 'event',
    method: 'notifications/message',
    level: 'info',
    payload: { logger: 'mcp-server-github', message: 'Authenticated as juliodaal' },
  },
  {
    id: '5',
    timestamp: mcpAgo(640),
    direction: 'out',
    method: 'resources/list',
  },
  {
    id: '4',
    timestamp: mcpAgo(720),
    direction: 'in',
    method: 'resources/list (response)',
    payload: { resources: [{ uri: 'file:///workspace/README.md', name: 'README.md' }] },
  },
  {
    id: '3',
    timestamp: mcpAgo(1240),
    direction: 'event',
    method: 'notifications/message',
    level: 'warn',
    payload: { logger: 'mcp-server-github', message: 'Rate limit at 80%' },
  },
  {
    id: '2',
    timestamp: mcpAgo(1820),
    direction: 'in',
    method: 'initialize (response)',
    payload: {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {}, resources: {} },
      serverInfo: { name: 'github', version: '0.4.1' },
    },
  },
  {
    id: '1',
    timestamp: mcpAgo(2120),
    direction: 'out',
    method: 'initialize',
    payload: { protocolVersion: '2024-11-05', clientInfo: { name: 'nyxis', version: '0.8.0' } },
  },
];

export function MCPLogStreamDemo() {
  return (
    <div className="w-full max-w-2xl">
      <MCPLogStream entries={MCP_LOG} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · Agents (Phase I)
// ─────────────────────────────────────────────────────────────────────

const AGENT_TEAM: Agent[] = [
  {
    id: 'planner',
    name: 'Planner',
    role: 'Decomposes the task into subtasks.',
    modelId: 'claude-opus-4',
    initials: 'PL',
    status: 'done',
    tools: ['decompose'],
  },
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Gathers facts from the web and internal corpora.',
    modelId: 'claude-sonnet-4-5',
    initials: 'RS',
    status: 'working',
    tools: ['search_web', 'fetch_url', 'search_documents'],
  },
  {
    id: 'writer',
    name: 'Writer',
    role: 'Synthesises findings into a final answer.',
    modelId: 'claude-opus-4',
    initials: 'WR',
    status: 'idle',
    tools: ['write_markdown'],
  },
  {
    id: 'critic',
    name: 'Critic',
    role: 'Reviews drafts for accuracy and tone.',
    modelId: 'gpt-4o',
    initials: 'CR',
    status: 'idle',
    tools: ['rate_text'],
  },
  {
    id: 'fact-check',
    name: 'Fact-checker',
    role: 'Validates citations against sources.',
    modelId: 'claude-sonnet-4-5',
    initials: 'FC',
    status: 'blocked',
    tools: ['verify_citation'],
  },
];

export function AgentStatusBadgeDemo() {
  return (
    <div className="flex flex-col items-start gap-2">
      <AgentStatusBadge status="idle" />
      <AgentStatusBadge status="thinking" />
      <AgentStatusBadge status="working" />
      <AgentStatusBadge status="blocked" />
      <AgentStatusBadge status="done" />
      <AgentStatusBadge status="errored" />
    </div>
  );
}

export function AgentCardDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <AgentCard agent={AGENT_TEAM[1]!} />
      <AgentCard agent={AGENT_TEAM[2]!} />
    </div>
  );
}

export function AgentRosterDemo() {
  const [active, setActive] = useState<string | undefined>('researcher');
  return (
    <div className="w-full max-w-lg">
      <AgentRoster agents={AGENT_TEAM} activeId={active} onSelect={setActive} layout="list" />
    </div>
  );
}

const AGENT_NOW = new Date();
const agentAgo = (s: number) => new Date(AGENT_NOW.getTime() - s * 1000);
const ACTIVITIES: AgentActivity[] = [
  {
    id: '8',
    agentId: 'writer',
    agentName: 'Writer',
    kind: 'message',
    summary: 'Drafted opening paragraph (124 words).',
    detail:
      'Nyxis ships adapters as peer dependencies for three reasons:\n1. Bundle size — apps targeting only one provider...',
    timestamp: agentAgo(2),
  },
  {
    id: '7',
    agentId: 'researcher',
    agentName: 'Researcher',
    kind: 'handoff',
    summary: 'Handed off to Writer with 6 sources.',
    timestamp: agentAgo(15),
  },
  {
    id: '6',
    agentId: 'researcher',
    agentName: 'Researcher',
    kind: 'tool-call',
    summary: 'search_documents("streaming protocol", limit=5)',
    detail: '{ "hits": [ ... 5 results ... ] }',
    timestamp: agentAgo(45),
  },
  {
    id: '5',
    agentId: 'researcher',
    agentName: 'Researcher',
    kind: 'thought',
    summary: 'Cross-referencing peer-deps explanation against source code.',
    timestamp: agentAgo(80),
  },
  {
    id: '4',
    agentId: 'planner',
    agentName: 'Planner',
    kind: 'handoff',
    summary: 'Handed off to Researcher with 3 sub-tasks.',
    timestamp: agentAgo(180),
  },
  {
    id: '3',
    agentId: 'planner',
    agentName: 'Planner',
    kind: 'action',
    summary: 'Decomposed task into research → write → review.',
    timestamp: agentAgo(220),
  },
  {
    id: '2',
    agentId: 'planner',
    agentName: 'Planner',
    kind: 'thought',
    summary: 'User asked about peer-dep architecture — needs research + synthesis.',
    timestamp: agentAgo(240),
  },
];

export function AgentActivityFeedDemo() {
  return (
    <div className="w-full max-w-2xl">
      <AgentActivityFeed activities={ACTIVITIES} />
    </div>
  );
}

const HANDOFFS: HandoffEvent[] = [
  {
    fromAgentId: 'planner',
    toAgentId: 'researcher',
    fromAgentName: 'Planner',
    toAgentName: 'Researcher',
    reason: 'Needs to gather facts about peer-dep architecture.',
    state: 'accepted',
    timestamp: new Date(),
  },
  {
    fromAgentId: 'researcher',
    toAgentId: 'writer',
    fromAgentName: 'Researcher',
    toAgentName: 'Writer',
    reason: 'Found 6 sources, ready to synthesise.',
    state: 'pending',
    timestamp: new Date(Date.now() - 60_000),
  },
];

export function AgentHandoffDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {HANDOFFS.map((h) => (
        <AgentHandoff key={`${h.fromAgentId}-${h.toAgentId}`} handoff={h} />
      ))}
    </div>
  );
}

const TASK_TREE: DelegatedTask[] = [
  {
    id: 'root',
    title: 'Answer: why peer-dep adapters?',
    description: 'Research, draft, review, finalise.',
    status: 'in-progress',
    progress: 0.55,
    children: [
      {
        id: 'research',
        title: 'Research peer-dep architecture',
        agentName: 'Researcher',
        agentId: 'researcher',
        status: 'done',
        children: [
          { id: 'r-1', title: 'Search internal docs', agentName: 'Researcher', status: 'done' },
          {
            id: 'r-2',
            title: 'Fetch README + installation',
            agentName: 'Researcher',
            status: 'done',
          },
          { id: 'r-3', title: 'Verify against source', agentName: 'Researcher', status: 'done' },
        ],
      },
      {
        id: 'draft',
        title: 'Draft answer (3 reasons + example)',
        agentName: 'Writer',
        status: 'in-progress',
        progress: 0.4,
      },
      {
        id: 'review',
        title: 'Review for accuracy and tone',
        agentName: 'Critic',
        status: 'pending',
      },
      {
        id: 'finalise',
        title: 'Finalise + publish',
        status: 'blocked',
        description: 'Waiting on Critic approval.',
      },
    ],
  },
];

export function TaskDelegationDemo() {
  const [active, setActive] = useState<string>('draft');
  return (
    <div className="w-full max-w-xl">
      <TaskDelegation tasks={TASK_TREE} activeId={active} onSelect={(t) => setActive(t.id)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · Multimodal (Phase J)
// ─────────────────────────────────────────────────────────────────────

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=640';

export function ImageMessageDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ImageMessage
        src={SAMPLE_IMAGE}
        alt="Circuit board with brass-coloured traces."
        caption="Generated · 1024×1024 · 8s"
        onOpen={() => alert('open lightbox')}
      />
      <ImageMessage alt="Generating..." status="generating" progress={0.42} />
    </div>
  );
}

const GALLERY_IMAGES: MediaAttachment[] = [
  {
    id: '1',
    kind: 'image',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=640',
    name: 'circuit-board.jpg',
    alt: 'Brass circuit board.',
    width: 640,
    height: 426,
  },
  {
    id: '2',
    kind: 'image',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640',
    name: 'matrix-rain.jpg',
    alt: 'Matrix-style green text on black.',
    width: 640,
    height: 426,
  },
  {
    id: '3',
    kind: 'image',
    url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=640',
    name: 'data-stream.jpg',
    alt: 'Abstract data stream.',
    width: 640,
    height: 426,
  },
  {
    id: '4',
    kind: 'image',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=640',
    name: 'neural-grid.jpg',
    alt: 'Neural grid visualisation.',
    width: 640,
    height: 426,
  },
  {
    id: '5',
    kind: 'image',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640',
    name: 'ai-portrait.jpg',
    alt: 'Portrait generated by AI.',
    width: 640,
    height: 640,
  },
  {
    id: '6',
    kind: 'image',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640',
    name: 'mountain-night.jpg',
    alt: 'Snow-covered mountain at night.',
    width: 640,
    height: 426,
  },
];

export function ImageGalleryDemo() {
  return (
    <div className="w-full max-w-2xl">
      <ImageGallery images={GALLERY_IMAGES} />
    </div>
  );
}

const STATIC_WAVEFORM = Array.from(
  { length: 48 },
  (_, i) => 0.3 + Math.abs(Math.sin(i * 0.4)) * 0.6,
);

export function VoiceWaveformDemo() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const tick = setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 0.02)), 80);
    return () => clearInterval(tick);
  }, []);
  return (
    <div className="border-border bg-card flex w-full max-w-md flex-col gap-3 rounded-lg border p-4">
      <div>
        <p className="text-muted-foreground mb-1.5 text-[10px] font-semibold uppercase tracking-wider">
          recording
        </p>
        <VoiceWaveform isRecording height={32} />
      </div>
      <div>
        <p className="text-muted-foreground mb-1.5 text-[10px] font-semibold uppercase tracking-wider">
          playback
        </p>
        <VoiceWaveform bars={STATIC_WAVEFORM} isPlaying progress={progress} height={32} />
      </div>
      <div>
        <p className="text-muted-foreground mb-1.5 text-[10px] font-semibold uppercase tracking-wider">
          idle
        </p>
        <VoiceWaveform bars={STATIC_WAVEFORM} height={32} />
      </div>
    </div>
  );
}

const PLAYER_WAVEFORM = Array.from(
  { length: 64 },
  (_, i) => 0.25 + Math.abs(Math.sin(i * 0.35) + Math.cos(i * 0.13) * 0.5) * 0.6,
);

export function AudioPlayerDemo() {
  return (
    <div className="w-full max-w-md">
      <AudioPlayer
        src="https://www.soundjay.com/buttons/sounds/button-09a.mp3"
        title="Voice reply"
        waveform={PLAYER_WAVEFORM}
      />
    </div>
  );
}

const TRANSCRIPT: TranscriptSegment[] = [
  {
    id: '1',
    start: 0,
    end: 3.2,
    speaker: 'Maria',
    text: 'Hi, thanks for joining the call today.',
  },
  {
    id: '2',
    start: 3.2,
    end: 8.4,
    speaker: 'Lukas',
    text: 'Of course — happy to walk you through how Nyxis ships its peer-dependency adapters.',
  },
  {
    id: '3',
    start: 8.4,
    end: 14.1,
    speaker: 'Maria',
    text: 'Great. The first thing I want to understand is the bundle-size argument. Can you elaborate?',
    confidence: 0.62,
  },
  {
    id: '4',
    start: 14.1,
    end: 22.5,
    speaker: 'Lukas',
    text: 'Right — apps that target only Anthropic should not pay for the OpenAI SDK. Peer deps mean the consumer chooses which providers to install.',
  },
  {
    id: '5',
    start: 22.5,
    end: 30.0,
    speaker: 'Lukas',
    text: 'On top of that, we lazy-load adapters server-side via createChatHandler — so cold-starts stay tight.',
  },
];

export function TranscriptionViewDemo() {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const tick = setInterval(() => setTime((t) => (t >= 30 ? 0 : t + 0.4)), 400);
    return () => clearInterval(tick);
  }, []);
  return (
    <div className="w-full max-w-xl">
      <TranscriptionView
        segments={TRANSCRIPT}
        currentTime={time}
        onSelect={(s) => setTime(s.start)}
      />
    </div>
  );
}

export function VisionInputDemo() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="w-full max-w-md">
      <VisionInput value={file} onChange={setFile} maxBytes={5 * 1024 * 1024} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · Prompts / Eval (Phase K)
// ─────────────────────────────────────────────────────────────────────

const SUMMARISE_PROMPT: Prompt = {
  id: 'summarise-pr',
  name: 'Summarise pull request',
  description: 'Condense a PR diff and recent activity into a 3-bullet summary.',
  body: 'Summarise the following pull request in {{tone}} bullets:\n\nRepo: {{repo}}\nNumber: {{number}}\nDiff:\n{{diff}}',
  version: '2.1',
  modelId: 'claude-sonnet-4-5',
  tags: ['code-review', 'github', 'summarisation'],
  updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};

export function PromptCardDemo() {
  return (
    <div className="w-full max-w-md">
      <PromptCard prompt={SUMMARISE_PROMPT} />
    </div>
  );
}

export function PromptVariableFormDemo() {
  const [v, setV] = useState<Record<string, string>>({
    tone: '3',
    repo: 'juliodaal/nyxis',
    number: '42',
    diff: '',
  });
  return (
    <div className="border-border bg-card w-full max-w-lg rounded-lg border p-4">
      <PromptVariableForm
        template={SUMMARISE_PROMPT.body}
        value={v}
        onValueChange={setV}
        submitLabel="Run prompt"
        preview
        onSubmit={(_, { rendered }) => alert(rendered)}
      />
    </div>
  );
}

const ACCURACY_SPARK = [0.62, 0.66, 0.69, 0.71, 0.74, 0.78, 0.81, 0.84];
const LATENCY_SPARK = [240, 230, 215, 220, 200, 190, 180, 175];

export function MetricCardDemo() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
      <MetricCard
        metric={{
          name: 'accuracy',
          value: 0.842,
          baseline: 0.78,
          goodDirection: 'up',
          sparkline: ACCURACY_SPARK,
          precision: 3,
        }}
      />
      <MetricCard
        metric={{
          name: 'latency p95',
          value: 175,
          unit: 'ms',
          baseline: 240,
          goodDirection: 'down',
          sparkline: LATENCY_SPARK,
        }}
      />
      <MetricCard
        metric={{
          name: 'cost',
          value: 0.0124,
          unit: '$',
          baseline: 0.014,
          goodDirection: 'down',
          precision: 4,
        }}
      />
    </div>
  );
}

const COMPLETED_RUN: EvalRun = {
  id: '1',
  name: 'summarise-pr v2.1 · golden-100',
  status: 'completed',
  promptName: 'summarise-pr',
  modelId: 'claude-sonnet-4-5',
  datasetName: 'golden-100',
  totalRows: 100,
  processedRows: 100,
  durationMs: 184_000,
  metrics: [
    { name: 'accuracy', value: 0.842, baseline: 0.78, goodDirection: 'up', precision: 3 },
    { name: 'latency p95', value: 175, unit: 'ms', baseline: 240, goodDirection: 'down' },
    {
      name: 'cost',
      value: 0.0124,
      unit: '$',
      baseline: 0.014,
      goodDirection: 'down',
      precision: 4,
    },
  ],
};

const RUNNING_RUN: EvalRun = {
  id: '2',
  name: 'summarise-pr v2.2 · golden-100',
  status: 'running',
  promptName: 'summarise-pr',
  modelId: 'claude-sonnet-4-5',
  datasetName: 'golden-100',
  totalRows: 100,
  processedRows: 42,
  startedAt: new Date(Date.now() - 90_000).toISOString(),
};

export function EvalRunCardDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <EvalRunCard run={COMPLETED_RUN} onSelect={(id) => alert(`open ${id}`)} />
      <EvalRunCard run={RUNNING_RUN} />
    </div>
  );
}

const DATASET_ROWS: EvalRow[] = [
  {
    id: '1',
    input: 'PR #42 — refactor: split chat barrel into per-component subpaths.',
    expected: '- Split chat barrel\n- Per-component subpaths\n- Tree-shaking improvement',
    actual: '- Split chat barrel\n- Per-component subpaths\n- Better tree-shaking',
    score: 0.94,
    status: 'pass',
    latencyMs: 420,
    costUsd: 0.0023,
  },
  {
    id: '2',
    input: 'PR #43 — fix: handle null adapter in createModel.',
    expected:
      '- Null adapter handling\n- Falls back to anthropic\n- Throws when no providers installed',
    actual: '- Null check on adapter\n- Defaults to anthropic\n- Errors gracefully',
    score: 0.78,
    status: 'pass',
    latencyMs: 380,
    costUsd: 0.0019,
  },
  {
    id: '3',
    input: 'PR #44 — feat: add tool execution log component.',
    expected: '- Tool execution timeline\n- Status icons\n- Args + result expandable',
    actual: '- New ToolExecutionLog\n- Includes timestamps and statuses',
    score: 0.62,
    status: 'pass',
    latencyMs: 510,
    costUsd: 0.0024,
  },
  {
    id: '4',
    input: 'PR #45 — chore: bump dependencies.',
    expected: '- Dependency upgrades\n- No breaking changes\n- CI passes',
    actual: 'Bumps several dependencies; no behaviour changes.',
    score: 0.41,
    status: 'fail',
    latencyMs: 290,
    costUsd: 0.0014,
    notes: 'Missing the "CI passes" bullet.',
  },
  {
    id: '5',
    input: 'PR #46 — docs: clarify peer-dep policy.',
    expected: '- Documents peer-dep policy\n- Lists optional providers\n- Explains lazy loading',
    actual: '- Adds peer-dep section to README\n- Mentions optional providers',
    score: 0.71,
    status: 'pass',
    latencyMs: 410,
    costUsd: 0.0021,
  },
  {
    id: '6',
    input: 'PR #47 — feat: add VisionInput dropzone.',
    expected: '- Drop, paste, camera input\n- File-type validation\n- Size cap',
    actual: '- Drop and paste support\n- Validates MIME type',
    score: 0.55,
    status: 'fail',
    latencyMs: 470,
    costUsd: 0.0022,
    notes: 'Missed camera capture.',
  },
];

export function DatasetTableDemo() {
  return (
    <div className="w-full max-w-3xl">
      <DatasetTable rows={DATASET_ROWS} />
    </div>
  );
}

export function ABCompareDemo() {
  return (
    <div className="w-full max-w-3xl">
      <ABCompare
        input="Summarise PR #42 — refactor: split chat barrel into per-component subpaths."
        a={{
          label: 'summarise-pr v2.1',
          sublabel: 'baseline',
          modelId: 'claude-sonnet-4-5',
          metrics: [
            { name: 'accuracy', value: 0.78, baseline: 0.78, goodDirection: 'up', precision: 3 },
            { name: 'latency p95', value: 240, unit: 'ms', baseline: 240, goodDirection: 'down' },
            {
              name: 'cost',
              value: 0.014,
              unit: '$',
              baseline: 0.014,
              goodDirection: 'down',
              precision: 4,
            },
          ],
          sample:
            '- Split chat barrel\n- Per-component subpaths\n- Tree-shaking improvement (slight)',
        }}
        b={{
          label: 'summarise-pr v2.2',
          sublabel: 'challenger',
          modelId: 'claude-sonnet-4-5',
          metrics: [
            { name: 'accuracy', value: 0.842, baseline: 0.78, goodDirection: 'up', precision: 3 },
            { name: 'latency p95', value: 175, unit: 'ms', baseline: 240, goodDirection: 'down' },
            {
              name: 'cost',
              value: 0.0124,
              unit: '$',
              baseline: 0.014,
              goodDirection: 'down',
              precision: 4,
            },
          ],
          sample:
            '- Split chat barrel\n- Per-component subpaths\n- Better tree-shaking, smaller bundles',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · RAG (Phase L)
// ─────────────────────────────────────────────────────────────────────

const SAMPLE_CHUNK: RetrievedChunk = {
  id: 'doc-12-§4.2',
  source: 'employee-handbook.md',
  locator: '§4.2',
  rank: 1,
  score: 0.71,
  rerankScore: 0.94,
  text: 'The fiscal year ends on March 31. All quarterly reports must be submitted no later than ten business days after each quarter close, and a parallel review by audit and finance is required before release.',
  metadata: {
    collection: 'hr-corpus',
    docType: 'policy',
    lang: 'en',
    updated: '2026-01-15',
  },
};

export function ChunkCardDemo() {
  return (
    <div className="w-full max-w-xl">
      <ChunkCard chunk={SAMPLE_CHUNK} />
    </div>
  );
}

const RETRIEVAL_CHUNKS: RetrievedChunk[] = [
  SAMPLE_CHUNK,
  {
    id: '2',
    source: 'finance-2025-Q4-review.pdf',
    locator: 'page 3',
    rank: 2,
    score: 0.68,
    rerankScore: 0.86,
    text: 'Quarterly cadence remains unchanged: ten-day reporting window, parallel review by audit and finance.',
  },
  {
    id: '3',
    source: 'employee-handbook.md',
    locator: '§4.3',
    rank: 3,
    score: 0.62,
    rerankScore: 0.58,
    text: 'Audit findings must be logged into the central tracker within five business days of identification.',
  },
  {
    id: '4',
    source: 'sox-controls-matrix.xlsx',
    locator: 'row 412',
    rank: 4,
    score: 0.42,
    rerankScore: 0.31,
    text: 'Control SOX-412: monthly reconciliation evidence stored in the GRC vault.',
  },
];

export function RetrievalResultsDemo() {
  const [active, setActive] = useState<string | undefined>(undefined);
  return (
    <div className="w-full max-w-2xl">
      <RetrievalResults
        chunks={RETRIEVAL_CHUNKS}
        query="When does the fiscal year end and how are quarterly reports submitted?"
        activeId={active}
        onSelect={setActive}
      />
    </div>
  );
}

export function VectorSearchInputDemo() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <VectorSearchInput
        defaultValue="when does the fiscal year end?"
        onSubmit={(query, opts) => setLast(`${query} · ${JSON.stringify(opts)}`)}
      />
      {last && <p className="text-muted-foreground font-mono text-[11px]">last submit: {last}</p>}
    </div>
  );
}

const CHUNKER_TEXT = `# Fiscal year and reporting cadence

The fiscal year ends on March 31. All quarterly reports must be submitted no later than ten business days after each quarter close. Parallel review by audit and finance is required before release.

Audit findings must be logged into the central tracker within five business days of identification. Findings are triaged by severity (S0–S3) and assigned an owner.

New finance team members complete the SOX awareness module in their first week. The module is also re-administered annually as part of the compliance refresh.`;

const CHUNKER_CHUNKS: DocumentChunk[] = [
  { id: 'c1', start: 0, end: CHUNKER_TEXT.indexOf('Audit findings') },
  {
    id: 'c2',
    start: CHUNKER_TEXT.indexOf('Audit findings'),
    end: CHUNKER_TEXT.indexOf('New finance team members'),
  },
  {
    id: 'c3',
    start: CHUNKER_TEXT.indexOf('New finance team members'),
    end: CHUNKER_TEXT.length,
  },
];

export function DocumentChunkerDemo() {
  const [active, setActive] = useState<string | undefined>(undefined);
  return (
    <div className="w-full max-w-3xl">
      <DocumentChunker
        text={CHUNKER_TEXT}
        chunks={CHUNKER_CHUNKS}
        activeId={active}
        onSelect={(c) => setActive(c.id)}
      />
    </div>
  );
}

function generateScatter(): EmbeddingPoint[] {
  const out: EmbeddingPoint[] = [];
  const clusters = [
    { name: 'finance', cx: 0.25, cy: 0.7, count: 14 },
    { name: 'hr', cx: 0.7, cy: 0.6, count: 12 },
    { name: 'engineering', cx: 0.5, cy: 0.25, count: 16 },
  ];
  let id = 0;
  for (const c of clusters) {
    for (let i = 0; i < c.count; i++) {
      const dx = (Math.random() - 0.5) * 0.18;
      const dy = (Math.random() - 0.5) * 0.18;
      out.push({
        id: `pt-${id++}`,
        label: `${c.name} chunk ${i + 1}`,
        group: c.name,
        x: c.cx + dx,
        y: c.cy + dy,
      });
    }
  }
  return out;
}
const SCATTER_POINTS = generateScatter();

export function EmbeddingScatterDemo() {
  return (
    <div className="w-full max-w-xl">
      <EmbeddingScatter
        points={SCATTER_POINTS}
        legendLabel="UMAP projection · 42 chunks · 3 collections"
      />
    </div>
  );
}

const RAG_STAGES: RAGStage[] = [
  {
    id: 'embed',
    name: 'Embed query',
    description: 'text-embedding-3-large · 3072 dims',
    status: 'done',
    durationMs: 92,
  },
  {
    id: 'retrieve',
    name: 'Retrieve',
    description: 'Postgres + pgvector · k = 20',
    status: 'done',
    durationMs: 41,
    count: 20,
  },
  {
    id: 'rerank',
    name: 'Rerank',
    description: 'Cohere rerank-v3.5',
    status: 'running',
    count: 8,
  },
  {
    id: 'generate',
    name: 'Generate',
    description: 'claude-sonnet-4-5 · streaming',
    status: 'pending',
  },
];

export function RAGPipelineDemo() {
  return (
    <div className="w-full max-w-3xl">
      <RAGPipeline stages={RAG_STAGES} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · Skills (Phase M)
// ─────────────────────────────────────────────────────────────────────

const SAMPLE_SKILL: Skill = {
  id: 'gcal',
  name: 'Google Calendar',
  description: 'Read events, schedule meetings, and check availability across calendars.',
  version: '2.4.0',
  author: 'nyxis-skills',
  initials: 'GC',
  status: 'enabled',
  authState: 'connected',
  category: 'productivity',
  tags: ['calendar', 'meetings', 'scheduling'],
  scopes: [
    { kind: 'read', resource: 'calendar' },
    { kind: 'write', resource: 'calendar' },
    { kind: 'read', resource: 'contacts' },
  ],
  lastUsedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
};

export function SkillCardDemo() {
  return (
    <div className="w-full max-w-xl">
      <SkillCard skill={SAMPLE_SKILL} toggleable onToggle={(id, on) => alert(`${id} → ${on}`)} />
    </div>
  );
}

export function SkillPermissionsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <SkillPermissions
        scopes={[
          { kind: 'read', resource: 'files' },
          { kind: 'read', resource: 'calendar' },
          { kind: 'write', resource: 'email' },
          { kind: 'admin', resource: 'workspace' },
        ]}
      />
      <SkillPermissions
        compact
        scopes={[
          { kind: 'read', resource: 'files' },
          { kind: 'write', resource: 'email' },
          { kind: 'admin', resource: 'workspace' },
        ]}
      />
    </div>
  );
}

export function SkillAuthStatusDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <SkillAuthStatus state="connected" onDisconnect={() => alert('disconnect')} />
      <SkillAuthStatus state="expired" onConnect={() => alert('reconnect')} />
      <SkillAuthStatus state="needs-reauth" onConnect={() => alert('reauth')} />
      <SkillAuthStatus state="never" onConnect={() => alert('connect')} />
      <SkillAuthStatus state="errored" onConnect={() => alert('retry')} />
    </div>
  );
}

const SKILL_LIST: Skill[] = [
  SAMPLE_SKILL,
  {
    id: 'github',
    name: 'GitHub',
    description: 'Read repos, comment on PRs, open issues.',
    version: '1.8.2',
    initials: 'GH',
    status: 'enabled',
    authState: 'connected',
    category: 'dev',
    scopes: [
      { kind: 'read', resource: 'repos' },
      { kind: 'write', resource: 'issues' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send and read messages across channels.',
    version: '0.9.1',
    initials: 'SL',
    status: 'enabled',
    authState: 'expired',
    category: 'productivity',
    scopes: [
      { kind: 'read', resource: 'messages' },
      { kind: 'write', resource: 'messages' },
    ],
  },
  {
    id: 'pg',
    name: 'Postgres',
    description: 'Read-only access to the analytics replica.',
    version: '3.0.0',
    initials: 'PG',
    status: 'disabled',
    authState: 'never',
    category: 'data',
    scopes: [{ kind: 'read', resource: 'database' }],
  },
];

export function SkillRegistryDemo() {
  const [active, setActive] = useState<string | undefined>(undefined);
  return (
    <div className="w-full max-w-2xl">
      <SkillRegistry skills={SKILL_LIST} activeId={active} onSelect={setActive} />
    </div>
  );
}

const SKILL_NOW = new Date();
const skillAgo = (s: number) => new Date(SKILL_NOW.getTime() - s * 1000);

const SKILL_INVOCATIONS: SkillInvocation[] = [
  {
    id: '5',
    skillId: 'gcal',
    skillName: 'Google Calendar',
    action: 'createEvent',
    status: 'running',
    startedAt: skillAgo(2),
    input: { title: 'Sync with Maria', start: '2026-05-08T15:00:00Z', durationMin: 30 },
  },
  {
    id: '4',
    skillId: 'github',
    skillName: 'GitHub',
    action: 'commentOnPR',
    status: 'completed',
    startedAt: skillAgo(40),
    durationMs: 312,
    input: { repo: 'juliodaal/nyxis', pr: 42, body: 'Approved.' },
    result: { id: 'comment_18271' },
  },
  {
    id: '3',
    skillId: 'slack',
    skillName: 'Slack',
    action: 'sendMessage',
    status: 'errored',
    startedAt: skillAgo(120),
    durationMs: 4_200,
    error: 'token_expired — please reconnect Slack to continue.',
  },
  {
    id: '2',
    skillId: 'gcal',
    skillName: 'Google Calendar',
    action: 'listEvents',
    status: 'completed',
    startedAt: skillAgo(420),
    durationMs: 180,
    input: { range: '2026-05-08' },
    result: { events: 4 },
  },
];

export function SkillInvocationLogDemo() {
  return (
    <div className="w-full max-w-2xl">
      <SkillInvocationLog invocations={SKILL_INVOCATIONS} />
    </div>
  );
}

const MARKETPLACE_SKILLS: Skill[] = [
  {
    id: 'gcal',
    name: 'Google Calendar',
    description: 'Read events, schedule meetings, and check availability across calendars.',
    version: '2.4.0',
    author: 'nyxis-skills',
    initials: 'GC',
    category: 'productivity',
    rating: 4.8,
    ratingCount: 1284,
    installs: 218_000,
    installed: true,
    scopes: [
      { kind: 'read', resource: 'calendar' },
      { kind: 'write', resource: 'calendar' },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Read repos, open issues, comment on PRs, search code.',
    version: '1.8.2',
    author: 'nyxis-skills',
    initials: 'GH',
    category: 'dev',
    rating: 4.6,
    ratingCount: 902,
    installs: 145_000,
    scopes: [
      { kind: 'read', resource: 'repos' },
      { kind: 'write', resource: 'issues' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send and read messages across channels and DMs.',
    version: '0.9.1',
    author: 'community',
    initials: 'SL',
    category: 'productivity',
    rating: 4.2,
    ratingCount: 412,
    installs: 38_400,
    scopes: [
      { kind: 'read', resource: 'messages' },
      { kind: 'write', resource: 'messages' },
    ],
  },
  {
    id: 'pg',
    name: 'Postgres',
    description: 'Read-only access to a Postgres database with safe schemas.',
    version: '3.0.0',
    author: 'data-team',
    initials: 'PG',
    category: 'data',
    rating: 4.9,
    ratingCount: 87,
    installs: 6_200,
    scopes: [{ kind: 'read', resource: 'database' }],
  },
];

export function SkillMarketplaceDemo() {
  const [installing, setInstalling] = useState<string | undefined>(undefined);
  return (
    <div className="w-full max-w-3xl">
      <SkillMarketplace
        skills={MARKETPLACE_SKILLS}
        installingId={installing}
        onInstall={(id) => {
          setInstalling(id);
          setTimeout(() => setInstalling(undefined), 1500);
        }}
        onSelect={(id) => alert(`open ${id}`)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI · Animations (Phase N)
// ─────────────────────────────────────────────────────────────────────

export function SparkleFieldDemo() {
  return (
    <SparkleField className="text-primary inline-block">
      <button
        type="button"
        className="from-primary text-primary-foreground rounded-md bg-gradient-to-br via-violet-500 to-sky-500 px-5 py-2.5 text-sm font-semibold"
      >
        ✨ Improve with AI
      </button>
    </SparkleField>
  );
}

export function AIHaloBorderDemo() {
  return (
    <AIHaloBorder>
      <div className="text-foreground w-[360px] p-5">
        <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
          AI-generated
        </p>
        <p className="text-sm leading-relaxed">
          Nyxis ships adapters as peer dependencies so apps only pay for the providers they actually
          use.
        </p>
      </div>
    </AIHaloBorder>
  );
}

export function ThinkingOrbDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <ThinkingOrb state="idle" label="idle" />
      <ThinkingOrb state="thinking" label="thinking" />
      <ThinkingOrb state="speaking" label="speaking" />
      <ThinkingOrb state="errored" label="errored" />
    </div>
  );
}

export function NeuralBackgroundDemo() {
  return (
    <NeuralBackground className="bg-background text-primary border-border grid h-[360px] w-full place-items-center rounded-lg border">
      <div className="text-center">
        <h2 className="text-foreground text-3xl font-bold tracking-tight">Nyxis</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          A modern React component library for AI products.
        </p>
      </div>
    </NeuralBackground>
  );
}

export function TokenStreamDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="border-border bg-card text-primary rounded-lg border p-3">
        <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
          Streaming
        </p>
        <TokenStream height={28} />
      </div>
      <div className="border-border bg-card rounded-lg border p-3 text-violet-500">
        <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wider">
          Direction left
        </p>
        <TokenStream direction="left" height={28} />
      </div>
    </div>
  );
}

export function GradientAuraDemo() {
  return (
    <GradientAura intensity={0.65}>
      <div className="border-border bg-card text-foreground relative w-[360px] rounded-xl border p-6">
        <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
          Premium
        </p>
        <h3 className="mt-1 text-2xl font-bold">Nyxis Pro</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Soft gradient glow behind the card. Pure CSS — no canvas, no deps.
        </p>
      </div>
    </GradientAura>
  );
}

// Re-export silence helpers so unused locals don't trip lint when adding
// new demos that don't yet use a symbol.
export const _unused = { Bell, Github, MoreHorizontal, Settings };
