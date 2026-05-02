---
name: zanadeal-web-best-practices
description: "Canonical Zanadeal web development skill for React, TypeScript, TanStack Router, TanStack Query, ORPC, feature-sliced architecture, src/pages/<feature> page organization, atomic component separation, Suspense, react-error-boundary, skeleton anatomy, forms, UI state, accessibility, and verification. Use this skill for every web/admin frontend task in apps/web or apps/admin: creating or modifying pages, features, components, hooks, providers, forms, query files, API client wrappers, route-level data flow, dashboard/table/filter UIs, and React refactors. This skill is the single source of truth for web development in this repository."
---

# Zanadeal Web Best Practices

This is the canonical frontend workflow for Zanadeal web development. Treat it as the single source of truth when working in `apps/web` or `apps/admin`.

Use it whenever the task touches React UI, routing, feature folders, forms, TanStack Query, ORPC client calls, local state, server state, page composition, dashboard/table/filter screens, or frontend refactors.

## Core Principles

1. Build by feature, not by technical layer.
2. Keep pages thin: data orchestration and composition only.
3. Keep components atomic: one responsibility per component.
4. Keep server state in TanStack Query, not in local state.
5. Keep API calls in `.api.ts`, Query hooks in `.queries.ts`, and business logic in `services/`.
6. Prefer providers/context when a feature subtree needs shared domain state.
7. Wrap async UI with `Suspense` and `ErrorBoundary` boundaries at the smallest useful surface.
8. Use skeletons that mirror the anatomy of the final component, not generic blocks.
9. Preserve the project's design system and existing patterns before introducing new ones.
10. Verify behavior with targeted diagnostics/tests before considering the task complete.

## Standard Feature Structure

Domain logic should live under `src/features/<domain>/`. Page entry points live under `src/pages/<feature>/`, grouped by feature. Do not put page entry points inside `features/<domain>/pages`.

```txt
features/<domain>/
├── components/           # Atomic components, one focused responsibility
├── ui/                   # Composite UI sections assembled from components
├── forms/                # Form folders, one folder per form
├── hooks/                # Feature-specific React hooks/providers/stores
├── services/             # Pure business rules, no React imports
├── utils/                # Pure formatting/mapping helpers, no React imports
├── translations/         # Feature-level i18n content when needed
├── <domain>.api.ts       # Thin ORPC/API wrappers
├── <domain>.queries.ts   # TanStack Query keys/hooks/mutations
└── index.ts              # Optional public feature exports
```

Page files are grouped separately:

```txt
src/pages/<feature>/
├── <Feature>Page.tsx
├── <Feature>PageSkeleton.tsx       # when the page has async/suspense loading
├── <Feature>PageError.tsx          # when the error surface is page-specific
└── index.ts                        # optional page exports
```

Use this structure in both `apps/web/src` and `apps/admin/src`. Admin features may have more operational dashboards/tables; web features may have more consumer-facing flows, but the page/feature boundaries stay the same.

## Responsibilities By Layer

### Route Files

Route files should be small. They should parse route params/search, load route-level data when the router already owns it, and render one page component.

```tsx
export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BookingStatsDashboardPage />;
}
```

Routes should import page components from `@/pages/<feature>/...`, not from `@/features/<domain>/pages/...`.

Avoid placing dashboard logic, query composition, form state, tables, or large JSX directly in route files.

### Pages In `src/pages/<feature>`

Pages are orchestrators. They may:

- own top-level local UI state such as selected filters or tabs;
- call feature query hooks;
- create memoized strategies/config objects;
- wrap the subtree with feature providers;
- choose between loading, error, empty, and ready states;
- compose `components/` and `ui/` pieces.

Pages should not contain large inline sections, repeated cards, table row rendering, select option maps, formatting functions, API calls, or business rules.

Pages may import from one or more features, because they are composition boundaries. Feature internals must not import pages.

Good page shape:

```tsx
export default function BookingStatsDashboardPage() {
  const [filters, setFilters] = useState(() => createDefaultBookingStatsFilters());
  const snapshotQuery = useBookingStatsSnapshot(filters);
  const realtime = useBookingStatsEvents();

  return (
    <div className="space-y-5">
      <BookingStatsHeader realtime={realtime} onRefresh={snapshotQuery.refetch} />
      <BookingStatsFilters filters={filters} onChange={setFilters} />
      <BookingStatsContent query={snapshotQuery} realtime={realtime} />
    </div>
  );
}
```

