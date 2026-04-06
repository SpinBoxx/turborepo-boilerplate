---
name: web-frontend-architecture
description: "Enforces the project's frontend architecture conventions for the web app (apps/web). Use when creating or modifying any page, feature, component, form, or data-fetching logic in the web app. Use when adding new files or folders to features/. Use when deciding where to place a new component or how to pass data between components."
---

# Web Frontend Architecture

## When to Use

- Creating or modifying any page, feature, component, or form in `apps/web`
- Adding new files to `features/`
- Deciding where a component lives (`components/` vs `ui/`)
- Building a form
- Passing data from route → page → component tree
- Creating API client functions or translations

## Feature-Based Folder Structure

All code related to a domain lives inside its `features/<domain>/` folder. Never scatter feature code across `pages/`, `components/`, and `features/` separately.

### Canonical structure for a feature

```
features/<domain>/
├── components/           # Atomic, single-responsibility components
│   ├── <Domain>Provider.tsx        # Context provider (wraps the subtree)
│   ├── <Domain>Name.tsx            # Renders one piece of data
│   ├── <Domain>Image.tsx           # Renders an image
│   └── ...
├── ui/                   # Composite components (assemble multiple atomics)
│   ├── <Domain>Card.tsx            # Card = Image + Name + Price + Badge
│   ├── <Domain>DetailTabs/         # Complex multi-file composite
│   └── ...
├── forms/                # Forms (one sub-folder per form)
│   └── <FormName>/
│       ├── <FormName>.tsx          # Form component (renders fields)
│       ├── use<FormName>.ts        # useAppForm() hook (logic + validation)
│       └── <FormName>.content.ts   # i18n translations for fields/errors

├── hooks/                # Feature-specific React hooks (non-form)
├── services/             # Business logic (pure functions, no React)
├── translations/         # Feature-wide i18n content files
├── pages/                # Page-level orchestrators (used by route files)
├── utils/                # Pure helper functions
├── <domain>.api.ts       # API client (orpc wrappers)
├── <domain>.queries.ts   # TanStack Query wrappers (if applicable)
└── index.ts              # Public barrel export (optional)
```

### `hooks/` — Feature-specific React hooks

Hooks that encapsulate **stateful React logic** specific to the feature. Not forms (those go in `forms/`), not context accessors (those live in the Provider file).

Typical contents:
- Zustand stores (`useBookingStore`)
- Feature-specific side-effects or subscriptions
- Hooks that combine multiple React primitives into a reusable unit

```ts
// features/booking/hooks/useBookingHook.ts
// Zustand store — persists booking state (dates, room, guests) to localStorage
export const useBookingStore = create(
  persist<BookingState>(
    (set, get) => ({
      checkInDate: "...",
      checkOutDate: null,
      roomId: null,
      guestCount: 1,
      // ... actions
    }),
    { name: "booking-store" },
  ),
);
```

**Rules:**
- One hook per file, named `use<Thing>.ts`
- Hooks may import from `services/` for pure logic, but never the reverse
- Zustand stores are hooks — they live here
- If a hook is only used by one component, consider inlining it in the component instead

### `services/` — Pure business logic

**Non-React** modules containing pure functions, validation logic, date math, formatting, and business rules. These must be importable and testable without any React dependency.

Typical contents:
- Date calculations (cutoff times, booking windows)
- Input normalization / validation
- Price computation helpers
- State derivation logic

```ts
// features/booking/services/booking.service.ts
export function canBookForToday(now: Date = new Date()): boolean {
  return isBefore(now, getBookingCutoffTime(now));
}

export function normalizeBookingDates(checkIn: string, checkOut: string | null): BookingDates {
  // ... pure logic, no React
}
```

**Rules:**
- Zero React imports — no hooks, no JSX, no context
- Must be unit-testable: put tests as `<service>.test.ts` alongside the file
- Services may import from `@zanadeal/utils` or other packages but never from React components
- If the logic is feature-agnostic (usable across multiple features), it belongs in `packages/utils` instead

