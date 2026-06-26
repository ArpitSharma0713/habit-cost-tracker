# Habit Cost Tracker

A React and Firebase app for tracking recurring spending habits and understanding their real cost in money and days of income.

## Features

- Email/password and Google authentication
- Optional profile setup, so users can add habits before entering income or budget
- Habit add, edit, delete, and category filtering
- Monthly and yearly cost calculations
- Prominent "cost in days of income" insights when income is available
- Budget status indicators
- Bar, pie, and trend charts with Recharts
- Daily habit snapshots for progress tracking over time
- CSV export for Excel/Google Sheets and JSON export for backups
- Loading skeleton and offline warning states
- Consistent light/dark theme with shared design tokens
- Responsive layout for desktop and mobile

## Tech Stack

- React 19
- Vite
- Firebase Authentication
- Firebase Firestore
- Recharts
- React Snowfall

## Setup

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

## Production Build

```bash
npm run build
npm run preview
```

The build script uses Vite's runner config loader because the project path may contain spaces on Windows.

## Theme System

The dashboard uses app-level theme classes in `src/App.jsx`:

- `theme-light`
- `theme-dark`

Shared colors are defined as CSS variables in `src/App.css`, then reused by forms, habit cards, charts, profile setup, warnings, and buttons. This keeps bright and dark mode consistent across nested components instead of relying on one-off inline styles.

## Firebase Notes

The Firebase config is in `src/firebase.js`.

For Google Login on Vercel, add your production deployment domain in Firebase:

1. Open Firebase Console.
2. Go to Authentication -> Settings -> Authorized domains.
3. Add `habit-cost-tracker.vercel.app` or your active Vercel domain.

If this domain is missing, Google OAuth can fail in production even when it works locally.

## Firestore Collections

- `users`: profile settings such as currency, user type, income, income frequency, and budget.
- `habits`: recurring habit expenses owned by a user.
- `habitSnapshots`: one daily summary per user, updated after habit add/edit/delete actions.

## Key Utilities

- `getMonthlyCost()`: normalizes daily, weekly, and monthly habit frequency into monthly cost.
- `getYearlyCost()`: calculates yearly cost from monthly cost.
- `convertToMonthly()`: normalizes yearly income to monthly income.
- `checkBudgetStatus()`: returns safe, moderate, warning, or exceeded budget status.
- `exportHabitsToCSV()`: creates spreadsheet-friendly export data.
- `exportHabitsToJSON()`: creates backup-friendly export data.
- `downloadCSV()` and `downloadJSON()`: trigger browser downloads.

## Usage

1. Sign up or log in.
2. Add habits immediately, or add income first if you want days-of-income insights.
3. Toggle light/dark mode from the dashboard header.
4. Filter habits by category.
5. Review charts and the cost-in-days callouts.
6. Export to CSV for spreadsheets or JSON for backup.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production bundle |

## Future Enhancements

- Bank/import integrations
- Habit streaks and goal tracking
- Email reports
- AI-powered spending recommendations
