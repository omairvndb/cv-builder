# CV Builder

A personal CV builder with a live PDF preview, multi-preset support, and manual save. Built for personal use and as a learning project, because good CV tools are either paywalled, overcomplicated, or both.

---

## Motivation

Maintaining a CV in Figma, Word, or any other editing tool is tedious. Every update (a new job, a tweaked summary, a skill added) means repositioning elements, fixing alignment, and re-exporting. And when you need slightly different versions for different job applications, you're either juggling multiple files or constantly undoing changes.

The good CV builders that exist either charge a subscription, lock you into a rigid template, or bury you in options you don't need. Many also render the preview in HTML/CSS and convert to PDF at export, which is meticulous and very difficult to get right. In practice, fonts render slightly off, spacing shifts, and the preview stops matching reality. This app uses the same engine for both preview and export, making the live preview a guaranteed 1-to-1 representation of the file you download.

This is a purpose-built personal tool: one layout, one workflow, built for one person's preferences. The UI is kept intentionally simple and consistent throughout, using shadcn/ui components across the board so everything looks and behaves like it came from one hand.

---

## Features

### Editor

- **Two-panel layout**: form inputs on the left, live PDF preview on the right
- **True live PDF preview**: the preview is rendered by the same engine that produces the export (`@react-pdf/renderer`), not an HTML/CSS approximation that gets converted at download time; fonts, spacing, and layout are identical between preview and export
- **Save with visual feedback**: a save status indicator shows when changes are unsaved or successfully saved, and a small dot appears next to the personal info, each section title, and each individual item that has unsaved edits so you can see at a glance what's been touched
- **Keyboard shortcuts**:
  - `Cmd+S` / `Ctrl+S` to save
  - `Cmd+-` / `Ctrl+-` to zoom out, `Cmd+=` / `Ctrl+=` to zoom in, `Cmd+0` / `Ctrl+0` to reset zoom
- **Zoom controls**: scale the PDF preview from 60% to 160%
- **PDF export**: download the CV as a PDF
- **Add item dialog**: new items in any section are created through a dialog with two tabs: **Blank** to fill in a new item from scratch, or **Copy from presets** to multi-select existing items from another preset (matched on section type) and copy them into the current one; new IDs are generated for the copies so the source preset stays untouched
- **Inline bold**: wrap words in `**double asterisks**` inside the summary, any description (experience, education, projects), or any bullet to render them bold in the PDF, useful for emphasising a key technology or achievement mid-sentence

### Presets

- Save and switch between multiple named CV versions (e.g. "Frontend jobs", "Internship", "General")
- Create presets from scratch or by duplicating an existing one
- Rename presets inline
- Mark a preset as default
- Delete presets with confirmation
- Unsaved-changes guard: prompts before switching away from a modified preset

### CV Sections

Personal info is fixed at the top of the editor. All other sections can be toggled visible/hidden per preset and reordered via drag and drop, and their items can be reordered within each section:

| Section        | Fields                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Personal info  | Name, title, email, phone, location, LinkedIn, GitHub, website, driver's license, date of birth, summary |
| Experience     | Company, role, location, start/end date, description, bullet points, tech stack                          |
| Education      | Institution, degree, location, start/end date, description, bullet points                                |
| Skills         | Grouped by category (e.g. Languages, Frameworks, Tools)                                                  |
| Projects       | Title, description, tech stack, link, bullet points                                                      |
| Languages      | Language name and proficiency level                                                                      |
| Certifications | Name, issuer, date                                                                                       |
| References     | Name, role, company, email, phone, quote                                                                 |

### Drag and Drop

- Reorder sections within the Sidebar and Main groups
- Reorder items within a section (e.g. swap two job positions)
- Order persists per preset

### PDF Layout

A4 two-column layout:

- **Left sidebar**: contact info with icons, skills by category, languages, certifications, references
- **Right main area**: name and title at the top, followed by summary, education, experience, and projects

---

## Tech Stack

| Concern            | Choice                                 |
| ------------------ | -------------------------------------- |
| Framework          | Next.js 16 (App Router) + TypeScript   |
| Styling            | Tailwind CSS v4 + shadcn/ui            |
| Types / validation | Zod (type inference)                   |
| PDF                | @react-pdf/renderer                    |
| Drag and drop      | @dnd-kit/react                         |
| Database           | PostgreSQL (Neon)                      |
| ORM                | Prisma                                 |
| Server actions     | Next.js Server Actions (no API routes) |

---

## Architecture

### State model

State lives in the editor page via plain `useState`. There are two CV copies in memory at all times:

- `activeCV`: the working copy the user is editing
- `previewCV`: the last-saved copy, which drives PDF re-renders