### `translations/` — Feature-wide i18n content files

Content dictionaries shared across multiple components within the feature. Uses `intlayer` `t()` helper with `fr/en/mg` translations.

```ts
// features/booking/translations/booking-translations.content.ts
const bookingTranslationsContent = {
  key: "booking-translations",
  content: {
    checkIn: t({ en: "Check-in", fr: "Arrivée", mg: "Fidirana" }),
    checkOut: t({ en: "Check-out", fr: "Départ", mg: "Fivoahana" }),
    guests: t({ en: "Guests", fr: "Invités", mg: "Vahiny" }),
  },
} satisfies Dictionary;
```

**Rules:**
- Translations scoped to a **single component or form** go in a colocated `.content.ts` file next to that component (e.g. `GuestDetailsForm.content.ts`), not here
- This folder is for translations used by **multiple** components within the feature
- Key format: `<feature>-<scope>` (e.g. `booking-translations`)

### `pages/` — Page-level orchestrators

One file per page/route. This is the **entry point** called by the route file. Receives raw data from route context, wraps in Provider, composes layout.

```tsx
// features/booking/pages/ReviewCartCheckoutPage.tsx
export default function ReviewCartCheckoutPage({ room, hotel, ... }: Props) {
  return (
    <BookingProvider room={room} hotel={hotel} ...>
      <Container>
        <StaySummaryCard />
        <GuestDetailsForm />
        <PriceDetailsCard />
      </Container>
    </BookingProvider>
  );
}
```

**Rules:**
- Pages receive **full domain objects** as props — never primitive fields
- Pages are the **only layer** that receives props from the route
- Pages wrap children in the feature's `<Provider>` — below this point, everything reads from context
- One default export per file, named `<Feature><Purpose>Page`

### `utils/` — Pure helper functions

Small, stateless utility functions specific to the feature. The difference with `services/`: utils are generic helpers (formatting, mapping), services encode **business rules**.

```ts
// features/rooms/utils/room.utils.ts
export function formatRoomArea(areaM2: number): string {
  return `${areaM2} m²`;
}
```

**Rules:**
- Zero React imports
- If the utility is useful outside the feature, move it to `packages/utils`
- Test alongside: `room.utils.test.ts`

### `<domain>.api.ts` — API client

Thin wrappers around `orpc` calls. One function per API endpoint. No business logic, no transformation.

```ts
// features/booking/booking-quote.api.ts
import { orpc } from "@/lib/orpc";

export async function createBookingQuote(input: CreateBookingQuoteInput) {
  return orpc.bookingQuote.create(input);
}

export async function getBookingQuoteById(input: GetBookingQuoteInput) {
  return orpc.bookingQuote.get(input);
}
```

**Rules:**
- One file per domain entity (e.g. `booking-quote.api.ts`, `hotel.api.ts`)
- Functions are async, return the orpc call directly
- Type the input with the schema type from `@zanadeal/api/features/<domain>`
- No `try/catch` — let the caller handle errors

### `<domain>.queries.ts` — TanStack Query wrappers

Query key factories and `useQuery`/`useMutation` hooks. Separate from `.api.ts` because queries add caching, deduplication, and React integration on top of raw API calls.

```ts
// features/hotels/hotel.queries.ts
export function hotelKeys() {
  return {
    all: ["hotel"] as const,
    list: (input: ListHotelsInput) => ["hotel", "list", input] as const,
    byId: (id: string) => ["hotel", "byId", id] as const,
  };
}

export function useHotels(input: ListHotelsInput) {
  return useQuery({
    queryKey: hotelKeys().list(input),
    queryFn: () => listHotels(input),
  });
}
```

**Rules:**
- Always define a `<domain>Keys()` factory for query key consistency
- One file per domain, named `<domain>.queries.ts`
- Import API functions from the sibling `.api.ts` file
- `enabled` option must guard against null/undefined inputs

