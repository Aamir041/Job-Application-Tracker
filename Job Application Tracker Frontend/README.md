# Job Application Tracker

A dark, editorial-style job application tracker built with React + Vite.

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
job-tracker/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                        # React entry point
    ├── App.jsx                         # Root component — state orchestration & layout
    │
    ├── data/
    │   ├── constants.js                # STATUSES, PRIORITIES, STATUS_CONFIG, PRIORITY_COLORS
    │   └── initialJobs.js              # Seed data (6 sample applications)
    │
    ├── styles/
    │   └── shared.js                   # Reusable style objects: glassStyle, inputStyle, labelStyle
    │
    ├── hooks/
    │   ├── useGlobalStyles.js          # Injects @keyframes + global CSS on mount
    │   └── useJobs.js                  # CRUD state management for job list
    │
    └── components/
        ├── StatusBadge.jsx             # Pill badge with colored dot per status
        ├── PriorityDot.jsx             # Glowing dot indicator (high/medium/low)
        ├── LogoBubble.jsx              # Auto-colored company initial avatar
        ├── StatCard.jsx                # Metric card (total, active, interviews, offers)
        ├── PipelineBar.jsx             # Horizontal progress bars per status
        ├── JobTable.jsx                # Filterable/sortable job list table
        ├── Modal.jsx                   # Reusable overlay modal wrapper
        ├── JobForm.jsx                 # Add / edit form with validation
        └── JobDetailModal.jsx          # Detail view with inline status switcher
```

## Architecture Notes

- **State** lives entirely in `App.jsx` via the `useJobs` hook — components are stateless where possible.
- **Constants** are the single source of truth for status colors and labels.
- **Shared styles** prevent duplication of glass/input styles across components.
- No external UI library — all styling is inline with a consistent design token system.