If a page needs a page-specific fallback or error surface, colocate it next to the page in `src/pages/<feature>/` as `FeaturePageSkeleton.tsx` and `FeaturePageError.tsx`.

### Components

`components/` contains atomic pieces. A component should render one concept: a name, badge, icon, row, status indicator, filter group, KPI card, table, loading state, or error state.

Atomic components may accept domain props or read feature context. They should not fetch data directly, mutate server state, or know about route params unless that is their explicit responsibility.

Examples:

- `BookingStatsLiveIndicator.tsx`
- `BookingStatsKpiCard.tsx`
- `HotelName.tsx`
- `AmenityIcon.tsx`
- `RoomSortSelect.tsx`

Split a component when it has multiple visual sections, multiple unrelated state branches, or more than one obvious reason to change.

### UI Composites

`ui/` contains larger feature sections assembled from atomic components. Use it for cards, list sections, tables, toolbars, and layouts that combine multiple domain pieces.

Examples:

- `HotelToolbar/HotelToolbar.tsx`
- `HotelsCardList.tsx`
- `PriceDetailsCard.tsx`
- `UserTable.tsx`

Composite UI may map lists and arrange sections, but should still avoid direct API calls and broad business rules.

### Forms

Forms get their own folder.

```txt
forms/<ThingForm>/
├── <ThingForm>.tsx
├── use<ThingForm>.ts
├── <ThingForm>.content.ts
└── <ThingForm>.schema.ts      # if validation is frontend-specific
```

Form components render fields and submit controls. Form hooks handle form setup, default values, validation wiring, and submit mutation composition. Form content files hold labels, helper text, and error copy when localized or reused.

Never bury form logic inside a page once it becomes more than a few fields.

### Hooks And Providers

Use feature hooks for stateful React logic that belongs to the domain.

Use a provider when multiple descendants need the same domain object or state actions.

```tsx
export function HotelProvider({ hotel, children }: PropsWithChildren<{ hotel: Hotel }>) {
  const value = useMemo(() => ({ hotel }), [hotel]);
  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}
```

Provider rules:

- Memoize context values.
- Throw a clear error when the context hook is used outside the provider.
- Do not put server fetching in providers unless the provider is explicitly a data container.
- Keep provider scope as small as practical.

### Services And Utils

Use `services/` for pure domain rules: pricing, eligibility, date rules, normalization, availability logic. Services must not import React.

Use `utils/` for pure generic helpers scoped to the feature: formatting labels, mapping enum values, converting dates for inputs, grouping records. Utils must not import React.

If a helper becomes useful across apps or packages, move it to the appropriate shared package instead of duplicating it.

## TanStack Query Standards

TanStack Query is the server-state layer. Do not mirror query data in `useState` unless the user is editing a local draft.

### API Files

Each feature API file is a thin wrapper around ORPC or another client.

```ts
import type { ListHotelsInput } from "@zanadeal/api/features/hotel";
import { orpc } from "@/lib/orpc";

export function listHotels(input: ListHotelsInput) {
  return orpc.hotel.list(input);
}
```

Rules:

- One function per endpoint.
- Return the ORPC call directly.
- No React imports.
- No `try/catch` unless translating a domain-specific error intentionally.
- No UI formatting or cache invalidation.

### Query Key Factories

Every `.queries.ts` file must expose a key factory.

```ts
export function hotelKeys() {
  return {
    all: ["hotel"] as const,
    lists: () => [...hotelKeys().all, "list"] as const,
    list: (input: ListHotelsInput) => [...hotelKeys().lists(), input] as const,
    details: () => [...hotelKeys().all, "detail"] as const,
    byId: (id: string) => [...hotelKeys().details(), id] as const,
  };
}
```

Key rules:

- Use stable serializable input objects.
- Include every value that changes the server result.
- Invalidate from broad to narrow intentionally, usually `keys().all` or `keys().lists()`.
- Avoid hand-written one-off arrays like `["hotel", id]` outside the key factory.

### Query Hooks

Query hooks live in `<domain>.queries.ts` and call API functions.

```ts
export function useHotels(input: ListHotelsInput) {
  return useQuery({
    queryKey: hotelKeys().list(input),
    queryFn: () => listHotels(input),
  });
}
```