### Where does checkout live?

Checkout is part of the **booking** feature. Everything checkout-related goes in `features/booking/`, not in `pages/checkout/` or `features/checkout/`.

```
features/booking/
├── components/
│   └── BookingProvider.tsx
├── ui/
│   ├── StaySummaryCard.tsx
│   └── PriceDetailsCard.tsx
├── forms/
│   └── GuestDetailsForm/
│       ├── GuestDetailsForm.tsx
│       ├── useGuestDetailsForm.ts
│       └── GuestDetailsForm.content.ts
├── pages/
│   └── ReviewCartCheckoutPage.tsx
├── hooks/
│   └── useBookingHook.ts
├── booking-quote.api.ts
└── translations/
```

## Component Tiers

### `components/` — Atomic components

- Render **one piece of data** from context or a single prop
- Read domain data from a **Context Provider** (e.g. `useBookingContext()`)
- Accept only styling/layout props (`className`, `variant`, `children`)
- No business logic, no data fetching

```tsx
// features/booking/components/BookingHotelName.tsx
export default function BookingHotelName({ className }: ComponentProps<"h3">) {
  const { hotel } = useBookingContext();
  return <h3 className={cn("font-semibold text-lg", className)}>{hotel.name}</h3>;
}
```

### `ui/` — Composite components

- Assemble **multiple atomic components** into a meaningful UI block
- Import from `../components/` (siblings), never from other features' internals
- May contain layout logic (grids, separators, cards)
- Must be wrapped by the feature's Provider in the page

```tsx
// features/booking/ui/StaySummaryCard.tsx
export default function StaySummaryCard() {
  return (
    <Card>
      <CardHeader><CardTitle>...</CardTitle></CardHeader>
      <CardPanel>
        <BookingRoomImage />
        <BookingHotelName />
        <BookingRoomType />
        <Separator />
        <BookingDates />
        <BookingGuestCount />
      </CardPanel>
    </Card>
  );
}
```

### `pages/` — Page orchestrators

- Receive data from route context
- Wrap children in the feature's **Provider**
- Compose `ui/` composites and `forms/` into a layout
- This is the **only place** that receives props from the route

```tsx
// features/booking/pages/ReviewCartCheckoutPage.tsx
export default function ReviewCartCheckoutPage({ room, hotel, ... }: Props) {
  return (
    <BookingProvider room={room} hotel={hotel} checkInDate={...} checkOutDate={...}>
      <Container>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <StaySummaryCard />
            <GuestDetailsForm />
          </div>
          <div className="lg:col-span-5">
            <PriceDetailsCard />
          </div>
        </div>
      </Container>
    </BookingProvider>
  );
}
```

## Data Flow: No Props Drilling

### Rule: Pass domain objects, not decomposed fields

```tsx
// BAD — props drilling (decomposing objects into 10+ primitive props)
<StaySummaryCard
  hotelName={hotel.name}
  hotelAddress={hotel.address}
  roomTitle={room.title}
  roomType={room.type}
  roomImage={room.images[0]?.publicId}
  checkInDate={checkInDate}
  checkOutDate={checkOutDate}
  guestCount={guestCount}
  nights={pricePreview.nights}
/>

// GOOD — Context Provider pattern (existing in the project)
<BookingProvider room={room} hotel={hotel} checkInDate={...} checkOutDate={...}>
  <StaySummaryCard />  {/* reads what it needs from context */}
</BookingProvider>

// GOOD — if more than 2 components pass a data object
const bookingContextValue = { room, hotel, checkInDate, checkOutDate, guestCount, nights: pricePreview.nights };
<BookingProvider value={bookingContextValue}>
  <StaySummaryCard />  {/* reads what it needs from context */}
</BookingProvider>
```

### Data flow pipeline