`isDirty` is derived by comparing the two with `JSON.stringify`. The same kind of comparison runs at the section and item level so the editor can mark individual cards with a small dot indicator when they have unsaved edits. The PDF only re-renders when a save completes, not on every keystroke, so the preview stays stable while typing. A "Preview outdated" indicator appears when changes exist that haven't been saved yet.

### Persistence

All database operations go through Next.js Server Actions in `/lib/actions/`. Server Actions were chosen over API routes because a full REST layer would be overkill for a personal tool. Zod schemas in `lib/schemas.ts` are used for TypeScript type inference throughout the app. On the server, `saveCV` skips runtime Zod validation as the input is already typed via TypeScript, and relies on `toNullable()` to convert optional fields to `null` for Prisma. Saves use Prisma transactions to upsert the CV and all its sections and items atomically.

### PDF generation

There are two completely separate React component trees for the CV. The editor uses regular HTML with Tailwind and shadcn. The PDF lives in `/components/pdf/` and uses only `@react-pdf/renderer` primitives (`View`, `Text`, `Link`). The two sides never reference each other; they just share the same `CV` data shape.

Two libraries cooperate to put the PDF on screen:

- **`@react-pdf/renderer`** turns the PDF component tree into a real PDF file in memory.
- **`react-pdf`** takes that file and displays it page by page in the preview panel, with scrolling and zoom.

This split is what makes the preview a 1:1 match with the downloaded file: the same `@react-pdf/renderer` output drives both the on-screen pages and the download button, so the fonts, spacing, wrapping, and page breaks are guaranteed identical. Every time the saved CV changes, the PDF is regenerated and the pages repaint.

The more obvious alternative is `@react-pdf/renderer`'s built-in `PDFViewer`, which drops the PDF into an iframe. It's simpler to wire up, but anything custom around the pages, zoom controls, per-page scroll preservation, custom toolbars, is awkward when the document lives behind an iframe boundary.

#### Reorder stability

When sections or items are reordered, the document key is derived from an order signature that encodes both, so React fully remounts the PDF tree on any reorder, avoiding a renderer bug where reordering would cause duplicate sections to appear.

### Scroll position preservation

When CV data changes and the PDF regenerates, the preview panel captures the current scroll anchor (page index and offset within that page) before the document remounts, then restores it once all pages finish rendering. This prevents the view from jumping back to the top on every save.

### Drag and drop

Sections are split into two independently sortable groups: Sidebar (Skills, Languages, Certifications, References) and Main (Experience, Education, Projects). Each group uses `@dnd-kit/react` with a `useSortable` hook per item. The accordion for a section collapses during a drag to prevent visual jitter from height changes mid-gesture.

Items within a section reuse the same pattern via a small `SortableItems` wrapper, with a grab handle on the left of each item card. The handle is hidden when the section only contains a single item (nothing to reorder).

### Preset switching

Switching presets replaces both `activeCV` and `previewCV` entirely, resetting dirty state. If `isDirty` is true when the user tries to switch, a dialog prompts them to save or discard first. Preset renames and default toggles are applied optimistically: the UI updates immediately and the server action fires in the background.

---

## Project Structure

```
/app/editor/          - editor page (server component + client shell)
/components/editor/   - form panels, section editors, preset UI
/components/pdf/      - PDF document and section blocks
/lib/actions/         - server actions (saveCV, preset CRUD)
/lib/schemas.ts       - Zod schemas (shared client + server)
/prisma/schema.prisma - database schema
```

---

## Future Features

- **Click-to-jump from preview to editor**: clicking a section, item, or bullet in the PDF preview scrolls the editor panel to that section and opens its accordion, so editing the thing you're looking at takes one click instead of a hunt
- **Custom sections**: add freeform sections with a custom title for anything not covered by the built-in types
- **One-click translation**: translate the active CV from Dutch to English via the DeepL API, saved automatically as a new preset with a language suffix
- **Switch PDF layout**: pick from multiple visual templates per preset (the data shape stays the same, only the PDF tree under `/components/pdf/` swaps); today there is one template

---

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (e.g. [Neon](https://neon.tech) free tier)

### Setup

```bash
# Clone and install
git clone https://github.com/your-username/cv-builder.git
cd cv-builder
pnpm install

# Configure environment
cp .env.example .env
# Add your DATABASE_URL to .env

# Push the schema to your database
pnpm db:push

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
DATABASE_URL=   # PostgreSQL connection string
```

### Useful Scripts

```bash
pnpm dev            # Start dev server
pnpm build          # Production build
pnpm db:push        # Push Prisma schema changes to the database
pnpm db:studio      # Open Prisma Studio (database browser)
```
