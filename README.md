# Habit

[![CI](https://github.com/ArpitSharma0713/habit-cost-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/ArpitSharma0713/habit-cost-tracker/actions/workflows/ci.yml)

Track the real cost of your habits: in money, in trends, and in days of your life.

## Features

- Email/password and Google authentication
- Optional profile setup, so users can add habits before entering income or budget
- Habit add, edit, delete, and category filtering
- Monthly and yearly cost calculations
- Prominent cost-in-days-of-income insights when income is available
- Budget status indicators
- Bar, pie, and monthly trend charts with Recharts
- Daily habit snapshots surfaced through trend and progress summary UI
- No-increase streak tracking to show consecutive snapshot intervals where spending did not go up
- CSV export for Excel/Google Sheets and JSON export for backups
- Loading skeleton, offline warning, per-action loading states, and toast notifications
- Consistent light/dark theme with shared design tokens
- Responsive layout for desktop and mobile

## Tech Stack

- React 19
- Vite
- Firebase Authentication
- Firebase Firestore
- Recharts
- React Snowfall
- Vitest
- GitHub Actions

## Setup

```bash
npm install
```

Create a local Firebase env file:

```bash
cp .env.example .env
```

Fill in:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Start the app:

```bash
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

## Quality Checks

```bash
npm run lint
npm run test
npm run build
```

The build script uses Vite's runner config loader because the project path may contain spaces on Windows.

## CI

GitHub Actions runs on every push to `main` and every pull request:

- `npm ci`
- `npm run lint`
- `npm run test`
- `npm run build`

## Theme System

The dashboard uses app-level theme classes in `src/App.jsx`:

- `theme-light`
- `theme-dark`

Shared colors are defined as CSS variables in `src/App.css`, then reused by forms, habit cards, charts, profile setup, warnings, toasts, and buttons.

## Firebase Notes

The Firebase config is loaded from `VITE_` environment variables in `src/firebase.js`. Keep real values in `.env`, which is intentionally ignored by Git.

For Google Login on Vercel, add your production deployment domain in Firebase:

1. Open Firebase Console.
2. Go to Authentication -> Settings -> Authorized domains.
3. Add `habit-cost-tracker.vercel.app` or your active Vercel domain.

If this domain is missing, Google OAuth can fail in production even when it works locally.

## Firestore Collections

- `users`: profile settings such as currency, user type, income, income frequency, and budget.
- `habits`: recurring habit expenses owned by a user.
- `habitSnapshots`: one daily summary per user, updated after habit add/edit/delete actions and displayed in trend/streak UI.

## Key Utilities

- `getMonthlyCost()`: normalizes daily, weekly, and monthly habit frequency into monthly cost.
- `getYearlyCost()`: calculates yearly cost from monthly cost.
- `convertToMonthly()`: normalizes yearly income to monthly income.
- `checkBudgetStatus()`: returns safe, moderate, warning, or exceeded budget status.
- `getHabitHistorySummary()`: calculates latest snapshot change and no-increase streak.
- `exportHabitsToCSV()`: creates spreadsheet-friendly export data.
- `exportHabitsToJSON()`: creates backup-friendly export data.
- `downloadCSV()` and `downloadJSON()`: trigger browser downloads.

## Usage

1. Sign up or log in.
2. Add habits immediately, or add income first if you want days-of-income insights.
3. Toggle light/dark mode from the dashboard header.
4. Filter habits by category.
5. Review charts, cost-in-days callouts, progress summary, and no-increase streak.
6. Export to CSV for spreadsheets or JSON for backup.

## Workflow

Use feature branches and conventional commit messages:

```bash
git checkout -b feat/habit-streaks
git commit -m "feat: add habit streak tracking"
```

This keeps `main` clean and makes the project easier to review.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit tests |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production bundle |

## Future Enhancements

- Weekly email summaries through Firebase Functions and a mail provider such as Nodemailer/SMTP, SendGrid, or Resend
- Bank/import integrations
- Habit streak goals and milestones
- AI-powered spending recommendations