```
Route (beforeLoad)
  → fetches data (room, hotel)
  → passes to page via route context

Page (features/<domain>/pages/)
  → receives full domain objects
  → wraps in <DomainProvider>
  → composes ui/ and forms/

Provider (features/<domain>/components/<Domain>Provider.tsx)
  → holds domain objects + derived state (computed prices, etc.)
  → exposes via useDomainContext()

Atomic components (features/<domain>/components/)
  → call useDomainContext()
  → render one thing

Composite components (features/<domain>/ui/)
  → compose atomics
  → no props needed (atomics read from context)
```

## Forms: TanStack Form Convention

### Structure

Every form gets its own sub-folder under `forms/`:

```
features/<domain>/forms/<FormName>/
├── <FormName>.tsx           # Renders the form UI (fields + submit button)
├── use<FormName>.ts         # useAppForm() hook — owns defaultValues, validators, onSubmit
└── <FormName>.content.ts    # i18n translations for labels, placeholders, errors
```

### Hook file (`use<FormName>.ts`)

Contains the `useAppForm()` call with all form configuration:

```tsx
// features/booking/forms/GuestDetailsForm/useGuestDetailsForm.ts
import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/hooks/useAppForm";

interface UseGuestDetailsFormOptions {
  onSubmit: (values: GuestDetailsValues) => Promise<void>;
}

export interface GuestDetailsValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export function useGuestDetailsForm({ onSubmit }: UseGuestDetailsFormOptions) {
  return useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
    } satisfies GuestDetailsValues,
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
}
```

### Form component (`<FormName>.tsx`)

Renders the form UI using `form.AppField` and the registered field components:

```tsx
// features/booking/forms/GuestDetailsForm/GuestDetailsForm.tsx
export default function GuestDetailsForm() {
  const { onConfirmBooking, isSubmitting } = useBookingContext();
  const t = useIntlayer("guest-details-form");
  const form = useGuestDetailsForm({ onSubmit: onConfirmBooking });

  return (
    <Card>
      <CardHeader><CardTitle>{t.title}</CardTitle></CardHeader>
      <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
        <CardPanel>
          <form.AppField name="firstName" validators={...}>
            {(field) => <field.TextField label={t.firstName} />}
          </form.AppField>
          {/* ... more fields */}
        </CardPanel>
        <CardFooter>
          <form.SubmitButton>{t.confirm}</form.SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
```

### Rules

- **Never use raw `<Form>` + `<Input>` + `FormData`** for forms with validation. Always use `useAppForm()` and the registered `fieldComponents`
- The form hook is the **single source of truth** for default values, validation, and submit logic
- Form components read behavior callbacks from context (e.g. `useBookingContext().onConfirmBooking`)
- Put form-specific i18n in the form's `.content.ts`, not in the page's content file

## Route Files

Route files (`routes/**/*.tsx`) are thin:

```tsx
// routes/_checkout/review-cart-checkout/index.tsx
export const Route = createFileRoute("/_checkout/review-cart-checkout/")({
  component: RouteComponent,
  beforeLoad: async () => {
    // 1. Read client state (Zustand)
    // 2. Validate required fields → redirect if missing
    // 3. Fetch server data (room, hotel) → redirect on error
    // 4. Return full domain objects
    return { room, hotel, checkInDate, checkOutDate, guestCount };
  },
});

function RouteComponent() {
  const ctx = Route.useRouteContext();
  return <ReviewCartCheckoutPage {...ctx} />;
}
```

### Rules

- Route files contain **no UI** beyond the one-line `<Page {...ctx} />`
- `beforeLoad` fetches **complete domain objects**, not partial data
- Never create domain objects (e.g. BookingQuote) in `beforeLoad` if they depend on user input that hasn't been collected yet
- Validate the full data flow mentally: "At this point in time, does the user have all the data needed for this API call?"

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Feature folder | `kebab-case` | `features/booking/` |
| Component file | `PascalCase` matching export | `BookingHotelName.tsx` |
| Hook file | `use` prefix, camelCase | `useBookingContext.ts` |
| API client | `<domain>.api.ts` | `booking-quote.api.ts` |
| Queries | `<domain>.queries.ts` | `hotel.queries.ts` |
| i18n content | `<component>.content.ts` | `GuestDetailsForm.content.ts` |
| Utils | `<domain>.utils.ts` | `room.utils.ts` |
| Provider | `<Domain>Provider.tsx` | `BookingProvider.tsx` |
| Context hook | `use<Domain>Context` | `useBookingContext()` |

