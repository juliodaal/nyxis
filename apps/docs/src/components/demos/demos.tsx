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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ActionItem,
  AuditLogItem,
  AuroraBackground,
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
  CountUp,
  DataTable,
  DecryptText,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DotGridBackground,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  EmailTriageCard,
  FileDropzone,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  GradientText,
  Input,
  KPICard,
  Label,
  LeadCard,
  MagneticButton,
  MarqueeText,
  MessageActions,
  MeshGradientBackground,
  ParameterForm,
  ParallaxContainer,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  ReasoningTrace,
  RevealText,
  RotatingText,
  ScrambleText,
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
  ShinyText,
  Skeleton,
  SplitText,
  SpotlightCursor,
  StaggerReveal,
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
  ThinkingIndicator,
  TiltCard,
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
  TypeWriter,
  TypingIndicator,
  toast,
} from 'nyxis-ui';

// ─────────────────────────────────────────────────────────────────────
// Text animations
// ─────────────────────────────────────────────────────────────────────

export function SplitTextDemo() {
  return (
    <SplitText
      as="h2"
      splitBy="words"
      stagger={0.05}
      className="text-foreground text-balance text-center text-4xl font-bold tracking-tight"
    >
      Document intelligence, automated.
    </SplitText>
  );
}

export function TypeWriterDemo() {
  return (
    <TypeWriter
      as="span"
      text={[
        'document intelligence',
        'meeting summaries',
        'lead qualification',
        'support deflection',
      ]}
      className="text-primary text-3xl font-bold"
    />
  );
}

export function ScrambleTextDemo() {
  return (
    <ScrambleText className="text-primary font-mono text-2xl">
      extracting invoice fields...
    </ScrambleText>
  );
}

export function DecryptTextDemo() {
  return (
    <DecryptText durationPerChar={80} className="text-primary font-mono text-2xl">
      classifying inbox queue...
    </DecryptText>
  );
}

export function GradientTextDemo() {
  return (
    <GradientText as="h2" className="text-center text-5xl font-bold tracking-tight">
      AI products that ship.
    </GradientText>
  );
}

export function ShinyTextDemo() {
  return (
    <ShinyText as="span" className="text-3xl font-semibold">
      Premium · Pro · Enterprise
    </ShinyText>
  );
}

export function CountUpDemo() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <CountUp
        to={48210}
        format="currency"
        currency="EUR"
        locale="en-US"
        className="text-foreground text-5xl font-bold"
      />
      <span className="text-muted-foreground text-xs uppercase tracking-wider">
        MRR · last 30 days
      </span>
    </div>
  );
}

export function RevealTextDemo() {
  return (
    <RevealText className="text-foreground text-center text-3xl font-bold">
      Scroll-triggered reveals are accessible by default.
    </RevealText>
  );
}

export function MarqueeTextDemo() {
  const items = [
    'Document AI',
    'AI Assistant',
    'Lead Intelligence',
    'Support Copilot',
    'Meeting Intelligence',
    'Operations Dashboard',
    'Email Triage',
  ];
  return (
    <MarqueeText speed={28}>
      {items.map((label) => (
        <span key={label} className="text-muted-foreground text-2xl font-medium">
          {label}
        </span>
      ))}
    </MarqueeText>
  );
}

export function RotatingTextDemo() {
  return (
    <div className="text-foreground flex flex-wrap items-baseline justify-center gap-2 text-3xl font-bold">
      AI for{' '}
      <RotatingText
        words={['Sales', 'Operations', 'Finance', 'Support']}
        className="text-primary"
      />
    </div>
  );
}

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
// Effect animations
// ─────────────────────────────────────────────────────────────────────

export function MagneticButtonDemo() {
  return (
    <MagneticButton strength={0.45} distance={140}>
      Hover me
    </MagneticButton>
  );
}

export function SpotlightCursorDemo() {
  return (
    <SpotlightCursor className="bg-card grid h-full w-full place-items-center rounded-lg">
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <h2 className="text-foreground text-3xl font-bold">Move your cursor</h2>
        <p className="text-muted-foreground">A soft spotlight follows you.</p>
      </div>
    </SpotlightCursor>
  );
}

export function ParallaxContainerDemo() {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-4 text-sm">
      <p>(Parallax is best seen on a real scrolling page — see the docs landing.)</p>
      <ParallaxContainer depth={120} className="border-border bg-card rounded-lg border p-6">
        <h3 className="text-foreground text-xl font-semibold">I move slower than the page.</h3>
      </ParallaxContainer>
    </div>
  );
}

export function StaggerRevealDemo() {
  return (
    <StaggerReveal trigger="mount" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {[
        'Document AI',
        'AI Assistant',
        'Lead Intelligence',
        'Support Copilot',
        'Meeting Intelligence',
        'Operations Dashboard',
      ].map((name) => (
        <div
          key={name}
          className="border-border bg-card text-foreground shadow-soft rounded-lg border p-4 text-sm font-medium"
        >
          {name}
        </div>
      ))}
    </StaggerReveal>
  );
}

export function TiltCardDemo() {
  return (
    <TiltCard className="size-72">
      <div className="border-border bg-card shadow-elevated grid h-full place-items-center rounded-2xl border p-6 text-center">
        <div>
          <h3 className="text-foreground text-xl font-semibold">Document AI</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Document intelligence for finance teams.
          </p>
        </div>
      </div>
    </TiltCard>
  );
}

export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground className="grid h-full w-full place-items-center rounded-lg">
      <div className="px-12 py-16 text-center">
        <h2 className="text-foreground text-4xl font-bold tracking-tight">Nyxis</h2>
        <p className="text-muted-foreground mt-2">A modern React component library.</p>
      </div>
    </AuroraBackground>
  );
}

export function DotGridBackgroundDemo() {
  return (
    <DotGridBackground className="bg-background grid h-full min-h-[24rem] w-full place-items-center rounded-lg">
      <div className="text-center">
        <h2 className="text-foreground text-3xl font-bold tracking-tight">Move the cursor</h2>
        <p className="text-muted-foreground mt-2">Dots react around the pointer.</p>
      </div>
    </DotGridBackground>
  );
}

export function MeshGradientBackgroundDemo() {
  return (
    <MeshGradientBackground className="grid h-full w-full place-items-center rounded-lg">
      <div className="px-12 py-16 text-center">
        <h2 className="text-foreground text-3xl font-bold tracking-tight">Mesh gradient</h2>
        <p className="text-muted-foreground mt-2">Soft, shifting backdrop.</p>
      </div>
    </MeshGradientBackground>
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
  AIProviderSelector,
  APIKeyInput,
  ContextWindowMeter,
  CostMeter,
  MaxTokensInput,
  ModelPicker,
  ProviderHealthBadge,
  SystemPromptEditor,
  TemperatureSlider,
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
  ForkNode,
  ParameterField,
  RegisteredTool,
  ToolExecution,
} from 'nyxis-ui';

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

// Re-export silence helpers so unused locals don't trip lint when adding
// new demos that don't yet use a symbol.
export const _unused = { Bell, Github, MoreHorizontal, Settings };
