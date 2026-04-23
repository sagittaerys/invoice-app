# Invoice App

A fully responsive Invoice Management Application built with React and TypeScript, based on a Figma design spec. Supports full CRUD operations, draft/pending/paid status flows, light/dark mode, and persistent local storage.

---

## Live Demo

> _Deploy link goes here (Vercel / Netlify)_

## Repository

> _GitHub link goes here_

---

## Screenshots

| Light Mode | Dark Mode |
|---|---|
| Invoice list, filter dropdown, New Invoice button | Same layout with dark palette |
| Slide-in form with Bill From / Bill To / Item List | Form overlaid on dark background |
| Detail view with status bar and action buttons | Detail view in dark mode |

---

## Setup Instructions

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** v8 or higher

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd invoice-app

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Other Scripts

```bash
pnpm build      # Type-check and build for production → ./dist
pnpm preview    # Preview the production build locally
```

### Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or drag the `dist/` folder into the Vercel dashboard after running `pnpm build`.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Router DOM | 7 | Client-side routing |
| date-fns | 4 | Date formatting & arithmetic |
| uuid | 14 | Unique ID generation |
| pnpm | 10 | Package manager |

---

## Architecture

### Folder Structure

```
src/
├── components/
│   ├── DeleteModal.tsx      # Accessible confirmation modal
│   ├── FilterDropdown.tsx   # Status filter with checkbox UI
│   ├── InvoiceForm.tsx      # Create / Edit form (slide-in panel)
│   ├── Sidebar.tsx          # Fixed sidebar (desktop) / top bar (mobile)
│   └── StatusBadge.tsx      # Paid / Pending / Draft badge
│
├── contexts/
│   ├── InvoiceContext.tsx   # Global invoice state + localStorage sync
│   └── ThemeContext.tsx     # Light / dark mode + localStorage sync
│
├── data/
│   └── sampleInvoices.ts   # 7 seed invoices (pre-loaded on first visit)
│
├── pages/
│   ├── InvoiceListPage.tsx  # "/" — list, filter, new invoice
│   └── InvoiceDetailPage.tsx# "/invoice/:id" — view, edit, delete, mark paid
│
├── types/
│   └── invoice.ts           # All TypeScript interfaces and types
│
├── utils/
│   └── invoice.ts           # formatCurrency, formatDate, createInvoice, etc.
│
├── App.tsx                  # Router + provider composition
├── main.tsx                 # React entry point
└── index.css                # CSS custom properties (design tokens) + global styles
```

### Data Flow

```
localStorage
     │
     ▼
InvoiceContext (global state)
     │
     ├── InvoiceListPage
     │       ├── FilterDropdown
     │       ├── InvoiceForm (slide-in)
     │       └── Invoice list items → navigate to detail
     │
     └── InvoiceDetailPage
             ├── StatusBadge
             ├── InvoiceForm (slide-in, edit mode)
             └── DeleteModal
```

State lives entirely in React Context. Every mutation (add, update, delete, mark paid) syncs to `localStorage` via a `useEffect` in `InvoiceContext`, so all data survives page refresh.

### Routing

| Path | Component | Description |
|---|---|---|
| `/` | `InvoiceListPage` | All invoices, filter, create |
| `/invoice/:id` | `InvoiceDetailPage` | Single invoice view, edit, delete |

### Theme System

The theme is stored as `data-theme="light"` or `data-theme="dark"` on `<html>`. All colours are CSS custom properties scoped to `:root` (light) and `[data-theme='dark']`. Toggling the attribute causes an instant cascade — no JS class toggling on individual elements. The preference is persisted in `localStorage` under the key `invoice-theme`.

---

## Feature Breakdown

### CRUD

- **Create** — "New Invoice" opens a slide-in form panel. Users fill in sender address, client details, payment terms, project description, and line items, then save as Draft or Send (Pending).
- **Read** — Invoice list shows ID, due date, client name, amount, and status. Clicking a row navigates to the full detail view.
- **Update** — "Edit" on the detail page opens the same form pre-populated. Saving writes the updated invoice back to state and localStorage.
- **Delete** — "Delete" triggers a confirmation modal. Confirming removes the invoice and redirects to the list.