## Checklist Before Writing Code

Run through this checklist for every feature implementation:

1. **Feature folder** — Does everything live in `features/<domain>/`?
2. **No orphan pages** — Is the page in `features/<domain>/pages/`, not in `pages/`?
3. **Atomic vs Composite** — Is each component in the right tier?
4. **Provider exists** — Is there a `<Domain>Provider>` to avoid props drilling?
5. **Forms use TanStack Form** — Does the form use `useAppForm()` with a dedicated hook?
6. **Data flow validates** — Walk the flow from route → page → provider → component. At every step, is the data available?
7. **No premature API calls** — Does the API call have all required inputs at the time it's invoked?
8. **i18n colocated** — Are translations next to the component that uses them?
9. **Route file is thin** — Does the route file only fetch data + render one page component?

---

## Toast Notifications (sonner)

All user-facing feedback (success, error) uses `toast` from `sonner`. Never use `alert()` or custom inline error banners for mutation feedback.

```tsx
import { toast } from "sonner";

// In a try/catch handler
try {
  await createBookingQuote(input);
  toast.success(t.bookingCreated.value);
} catch (error) {
  toast.error(t.bookingFailed.value, {
    description: error instanceof Error ? error.message : t.genericError.value,
  });
}
```

**Rules:**
- Use `toast.error(title, { description })` — always i18n both title and description
- Use `toast.success()` for confirmations after successful mutations
- Pair with `try/catch` in async handlers — never let errors go silent
- `<Toaster />` is mounted once in `main.tsx`, never add another instance

---

## Skeleton & Loading States

### List skeleton — `.Skeleton` static property

List components expose a `.Skeleton` static method for their loading state:

```tsx
// features/hotels/ui/HotelsCardList.tsx
const HotelCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
    <div className="aspect-4/3 animate-pulse bg-muted" />
    <div className="flex flex-col gap-2 p-4">
      <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  </div>
);

function HotelsCardListSkeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => <HotelCardSkeleton key={i} />)}
    </div>
  );
}

HotelsCardList.Skeleton = HotelsCardListSkeleton;
```

**Usage in pages:**

```tsx
{query.isLoading && !query.data ? (
  <HotelsCardList.Skeleton count={6} />
) : (
  <HotelsCardList hotels={query.data} />
)}
```

**Rules:**
- Skeletons use `animate-pulse bg-muted` with matching dimensions of the real content
- Attach as `.Skeleton` static property on the list component
- Skeleton components are colocated in the same file as the list

### Submit button loading — `<Spinner>`

Form submit buttons show a `<Spinner>` when submitting:

```tsx
// Via form.SubmitButton (uses isSubmitting from form state automatically)
<form.SubmitButton>{t.confirm}</form.SubmitButton>

// Manual pattern (only when not using TanStack Form)
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting && <Spinner aria-hidden="true" />}
  {label}
</Button>
```

---

## Layout Routes

Routes use underscore-prefixed layout groups. Each layout wraps its children with specific UI chrome:

| Layout | Prefix | UI | Purpose |
|---|---|---|---|
| App | `_app` | Navbar + Footer + booking refresh | Public pages (home, hotels, hotel detail) |
| Auth | `_auth` | AuthLayout (minimal) | Login, register, forgot password |
| Checkout | `_checkout` | Navbar + Footer | Checkout flow |
| Legal | `_legal` | Navbar + Footer + spacing | Terms, privacy policy |

