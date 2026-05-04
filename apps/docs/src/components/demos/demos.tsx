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
  ChatInput,
  ChatMessage,
  Checkbox,
  CitationCard,
  Combobox,
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
  MeshGradientBackground,
  ParallaxContainer,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
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
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeToggle,
  TiltCard,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TypeWriter,
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
    'DocuMind',
    'AskCompany',
    'LeadSift',
    'SupportDeflect',
    'MeetingMind',
    'PulseReport',
    'InboxZero',
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
      {['DocuMind', 'AskCompany', 'LeadSift', 'SupportDeflect', 'MeetingMind', 'PulseReport'].map(
        (name) => (
          <div
            key={name}
            className="border-border bg-card text-foreground shadow-soft rounded-lg border p-4 text-sm font-medium"
          >
            {name}
          </div>
        ),
      )}
    </StaggerReveal>
  );
}

export function TiltCardDemo() {
  return (
    <TiltCard className="size-72">
      <div className="border-border bg-card shadow-elevated grid h-full place-items-center rounded-2xl border p-6 text-center">
        <div>
          <h3 className="text-foreground text-xl font-semibold">DocuMind</h3>
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
        placeholder="Ask AskCompany anything..."
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
        actor="DocuMind"
        action="edited fields on"
        target="INV-04812"
        diff={[
          { field: 'total_eur', before: 4720, after: 4830 },
          { field: 'vat_rate', before: 0.18, after: 0.19 },
        ]}
      />
      <AuditLogItem
        timestamp="2026-05-03 14:02"
        actor="DocuMind"
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

// Re-export silence helpers so unused locals don't trip lint when adding
// new demos that don't yet use a symbol.
export const _unused = { Bell, Github, MoreHorizontal, Settings };
