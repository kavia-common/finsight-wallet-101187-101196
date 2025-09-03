# Finsight Wallet - Frontend App

A React frontend for a fintech application enabling:
- User registration and login
- Financial account management
- Transactions viewing
- Insights dashboard with simple analytics

This app is frontend-only and integrates with a backend via REST APIs configured through environment variables. It includes placeholder API implementations for development without a backend.

## Getting Started

1. Install dependencies
   npm install

2. Configure environment variables
   - Create a .env file in the project root (same dir as package.json) based on .env.example
   - Set:
     - REACT_APP_API_BASE_URL: Backend base URL (e.g., http://localhost:4000)
     - REACT_APP_FEATURE_MOCK_API: "true" to use mock API in development

3. Start the app
   npm start

4. Run tests
   npm test

5. Build for production
   npm run build

## Features

- Auth:
  - Register: email, password, name
  - Login/Logout
  - Persisted session in localStorage

- Accounts:
  - List user accounts
  - Create/Edit/Delete account (name, type, currency, starting balance)

- Transactions:
  - List transactions by account
  - Add income/expense transactions
  - Filter by date and type

- Insights:
  - High-level KPIs (total balance, monthly spend, income vs expense)
  - Simple charts (pure CSS) and summaries

## Project Structure

src/
- App.js: App shell and routing
- index.js: Entry point
- index.css, App.css: Styles
- components/: Reusable UI and feature components
- pages/: Top-level pages for routes
- context/
  - AuthContext.js: Auth state and provider
- services/
  - apiClient.js: Axios client (with ENV config)
  - mockApi.js: Mock backend implementation for dev/demo
  - storage.js: Local storage helpers
- utils/
  - format.js: Format helpers (currency, dates)
- hooks/
  - useApi.js: Hook to wrap API calls with loading/error handling

## Environment Variables

Create .env file:
- REACT_APP_API_BASE_URL=https://your-backend.example.com
- REACT_APP_FEATURE_MOCK_API=true

Notes:
- Do not commit secrets; use .env locally.
- When REACT_APP_FEATURE_MOCK_API=true, the app uses mockApi.js and won’t call a real backend.

## API Integration

The app expects a REST API with endpoints:
- POST /auth/register
- POST /auth/login
- GET /accounts
- POST /accounts
- PUT /accounts/:id
- DELETE /accounts/:id
- GET /accounts/:id/transactions
- POST /accounts/:id/transactions
- DELETE /transactions/:id

These are abstracted via services/apiClient.js and services/mockApi.js. Swap by toggling REACT_APP_FEATURE_MOCK_API.

## Accessibility and UX

- Keyboard accessible navigation
- ARIA labels on forms and toggles
- Responsive design

## Notes

- This project is built on a lightweight template without heavy UI libs
- Charts are minimal and CSS-based for simplicity
- You can replace mock API with your real backend anytime

## License

MIT