**Rules:**
- New pages must go into the correct layout group
- Layout routes are in `routes/_<layout>.tsx` — they render `<Outlet />`
- Layouts never fetch data — only `beforeLoad` in leaf routes fetches

---

## Search Params (TanStack Router)

For pages with filters, sorting, or pagination, use `validateSearch` on the route:

```tsx
// routes/_app/hotels/index.tsx
export const Route = createFileRoute("/_app/hotels/")({
  validateSearch: (search): HotelsPageSearch => parseHotelsPageSearch(search),
  component: RouteComponent,
});
```

### Updating search params

```tsx
const navigate = useNavigate();
navigate({
  search: (prev) => ({ ...prev, sort: "price-asc", page: 1 }),
  replace: true,  // don't add to history for filter changes
});
```

**Rules:**
- Define a parse function (e.g. `parseHotelsPageSearch`) that validates + defaults all params
- Use `replace: true` for filter/sort changes to avoid polluting browser history
- Search params are the source of truth for list pages — no duplicating in Zustand

---

## Page Meta & SEO

### `head()` on routes (preferred)

```tsx
export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Zanadeal - Book your perfect stay" },
      { name: "description", content: "Find and book hotels in Madagascar" },
    ],
  }),
  component: RouteComponent,
});
```

### `useDocumentTitle` fallback (for dynamic titles)

```tsx
import { useDocumentTitle } from "usehooks-ts";
useDocumentTitle(hotel.name);
```

**Rules:**
- Static titles → `head()` on the route
- Dynamic titles (depend on fetched data) → `useDocumentTitle` in the page component
- Always include a `title` and `description` for public-facing pages

---

## Responsive Patterns

### Dialog vs Drawer — `useIsMobile()`

Desktop shows a `Dialog`, mobile shows a `Drawer`. Use `useIsMobile()` to switch:

```tsx
// features/rooms/ui/RoomDetail.tsx
import { useIsMobile } from "@/hooks/use-mobile";

export default function RoomDetail({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  if (isMobile) return <RoomDetailDrawer>{children}</RoomDetailDrawer>;
  return <RoomDetailDialog>{children}</RoomDetailDialog>;
}
```

### CSS dual rendering — separate mobile/desktop components

For components with fundamentally different layouts (not just responsive tweaks):

```tsx
<BookingSearchBarMobile className="flex sm:hidden" />
<BookingSearchBarDesktop className="hidden sm:flex" />
```

**Rules:**
- Simple responsive → Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- Different interaction model (dialog vs drawer) → `useIsMobile()` switch
- Completely different DOM structure → two components with `hidden`/`flex` toggle
- `useIsMobile()` breakpoint is `768px` (matches Tailwind `md:`)

---

## Lazy Loading

Heavy components (maps, detail panels, rich editors) must be lazy-loaded:

```tsx
import { lazy, Suspense } from "react";

const FindHotelsOnMap = lazy(() => import("@/features/hotels/ui/HotelsMap/FindHotelsOnMap"));

function MapSection() {
  return (
    <Suspense fallback={<MapFallback />}>
      <FindHotelsOnMap />
    </Suspense>
  );
}
```

**Rules:**
- Always pair `lazy()` with `<Suspense fallback={...}>` — never leave fallback empty
- Fallback should match the dimensions of the lazy component (skeleton or placeholder div)
- Use for: maps, charts, detail modals, anything with heavy dependencies
- TanStack Router `autoCodeSplitting: true` in `vite.config.ts` handles route-level splitting automatically — don't manually split route components

---

## Widget Layer (`widgets/`)

Cross-feature layout primitives live in `widgets/`, not in `components/` or `features/`:

```
widgets/
├── container.tsx       # Max-width wrapper: max-w-7xl px-4 sm:px-8
├── navbar/
│   └── Navbar.tsx      # Top navigation bar
├── footer/
│   └── footer.tsx      # Footer with links + social
└── root/
    └── RootDialogs.tsx # Global dialogs (locale picker on first visit)
```