Use `enabled` when a required parameter can be absent.

```ts
export function useHotel(id: string | undefined) {
  return useQuery({
    queryKey: id ? hotelKeys().byId(id) : hotelKeys().byId("__missing__"),
    queryFn: () => getHotelById({ id: id! }),
    enabled: Boolean(id),
  });
}
```

Prefer keeping placeholder keys inside the key factory if they are reused.

For complex or reused queries, expose query option factories so routes, prefetching, and hooks share the same key/function pair.

```ts
export function hotelQueryOptions(id: string) {
  return queryOptions({
    queryKey: hotelKeys().byId(id),
    queryFn: () => getHotelById({ id }),
  });
}

export function useHotel(id: string | undefined) {
  return useQuery({
    ...hotelQueryOptions(id ?? "__missing__"),
    enabled: Boolean(id),
  });
}
```

Use suspense query hooks only when a Suspense boundary exists above the component. Keep non-suspense queries for surfaces that need inline loading states or partial stale data.

### Mutation Hooks

Mutations live in `<domain>.queries.ts`. They own cache updates and invalidation.

```ts
export function useUpsertHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertHotel,
    onSuccess: (hotel) => {
      queryClient.setQueryData(hotelKeys().byId(hotel.id), hotel);
      queryClient.invalidateQueries({ queryKey: hotelKeys().lists() });
    },
  });
}
```

Mutation rules:

- Use `setQueryData` for detail records returned by the mutation.
- Invalidate lists after create/update/delete unless you have fully updated every affected list cache.
- Use `removeQueries` for deleted detail records.
- Keep toast/navigation side effects in UI/form hooks when they are presentation-specific.
- Use optimistic updates only when the rollback path is clear and worth the complexity.

### Real-Time Events

For SSE or WebSocket invalidation, keep the connection hook in the feature query layer or `hooks/` and invalidate query keys rather than manually merging complex server snapshots.

```ts
export function useBookingStatsEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(eventsUrl, { withCredentials: true });

    eventSource.addEventListener("stats.invalidate", () => {
      queryClient.invalidateQueries({ queryKey: bookingStatsKeys().all });
    });

    return () => eventSource.close();
  }, [eventsUrl, queryClient]);
}
```

Prefer lightweight invalidation events plus refetch for operational dashboards unless product requirements need full real-time state merging.

## Suspense, Error Boundaries, And Skeletons

Use `Suspense` and `ErrorBoundary` for async page/section boundaries. Install `react-error-boundary` in the target app if it is not already available before introducing this pattern.

```tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function BookingStatsRouteSurface() {
  return (
    <ErrorBoundary FallbackComponent={BookingStatsPageError}>
      <Suspense fallback={<BookingStatsPageSkeleton />}>
        <BookingStatsDashboardPage />
      </Suspense>
    </ErrorBoundary>
  );
}
```

Boundary placement rules:

- Put a boundary around a page when the whole page depends on async data.
- Put a boundary around a section when the rest of the page can remain useful if that section loads or fails.
- Do not wrap every tiny component; use boundaries at meaningful UX surfaces.
- Keep error fallbacks local to the failed surface and include a retry action when possible.
- Use `resetErrorBoundary` from `react-error-boundary` when retrying after an error.

Skeleton rules:

- Skeletons must mirror the final component's anatomy: same broad layout, same grid/table/card proportions, same major spacing.
- A table skeleton should look like table headers and rows, not one generic rectangle.
- A KPI grid skeleton should show the same number of cards as the final KPI grid.
- A form/filter skeleton should preserve label/control rhythm.
- Avoid spinners for content surfaces; use spinners only for small inline actions.

Good skeleton shape:

```tsx
export function BookingStatsPageSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Chargement des statistiques">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-[340px] rounded-lg" />
    </div>
  );
}
```

Error fallback shape:

```tsx
export function BookingStatsPageError({ resetErrorBoundary }: FallbackProps) {
  return (
    <Card className="rounded-lg border-destructive/50">
      <CardHeader>
        <CardTitle>Impossible de charger les statistiques</CardTitle>
        <CardDescription>La donnée n'a pas pu être récupérée.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={resetErrorBoundary}>Réessayer</Button>
      </CardContent>
    </Card>
  );
}
```

## State Ownership

Use this ownership model:

| State type | Owner |
|---|---|
| Server data | TanStack Query |
| Form draft | Form hook/component |
| Filters/search/pagination | URL search params when shareable, local state/provider when ephemeral |
| Cross-component domain state | Feature provider or feature store |
| Pure derived values | `useMemo` or plain render calculation |
| Constants/labels/options | `<domain>.constants.ts` or colocated options file |
| Formatting/mapping | `utils/` |

Do not copy query data into local state to sort, filter, or map it. Derive it from the query result.

For shareable list state, prefer typed search params with TanStack Router. Use local state for ephemeral panel state only.

## Atomic Separation Rules

Split early. A page or component is already too large when it contains:

- header, filters, cards, chart, and table in one file;
- local constants plus formatters plus JSX sections;
- more than one data surface, such as KPIs and recent rows;
- loading/error/empty states embedded inline in a large happy path;
- table row rendering mixed with query orchestration;
- several `map()` blocks for unrelated UI sections;
- repeated labels, enum mappings, or badge variants.

Recommended extraction order:

1. Move constants and labels to `<domain>.constants.ts`.
2. Move pure formatting to `utils/<domain>-format.ts`.
3. Extract loading/error/empty states.
4. Extract filters/forms.
5. Extract repeated cards/rows/badges.
6. Extract composite sections such as chart panels, tables, lists, and breakdowns.
7. Leave the page as a readable top-down composition.

## React Implementation Rules

- Use function components and named exports for reusable components.
- Use default exports for page entry points when the route imports a page directly.
- Type props explicitly when they are exported or non-trivial.
- Avoid one-letter variable names.
- Keep effects for synchronization with external systems only. Do not use `useEffect` for values that can be derived during render.
- Memoize expensive derived data, context values, strategies, and stable configuration objects.
- Do not prematurely memoize every component or callback.
- Avoid deeply nested ternaries in JSX; extract named helpers or components.
- Prefer composition over large configuration props.
- Keep conditional rendering close to the UI state it represents.

## Data Flow Pattern

The default flow is:

```txt
route -> src/pages/<feature> page -> provider/query hooks -> feature ui/components -> services/utils/constants
```

Imports should generally point inward within the feature:

- `src/pages/<feature>/` may import `features/<domain>/components`, `ui`, `hooks`, `.queries.ts`, `utils`, and constants.
- `ui/` may import `components/`, `hooks/`, `utils/`, constants.
- `components/` may import constants, utils, and feature context hooks.
- `services/` and `utils/` must not import React components, pages, or query hooks.
- `.api.ts` must not import `.queries.ts` or UI.
- `.queries.ts` may import `.api.ts`, query libraries, and types.

Feature code must not import from `src/pages/<feature>`. Pages are the top of the frontend composition tree.

Avoid circular feature imports. If two features need shared logic, move the shared piece to an appropriate shared location instead of importing through pages or UI.

## UI And Accessibility Baseline

Use the existing UI primitives first (`@zanadeal/ui` or app-local primitives already used nearby). Do not rebuild keyboard/focus behavior by hand when a primitive exists.

Baseline rules:

- Inputs/selects must have labels.
- Icon-only buttons need `aria-label`.
- Tables need meaningful headers.
- Loading states should use skeletons for content surfaces.
- Suspense fallbacks should use anatomy-matching skeletons.
- Error states must include a local retry or recovery action when possible.
- Empty states should explain what is empty and provide one useful next action when an action exists.
- Use `text-balance` for headings and `text-pretty` for explanatory copy.
- Use `tabular-nums` for metrics and money.
- Use `min-h-dvh`, not `h-screen`, for viewport layouts.
- Use existing color tokens and variants; avoid new raw color systems.
- Cards should frame actual repeated items, panels, modals, or tools. Do not nest cards inside cards.

## Filtering, Tables, And Dashboards

Operational admin screens should be dense, scannable, and predictable.

For dashboards:

- Keep filters in a dedicated component.
- Keep KPI cards reusable and data-driven only when it improves readability.
- Keep chart provider setup near the chart section but outside generic page clutter.
- Keep recent activity tables/lists in their own components.
- Keep generated-at/live status indicators separate from content sections.
- Use section-level boundaries when charts/tables can fail independently.

For tables:

- Define columns/row rendering outside the page when the table has more than a few columns.
- Use `truncate`, stable widths, or responsive layouts for long names.
- Put row actions in a dedicated component when there is more than one action.
- Do not put mutation logic directly inside each row unless the row owns that action completely.