### Status Flow

```
Draft ──► Pending ──► Paid
  │                    │
  └──► (Edit allowed)  └──► (No further changes)
```

- Draft invoices can be edited and sent.
- Pending invoices can be marked as Paid.
- Paid invoices are read-only (Edit button is hidden).

### Form Validation

Validation runs on submit for Pending/Paid saves (Draft saves skip validation intentionally). Invalid fields get a red border and an inline error message. A summary at the bottom of the form lists all problems. Validated fields include:

- Client name (required)
- Client email (required + valid format)
- Project description (required)
- All address fields — street, city, post code, country (required for both sender and client)
- Item list — must have at least one item; each item needs a name, quantity > 0, price ≥ 0

### Filtering

The filter dropdown uses a checkbox metaphor (one active at a time). Selecting a status immediately filters the list. Selecting "All" shows everything. An empty state illustration is shown when no invoices match.

### Persistence

Data is stored in `localStorage` under two keys:

| Key | Contents |
|---|---|
| `invoice-app-data` | Array of all invoice objects |
| `invoice-theme` | `"light"` or `"dark"` |

On first load, if no data exists, 7 sample invoices are seeded automatically.

---

## Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile (< 768px) | Top navigation bar, stacked invoice cards, bottom action bar on detail page |
| Tablet (768px–1023px) | Left sidebar appears, single-column content area |
| Desktop (≥ 1024px) | Full sidebar, wide invoice list with inline columns, slide-in form |

The form panel slides in from the left at `min(616px, 100vw)` with a semi-transparent backdrop covering the rest of the screen.

---

## Accessibility

- Semantic HTML throughout — `<main>`, `<header>`, `<aside>`, `<nav>`, `<ul>`, `<li>`, `<address>`, `<fieldset>`, `<legend>`
- All form fields have explicit `<label>` associations via `htmlFor` / `id`
- All icon-only buttons have `aria-label`
- The delete modal traps focus: Tab and Shift+Tab cycle only within the modal; ESC closes it; clicking the backdrop closes it
- The filter dropdown has `role="listbox"` and `aria-expanded` on the trigger
- Invoice list items use `aria-label` with the invoice ID and client name for screen reader context
- Status badges use `aria-hidden` on the decorative dot
- Color contrast meets WCAG AA in both light and dark themes

---

## Trade-offs & Decisions

**No backend / API** — The brief allowed localStorage as a valid persistence strategy. For a production app with multiple users, a Node/Express or Next.js API with a database would be the right next step.

**CSS custom properties over Tailwind dark mode** — Tailwind's `dark:` variant requires the JIT compiler to know classes ahead of time. Using CSS variables scoped to `[data-theme='dark']` gives the same result with less markup noise and easier theming for a design-token-driven system like this one.

**Context over Redux / Zustand** — The data model is flat and simple (one array of invoices). React Context with `useReducer` or `useState` is sufficient and avoids an extra dependency.

**Form in a slide-in panel, not a separate route** — The Figma design shows the form overlaying the list, not replacing it. A route-based approach would lose the visual context of the list behind the form.

**uuid for item IDs** — Invoice items need stable keys for React reconciliation during editing. Random UUIDs are simpler than maintaining a counter and safe for a localStorage-only app.

---

## Potential Improvements

- [ ] Add a backend (Node/Express or Next.js API routes) with a real database (PostgreSQL / SQLite)
- [ ] PDF export for individual invoices
- [ ] Email sending integration (Resend / SendGrid)
- [ ] Pagination or infinite scroll for large invoice lists
- [ ] Search by client name or invoice ID
- [ ] Invoice number auto-increment (currently random alphanumeric)
- [ ] Unit tests with Vitest + React Testing Library
- [ ] E2E tests with Playwright covering the full CRUD flow
- [ ] Optimistic updates with error rollback
- [ ] Multi-user support with authentication (NextAuth / Clerk)

---
