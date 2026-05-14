# CV Builder

A personal CV builder with a live PDF preview, multi-preset support, and manual save. Built for personal use, because good CV tools are either overpriced, overcomplicated, or both.

---

## The Problem

Maintaining a CV in Figma is tedious. Every update (a new job, a tweaked summary, a skill added) means repositioning elements, fixing alignment, and re-exporting. And when you need slightly different versions for different job applications, you're either juggling multiple Figma files or constantly undoing changes.

The good CV builders that exist either charge a subscription, lock you into a rigid template, or bury you in options you don't need. Many also show a preview that is only an approximation of the final PDF, rendered in HTML/CSS and converted at export time, which means fonts shift, spacing drifts, and what you see is not always what you get.

This is a purpose-built personal tool: one layout, one workflow, built for one person's preferences. The UI is kept intentionally simple and consistent throughout, using shadcn/ui components across the board so everything looks and behaves like it came from one hand.

---

## Features

### Editor

- **Two-panel layout**: form inputs on the left, live PDF preview on the right
- **True live PDF preview**: the preview is rendered by the same engine that produces the export (`@react-pdf/renderer`), not an HTML/CSS approximation that gets converted at download time; fonts, spacing, and layout are identical between preview and export
- **Save with visual feedback**: save status indicator shows when changes are unsaved or successfully saved
- **Keyboard shortcut**: `Cmd+S` / `Ctrl+S` to save
- **Zoom controls**: scale the PDF preview from 60% to 160%
- **PDF export**: download the CV as a PDF

### Presets

- Save and switch between multiple named CV versions (e.g. "Frontend jobs", "Internship", "General")
- Create presets from scratch or by duplicating an existing one
- Rename presets inline
- Mark a preset as default
- Delete presets with confirmation
- Unsaved-changes guard: prompts before switching away from a modified preset

### CV Sections

All sections can be toggled visible/hidden per preset and reordered via drag and drop:

| Section       | Fields                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Personal info | Name, title, email, phone, location, LinkedIn, GitHub, website, driver's license, date of birth, summary |
| Experience    | Company, role, location, start/end date, description, bullet points, tech stack                          |
| Education     | Institution, degree, location, start/end date, description, bullet points                                |
| Skills        | Grouped by category (e.g. Languages, Frameworks, Tools)                                                  |
| Projects      | Title, description, tech stack, link, bullet points                                                      |
| Languages     | Language name and proficiency level                                                                      |

### Drag and Drop

- Reorder sections within the Sidebar and Main groups
- Order persists per preset

### PDF Layout

A4 two-column layout:

- **Left sidebar**: contact info with icons, skills by category, languages
- **Right main area**: name and title at the top, followed by summary, education, experience, and projects

---

## Tech Stack

| Concern        | Choice                                 |
| -------------- | -------------------------------------- |
| Framework      | Next.js 16 (App Router) + TypeScript   |
| Styling        | Tailwind CSS v4 + shadcn/ui            |
| Forms          | react-hook-form + Zod                  |
| PDF            | @react-pdf/renderer                    |
| Drag and drop  | @dnd-kit/react                         |
| Database       | PostgreSQL (Neon)                      |
| ORM            | Prisma                                 |
| Server actions | Next.js Server Actions (no API routes) |

---

## Architecture

### State model

State lives in the editor page via plain `useState`. There are two CV copies in memory at all times:

- `activeCV`: the working copy the user is editing
- `previewCV`: the last-saved copy, which drives PDF re-renders

`isDirty` is derived by comparing the two with `JSON.stringify`. The PDF only re-renders when a save completes, not on every keystroke, so the preview stays stable while typing. A "Preview outdated" indicator appears when changes exist that haven't been saved yet.

### Persistence

All database operations go through Next.js Server Actions in `/lib/actions/`. Server Actions were chosen over API routes because a full REST layer would be overkill for a personal tool. Zod schemas in `lib/schemas.ts` are shared between the client (form validation) and server (action input validation), so the same rules apply in both places. Saves use Prisma transactions to upsert the CV and all its sections and items atomically.

### PDF generation

The PDF is built with `@react-pdf/renderer` using isolated components in `/components/pdf/`. These components use only PDF primitives (`View`, `Text`, `Link`) and are completely separate from the HTML editor UI. The preview panel renders the live PDF in an `iframe` via `PDFViewer`.

#### Reorder stability

When sections are reordered, the document key is derived from the section order so React fully remounts the PDF tree, avoiding a renderer bug where reordering would cause duplicate sections to appear.

### Scroll position preservation

When CV data changes and the PDF regenerates, the preview panel captures the current scroll anchor (page index and offset within that page) before the document remounts, then restores it once all pages finish rendering. This prevents the view from jumping back to the top on every save.

### Drag and drop

Sections are split into two independently sortable groups: Sidebar (Skills, Languages) and Main (Experience, Education, Projects). Each group uses `@dnd-kit/react` with a `useSortable` hook per item. The accordion for a section collapses during a drag to prevent visual jitter from height changes mid-gesture.

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

- **Reorder items within sections**: drag and drop individual entries (e.g. swap two job positions) within a section, not just the sections themselves
- **Custom sections**: add freeform sections with a custom title for anything not covered by the built-in types
- **One-click translation**: translate the active CV from Dutch to English via the DeepL API, saved automatically as a new preset with a language suffix

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
npm install

# Configure environment
cp .env.example .env
# Add your DATABASE_URL to .env

# Push the schema to your database
npm run db:push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
DATABASE_URL=   # PostgreSQL connection string
```

### Useful Scripts

```bash
npm run dev         # Start dev server
npm run build       # Production build
npm run db:push     # Push Prisma schema changes to the database
npm run db:studio   # Open Prisma Studio (database browser)
```