For filters:

- Use URL search params if filters should survive refresh/share/back navigation.
- Use local page state if filters are temporary and specific to one dashboard session.
- Keep filter option arrays in constants or colocated option files.
- Avoid silently changing filter shape in components; normalize in helpers or page-level handlers.

## Route Search Params And Navigation

Use typed TanStack Router search params for state that belongs in the URL: filters, pagination, sort, selected tab, map/list mode, and search text that should survive refresh or be shareable.

Rules:

- Normalize search params at the route boundary.
- Pass normalized values to the page as a cohesive object or read them through route hooks in the page.
- Keep query keys aligned with normalized search params.
- Debounce high-frequency text input before writing to search params or querying.
- Do not use URL state for transient UI such as modal open state unless product explicitly needs deep links.

## File Naming

Use domain-prefixed names for feature components so imports and editor tabs stay clear.

Good:

- `src/pages/booking-stats/BookingStatsDashboardPage.tsx`
- `src/pages/booking-stats/BookingStatsPageSkeleton.tsx`
- `BookingStatsFilters.tsx`
- `BookingStatsKpiGrid.tsx`
- `HotelProvider.tsx`
- `RoomToolbar.tsx`
- `useHotelListParams.tsx`

Avoid vague names:

- `features/<domain>/pages/*`
- `Filters.tsx`
- `Card.tsx`
- `Table.tsx`
- `utils.ts` when the feature has multiple helper categories.

## Refactor Workflow

When refactoring React code without changing behavior:

1. Read the current file before editing; assume the user or formatter may have changed it.
2. Identify responsibilities and name the target components before moving code.
3. Extract constants/helpers first.
4. Move page entry points to `src/pages/<feature>/` if they are inside `features/<domain>/pages`.
5. Extract components one section at a time.
6. Add `Suspense`/`ErrorBoundary` around async page or section surfaces.
7. Add skeletons that mirror the final component anatomy.
8. Keep props boring and explicit.
9. Run targeted diagnostics on every touched file.
10. Run the nearest type-check/test command when practical.
11. If global checks fail from unrelated debt, state exactly whether touched files are clean.

Do not combine a broad visual redesign with an architecture refactor unless the user explicitly asks for both.

## Common Anti-Patterns

Avoid these:

- A page file containing all filters, KPIs, charts, tables, and helper functions.
- Page entry points inside `features/<domain>/pages` instead of `src/pages/<feature>`.
- Async page surfaces without `Suspense` and `ErrorBoundary`.
- Generic skeleton rectangles that do not match the final component anatomy.
- Query hooks embedded inside presentational components that could receive data as props.
- API calls directly from components instead of `.api.ts` plus `.queries.ts`.
- `useEffect` copying query results into `useState`.
- Manual query key arrays scattered across files.
- Feature components importing from another feature's page file.
- Business rules in JSX.
- Formatting money/dates inline across multiple components.
- One-off local enum labels repeated in multiple files.
- Large components with hidden responsibilities because extraction was deferred.

## Implementation Checklist

Before editing:

- Confirm the app: `apps/web` or `apps/admin`.
- Inspect neighboring feature patterns.
- Decide where each new file belongs in the feature structure.
- Put page entry points in `src/pages/<feature>/`.

While editing:

- Keep route files thin.
- Keep pages as orchestrators.
- Put API wrappers in `.api.ts`.
- Put Query hooks and key factories in `.queries.ts`.
- Add query option factories when queries are shared by hooks, loaders, prefetch, or suspense surfaces.
- Extract constants and pure formatters.
- Split UI into atomic components and composites.
- Wrap async surfaces with `Suspense` and `react-error-boundary`.
- Build skeletons that match the final component layout.
- Use existing UI primitives and design tokens.

Before finishing:

- Run diagnostics on touched files.
- Run targeted type-check/tests if feasible.
- Report any remaining failures as introduced vs pre-existing/out-of-scope.
- Mention the important files changed without overwhelming the user.

## Quality Bar

A finished frontend change should be understandable from file names alone. A reviewer should be able to open the page file, see a short top-down composition, then inspect only the component relevant to the behavior they care about.

If a future edit would require scrolling through a 300-line page to find a table cell, a filter select, or a KPI card, split sooner.