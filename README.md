# Habit Cost Tracker 💰

A modern, interactive web application designed to help you track your spending habits and visualize the financial impact of your daily routines. Built with React and Firebase, this app empowers you to make informed decisions about your expenses.

## Overview

The Habit Cost Tracker is an adaptive expense management tool that allows users to:
- Track recurring expenses (habits) by category
- Visualize spending patterns with interactive charts
- Set and monitor budgets against your income
- Calculate the true cost of daily habits in yearly terms
- Export your habit data for analysis

## Features ✨

### Authentication & Security
- **Email/Password Registration**: Create an account with email and password
- **Google Login**: Quick authentication via Google
- **User Profiles**: Personalized profiles with income and budget information
- **Secure Storage**: All data stored securely in Firebase Firestore

### Habit Management
- **Add Habits**: Create habits with:
  - Habit name (e.g., Coffee, Gym membership, Netflix subscription)
  - Cost per occurrence
  - Frequency (daily, weekly, or monthly)
  - Category (Food, Transport, Subscriptions, Entertainment, Health, Shopping, Other)
  
- **Edit Habits**: Update habit details anytime
- **Delete Habits**: Remove habits you no longer want to track
- **Category Filtering**: View habits by specific categories

### Analytics & Visualization
- **Bar Charts**: View yearly cost per habit
- **Pie Charts**: See spending distribution by category
- **Cost Calculations**:
  - Monthly cost breakdown
  - Yearly cost projections
  - Cost as days of lost income

### Budget Management
- **Set Income**: Define your monthly or yearly income
- **Set Budget**: Optional spending budget limit
- **Budget Status Indicators**:
  - 🟢 Safe: Under 50% of budget
  - 🟡 Moderate: 50-80% of budget
  - 🟠 Warning: 80-100% of budget
  - 🔴 Exceeded: Over 100% of budget

### User Experience
- **Snowfall Animation**: Beautiful animated snowfall effect in the background
- **Dark Mode Support**: Comfortable viewing in low-light conditions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Export Data**: Download your habits as JSON for backup or analysis
- **Multi-Currency Support**: Track expenses in different currencies (₹, $, €, etc.)

## Tech Stack

- **Frontend Framework**: React 19.2
- **Build Tool**: Vite 8.0
- **Backend/Database**: Firebase (Authentication + Firestore)
- **Charting**: Recharts 3.8 for interactive visualizations
- **Animations**: React Snowfall 2.4
- **Package Manager**: npm
- **Linting**: ESLint with React hooks support

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Steps

1. **Clone/Download the Project**
```bash
cd habits
```

2. **Install Dependencies**
```bash
npm install
```

3. **Firebase Configuration**
The Firebase credentials are already configured in `src/firebase.js`. The app uses:
- Firebase Authentication
- Firebase Firestore Database

4. **Start Development Server**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

5. **Build for Production**
```bash
npm run build
```

6. **Preview Production Build**
```bash
npm run preview
```

## Project Structure

```
src/
├── App.jsx                    # Main app component with state management
├── App.css                    # Global styles
├── Auth.jsx                   # Authentication (login/signup)
├── Auth.css                   # Auth component styles
├── auth.js                    # Authentication logic and functions
├── firebase.js                # Firebase initialization
├── ProfileSetup.jsx           # Initial profile setup component
├── ProfileSetup.css           # Profile setup styles
├── Header.jsx                 # App header with user info
├── Footer.jsx                 # Footer component
├── Habitform.jsx              # Form to add new habits
├── Habitform.css              # Habit form styles
├── Habitlist.jsx              # List view of all habits
├── Habitlist.css              # Habit list styles
├── HabitChart.jsx             # Chart visualizations
├── SnowfallEffect.jsx         # Animated snowfall background
├── utils.js                   # Utility functions for calculations
├── index.css                  # Base CSS
└── main.jsx                   # React entry point
```

## Key Functions & Utilities

### Cost Calculations (utils.js)
- **getMonthlyCost()**: Calculate monthly cost for a habit
- **getYearlyCost()**: Calculate yearly cost projection
- **convertToMonthly()**: Normalize yearly income to monthly
- **checkBudgetStatus()**: Determine if budget is safe, warning, or exceeded
- **exportHabitsToJSON()**: Prepare habits data for export
- **downloadJSON()**: Download exported data as JSON file

## How to Use

### 1. Getting Started
- Sign up with email/password or Google
- Set up your profile with:
  - Currency preference
  - User type (Student/Working Professional)
  - Monthly or yearly income
  - Optional: Spending budget limit

### 2. Adding Habits
- Click "Add New Habit"
- Enter habit details:
  - Name (what you spend on)
  - Cost per occurrence (e.g., ₹100)
  - Frequency (how often: e.g., 2 times daily)
  - Type (daily/weekly/monthly)
  - Category (for organization)
- Click "Add Habit"

### 3. Analyzing Expenses
- View all your habits in a list
- See monthly and yearly costs
- Check how many "days of income" each habit costs you
- Filter by category to focus on specific spending areas

### 4. Charts & Insights
- **Bar Chart**: Shows yearly cost for each habit
- **Pie Chart**: Displays spending distribution by category
- Identify your biggest expenses at a glance

### 5. Budget Management
- Monitor total monthly spending against your budget
- Receive visual indicators if you're approaching or exceeding limits
- Adjust habits or budget as needed

### 6. Data Export
- Export all your habits to JSON format
- Useful for backup, analysis, or sharing

## Example Habits to Track

- ☕ Daily coffee: ₹100 × 2 times daily
- 🏋️ Gym membership: ₹500 × 1 monthly
- 🎬 Netflix subscription: ₹199 × 1 monthly
- 🚖 Daily commute: ₹50 × 2 times daily
- 📱 Phone recharge: ₹299 × 1 monthly
- 🍔 Weekend dining out: ₹800 × 2 weekly

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview the production build locally |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

Open source - Free to use and modify

## Future Enhancements

- 📊 Advanced analytics and monthly trends
- 💳 Integration with bank APIs for automatic expense tracking
- 🏆 Gamification and habit streak tracking
- 📱 Mobile app version
- 📧 Email reports and notifications
- 🤖 AI-powered spending recommendations
