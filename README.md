# Reassume — ATS-Friendly Resume Builder

A modern, production-ready resume builder with AI writing assistance, live preview, ATS auditing, and PDF/DOCX/JSON export. Fully static — runs on GitHub Pages.

**Live:** https://reassume.github.io/

## Features

- **Resume Editor** — Full form-based editor with all standard resume sections (personal info, summary, experience, education, skills, projects, certifications, languages, achievements)
- **Live Preview** — Real-time ATS-friendly resume preview with zoom controls
- **AI Writing Assistant** — Generate summaries, improve bullets, professionalize text, suggest keywords (mock mode built-in, configurable external endpoint)
- **ATS Audit** — Score your resume, detect missing fields, weak bullets, keyword gaps
- **Job Description Matching** — Paste a JD to compare keywords and get tailored suggestions
- **Export** — PDF (print-to-PDF), DOCX (browser-generated), JSON (structured schema)
- **Import** — JSON import with schema validation
- **Resume Management** — New, clone, load sample, reset
- **Dark/Light Mode** — System-aware theme toggle
- **Responsive** — Desktop split-panel, mobile tabbed layout

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- `docx` — browser-side Word document generation
- `file-saver` — file download utility
- `uuid` — unique ID generation

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build & Deploy

```bash
npm run build
```

### GitHub Pages Deployment

This project uses GitHub Actions for deployment. The workflow at `.github/workflows/deploy.yml` automatically builds and deploys on push to `main`.

**Base path:** Since this deploys to `https://reassume.github.io/` (organization/user site), the Vite `base` is set to `/`. If you deploy as a project site (e.g., `username.github.io/reassume`), change `base` in `vite.config.ts` to `/reassume/`.

**Setup:**
1. Go to repo Settings → Pages → Source: GitHub Actions
2. Push to `main` — the workflow handles the rest

## Architecture

### Static-First

The app works completely offline/static:
- Resume editing, preview, ATS audit — all client-side
- PDF export via `window.print()` with print CSS
- DOCX export via `docx` library in-browser
- JSON import/export from app state

### AI Integration

The AI system uses a provider abstraction (`src/services/aiProvider.ts`):

| Mode | Description |
|------|-------------|
| **Mock** (default) | Template-based responses, no network calls |
| **External** | Configurable endpoint + API key |

To use a real AI backend, call `configureExternalAI(endpoint, apiKey)` or build a settings UI. The app is fully functional without AI.

### Remote Save (Optional)

The remote save architecture (`src/services/remoteSave.ts`) supports optional background collection of user resumes to a GitHub repository.

**Why it's not automatic:** GitHub Pages is static-only. Secure writes require a server-side intermediary because:
- GitHub API tokens cannot be safely embedded in frontend code
- Browser-to-GitHub direct writes expose secrets

**Recommended approaches:**

| Method | Pros | Cons |
|--------|------|------|
| Webhook → Serverless (Netlify/Vercel/Lambda) | Secure, simple | Requires separate deployment |
| GitHub Actions `workflow_dispatch` | No extra infra | Requires PAT in frontend or OAuth |
| GitHub Issue submission | Simple, no infra | Resumes stored as issues |

**Privacy:** Remote save requires explicit user consent. Resumes contain PII and are never uploaded without permission.

## Data Model

Resume JSON schema (`src/types/resume.ts`):

```
schemaVersion, metadata, personalInfo, summary,
experience[], education[], skills[], projects[],
certifications[], languages[], achievements[],
internships[], volunteerExperience[], publications[],
awards[], customSections[], templateChoice
```

A sample resume is included at `src/data/sampleResume.ts`.

## Project Structure

```
src/
├── components/
│   ├── editors/         # Section editors (experience, education, etc.)
│   ├── Header.tsx       # Toolbar with export/import/theme
│   ├── EditorPanel.tsx  # Left panel with all form sections
│   ├── PreviewPanel.tsx # Right panel with live resume preview
│   ├── ATSPanel.tsx     # ATS audit and scoring
│   ├── AIPanel.tsx      # AI writing assistant
│   ├── MobileTabs.tsx   # Mobile navigation
│   └── FormControls.tsx # Reusable form primitives
├── context/
│   └── AppContext.tsx   # Global state management
├── services/
│   ├── aiProvider.ts    # AI abstraction (mock + external)
│   ├── atsAnalyzer.ts   # ATS scoring logic
│   ├── exportService.ts # PDF/DOCX/JSON export
│   ├── importValidator.ts # JSON import validation
│   └── remoteSave.ts    # Optional remote save architecture
├── data/
│   └── sampleResume.ts  # Sample data + empty state factory
├── types/
│   └── resume.ts        # TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css
```

## License

MIT