**Rules:**
- Widgets are **app-level layout** — shared across all features and routes
- Never put business logic in widgets
- Widgets don't know about specific features (no imports from `features/`)
- `Container` is used in pages and layouts for consistent max-width

---

## Type Imports from API Package

All domain types come from `@zanadeal/api/features/<domain>`:

```tsx
import type { HotelComputed, HotelUserComputed } from "@zanadeal/api/features/hotel";
import type { RoomComputed, RoomUserComputed } from "@zanadeal/api/features/room";
import type { CreateBookingQuoteInput } from "@zanadeal/api/features/booking-quote";
```

### Type naming conventions

| Suffix | Meaning | Example |
|---|---|---|
| `*Computed` | Server-computed response (union of all roles) | `HotelComputed` |
| `*UserComputed` | User-role response (no admin fields) | `HotelUserComputed` |
| `*AdminComputed` | Admin-role response (includes `isArchived`, etc.) | `HotelAdminComputed` |
| `*Input` | Request schema type | `CreateBookingQuoteInput` |

**Rules:**
- Always use `import type` — never import runtime values from the API package on the frontend
- Prefer `*UserComputed` in web app components (users never see admin fields)
- `*Input` types are used in `.api.ts` files and form hooks

---

## Component Library: Base UI (`@base-ui-components/react`)

The web app uses **Base UI** (`@base-ui-components/react`) as the foundation for `components/ui/`. These are the project's own design system primitives.

### Where to import from

```tsx
// CORRECT — web app components (Base UI based)
import { Button } from "@/components/ui/button";
import { Dialog, DialogPopup, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardPanel } from "@/components/ui/card";

// ONLY for components NOT in @/components/ui/ (carousel, file-upload)
import { Carousel } from "@zanadeal/ui";
```

### Available primitives in `@/components/ui/`

`accordion`, `alert`, `alert-dialog`, `autocomplete`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `checkbox`, `checkbox-group`, `collapsible`, `combobox`, `command`, `dialog`, `drawer`, `empty`, `field`, `fieldset`, `form`, `frame`, `group`, `input`, `input-group`, `kbd`, `label`, `menu`, `meter`, `number-field`, `pagination`, `popover`, `preview-card`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toggle`, `toggle-group`, `toolbar`, `tooltip`

### `cn()` utility

```tsx
import { cn } from "@/lib/utils"; // web app — preferred
// OR
import { cn } from "@zanadeal/ui";  // shared package — same implementation
```

Both export `twMerge(clsx(...inputs))`. Use `@/lib/utils` in the web app.

**Rules:**
- Default to `@/components/ui/` for all UI primitives
- Only use `@zanadeal/ui` for components that don't exist in `@/components/ui/` (e.g. `Carousel`, `FileUpload`)
- Never mix Base UI and Radix for the same component type — `@/components/ui/button` is the only `Button`
- `cn()` from `@/lib/utils` in web app code

---

## CSS & Theming

### Tailwind v4 + oklch color system

Theme tokens are defined as CSS variables in `styles.css` and mapped to Tailwind via `@theme inline`:

```css
:root {
  --primary: oklch(0.5133 0.1352 315.45);
  --background: oklch(0.98 0.005 315.45);
  --muted: oklch(0.95 0.005 315.45);
  --destructive: oklch(0.55 0.2 27.33);
  --radius: 0.75rem;
  --tracking-normal: -0.015em;
}
.dark { /* dark mode overrides */ }
```

### Rules

- Use semantic tokens (`bg-primary`, `text-muted-foreground`) — never hardcode oklch values in components
- Custom font: **Lufga** (weights 100–900), loaded via `@font-face` in `styles.css`
- Global tight tracking: `--tracking-normal: -0.015em` applied to all text
- Border radius: `rounded-*` classes use `--radius` (0.75rem base)
- Dark mode: fully supported via `.dark` class — always test both themes
- `@container` queries: available for components that need container-relative sizing (e.g. cards in grid)
