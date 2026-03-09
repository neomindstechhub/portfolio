# NeoMinds TechHub – Portfolio

Standalone portfolio site for NeoMinds TechHub projects. Same theme (orange #FF6B35, dark) as the main site. Deploy to **portfolio.neomindstechhub.com**.

## Setup

```bash
cd portfolio
npm install
```

## Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173` (or next free port).

## Build

```bash
npm run build
```

Output in `dist/`.

## Deploy (Vercel)

1. Push this folder to its own GitHub repo (or use Vercel’s “Import” from a subfolder).
2. In Vercel, add the domain **portfolio.neomindstechhub.com** to this project.
3. Vercel auto-detects Vite; `vercel.json` sets build command, output dir (`dist`), and SPA rewrites.

**Domain:** Add **portfolio.neomindstechhub.com** in Project Settings → Domains.

**Google Analytics:** Set `VITE_GA_MEASUREMENT_ID` (e.g. `G-XXXXXXXXXX`) in Project Settings → Environment Variables.

**Google Sheets (form):** Set `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID` for the Event Registration form. See **GOOGLE_SHEETS_SETUP.md**. Use `vercel dev` (not `npm run dev`) to test the Sheets API locally.

## Add or edit projects

- **Full guide**: See **HOW_TO_ADD_PROJECTS.md** in this folder.
- **Images**: Put files in `public/images/portfolio/` and use `imageUrl: "/images/portfolio/filename.jpg"` in `projects.ts`. Or use any full image URL.
- **Content**: Edit `src/data/projects.ts` — add or change objects in the `projects` array (id, slug, title, brand, shortDescription, imageUrl, tags; optionally videoUrl, longDescription, technologies, outcomes).

## Main site links

The main site (neominds-main) links here via:
- Nav: “Our Work”
- Footer: “Our Work” (Resources)
- Homepage: “See full portfolio” (below Live Projects)
- Services: “View Our Work”

URL is set in `neominds-main/src/lib/portfolioUrl.ts` (or `VITE_PORTFOLIO_URL` in env).
