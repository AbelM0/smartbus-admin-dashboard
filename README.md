# 🚌 SmartBus Admin Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![State Management](https://img.shields.io/badge/Zustand-5.0-orange?style=for-the-badge&logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![Localization](https://img.shields.io/badge/next--intl-Amharic%20%26%20English-green?style=for-the-badge)](https://next-intl-docs.vercel.app/)

An enterprise-grade, highly interactive, and beautifully styled administrative control center tailored for **Addis Ababa's metropolitan public transportation transit network (Ethiopia)**. 

This dashboard acts as a central command station for managing routes, live bus dispatch, passenger directory records, instant fare account refills, analytics reporting, and system-wide security governance.

---

## 🌟 Key Features

### 1. 📊 Centralized Dashboard & Live Fleet Operations
- **System Metrics Overview**: Real-time widgets tracking total commuters, ticket sales volume, daily net revenue, and operational route efficiency.
- **Live Fleet Map Tracking**: Dedicated, expandable live view mapping current vehicle coordinates, status indicators, and alerts.
- **Financial Trends**: Responsive visual monthly charts displaying ticket sales trends using custom-configured **Recharts**.

### 2. 👥 Commuter Profile Directory
- **Transit Access Management**: View, filter, and monitor active and blocked commuter accounts for Addis Ababa's growing transit base.
- **Demographics Filters**: Instantly segment users by student accounts, senior citizens, or status.
- **Instant Account Refills**: Direct administrative balance top-up system executing account refills on the fly.
- **Data Portability**: Full support to export filtered commuter lists directly to CSV format.

### 3. 🛣️ Dynamic Route & Corridor Control
- **Addis Ababa Corridor Management**: Overview of active routes detailing distance, duration, terminal stops, and active pricing.
- **Corridor Search & Advanced Filtering**: Filter specifically by Departure and Destination landmarks (e.g. *Megenagna* to *Bole*).
- **Interactive Forms**: Modular route creator allowing operations directors to inject new transit corridors seamlessly.

### 4. 🚏 Live Trips & Dispatch Scheduling
- **Operational Oversight**: Live logs representing trip progress status (*Scheduled*, *In Progress*, *Completed*, or *Cancelled*).
- **Searchable Dispatch**: Filter bus ID or route paths instantly to check delay durations.

### 5. 🛡️ Role-Based Access Control (RBAC) & Governance
- **Security Matrix**: Multi-level authority permissions configured for three major roles: *Super Admin*, *Admin*, and *Support*.
- **Admin Assignment**: Dynamically appoint administrative roles, check assigned staff lists, and update privileges.
- **Audit Trails**: Security logs documenting actor details, action targets, timestamp data, and IP addresses to maintain absolute transparency.

### 6. 🌐 Localization & Accessibility (English & Amharic)
- **Local Language Support**: Full internationalization for **Amharic (አማርኛ - am)** and **English (en)** using `next-intl`.
- **Global Provider Context**: Smooth, localized page layout restructuring with text translations and dynamic labels.

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.2 (App Router)** | Hybrid static & server rendering, file-based routing, SEO optimization |
| **Language** | **TypeScript 5.x** | Static type safety and structured models |
| **Styling** | **Tailwind CSS v4 & PostCSS** | High-performance styling utility system with CSS variables |
| **UI Primitives** | **Shadcn UI & Radix UI** | Unstyled, accessible, fully customizable UI components |
| **State Management** | **Zustand 5.0** | Light, lightning-fast global client state (Auth & Sidebar) |
| **Data Fetching** | **TanStack React Query & Axios** | Declarative caching, queries, mutations, and async network operations |
| **Charts** | **Recharts 3.8** | Smooth SVG-based data analytics and financial trends |
| **Localization** | **next-intl 4.8** | Full routing-based English & Amharic i18n support |
| **Authentication** | **HTTP Cookies & Bearer Tokens** | Automated token storage with robust refresh-token interceptors |

---

## 📂 Project Structure

```text
smartbus-admin-dashboard/
├── api/                  # API endpoints and direct server-fetch methods
├── app/                  # Next.js App Router root directory
│   └── [locale]/         # i18n localization routing wrapper
│       ├── _components/  # Layout and page-specific sub-components
│       ├── analytics/    # Fleet performance & reporting page
│       ├── audit-logs/   # Admin activity logging module
│       ├── login/        # Protected admin authentication portal
│       ├── permissions/  # Security matrix & RBAC dashboard
│       ├── routes/       # Route corridor control desk
│       ├── trips/        # Live trips and scheduling board
│       ├── users/        # Commuter profile management and refill station
│       ├── layout.tsx    # Page wrapper injector with fonts & analytics
│       └── page.tsx      # Main dashboard metric grid
├── components/           # Reusable global dashboard layouts
│   ├── ui/               # Modular Shadcn UI structural primitives
│   ├── LanguageSwitcher.tsx
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   └── providers.tsx     # React Query, Next-Themes, & i18n wrapper
├── cypress/              # End-to-end integration testing suite
│   └── e2e/              # E2E test scripts (auth, trips, users, routes)
├── hooks/                # Custom React hook logic
├── i18n/                 # Localization path configuration
├── lib/                  # Central utility libraries
│   ├── api-client.ts     # Axios custom instance with refresh JWT interceptor
│   ├── base-url.ts       # Backend endpoints pointer config
│   └── utils.ts          # Tailwind styling merge helpers
├── messages/             # i18n json language dictionary keys
│   ├── am.json           # Amharic localization values
│   └── en.json           # English localization values
├── stores/               # Zustand lightweight reactive store states
│   ├── sidebar.ts        # Sidebar open/collapsed state
│   └── user.ts           # Authentication session store
├── types/                # Core TypeScript API interface models
├── package.json          # Main package manager dependencies manifest
└── tsconfig.json         # Static type check settings
```

---

## 🚀 Getting Started

Follow these steps to set up, configure, and run the SmartBus Admin Dashboard locally.

### 📋 Prerequisites
- **Node.js** Version `18.20.x` or newer (Recommended: `20.x` or `22.x`)
- **Package Manager**: `npm` (packaged with Node.js) or `pnpm`

### 🔧 Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AbelM0/smartbus-admin-dashboard.git
   cd smartbus-admin-dashboard
   ```

2. **Install Project Dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Backend Configuration**:
   The dashboard communicates with a secure, hosted endpoint:
   `https://smart-bus-y0ky.onrender.com`
   This is configured by default in `lib/base-url.ts`, so no local backend server is required to test the front-end features.

---

## 💻 Development & Production Scripts

In the project root, you can execute the following NPM commands:

### Start the Development Server
```bash
npm run dev
# or
pnpm dev
```
Starts the Next.js application in hot-reloading development mode. Open [http://localhost:3000](http://localhost:3000) to view the live dashboard in your web browser.

### Build for Production
```bash
npm run build
# or
pnpm build
```
Lints files and compiles the static/server assets into highly optimized, production-ready build artifacts within the `.next/` directory.

### Start the Production Server
```bash
npm run start
# or
pnpm start
```
Starts the production server after executing the build command. Recommended for performance tests and live deployments.

### Code Linting
```bash
npm run lint
```
Performs static code analysis checking for syntax inconsistencies and Next.js/React standard code smells.

---

## 🔒 Session Security & Auth Middleware

The application features a secure, automated token-handling flow:

1. **State Store (`stores/user.ts`)**: Securely saves the current authenticated admin user model and stores JWTs.
2. **Persistent Cookies (`js-cookie`)**: Persists `accessToken` and `refreshToken` securely.
3. **Axios Interceptor (`lib/api-client.ts`)**:
   - Dynamically injects the `Bearer <accessToken>` header on all requests.
   - If an API returns `401 Unauthorized` (indicating the token expired), it silently makes a call to the `/api/v1/auth/refresh` endpoint using the `refreshToken`.
   - On a successful refresh, it saves the new tokens and replays the original request seamlessly without interrupting the user.
   - If refreshing fails, it clears all credentials and redirects the admin to `/[locale]/login`.

---

## 🧪 End-to-End (E2E) Testing (Cypress)

The dashboard is equipped with a complete E2E automation test suite covering essential workflows:
- **Authentication (`auth.cy.ts`)**: Validates admin login credentials security.
- **Commuter Directory (`users.cy.ts`)**: Validates creating accounts (including alphanumeric FID requirements), toggling activation states, and editing user details.
- **Fleet Dispatch (`trips.cy.ts`)**: Validates route/driver scheduling, AI dispatch helpers, and collision date adjustments.
- **Route Corridor Control (`routes.cy.ts`)**: Validates route wizard creation (steps 1–3) and full detail overrides (metadata, stops list, and segment pricing).

### Run All Tests Headlessly
```bash
npx cypress run
```

### Run a Specific Specification
```bash
npx cypress run --spec cypress/e2e/routes.cy.ts
```

### Run Cypress Interactive App
```bash
npx cypress open
```

---

## 🧪 Unit & Integration Testing (Jest)

The dashboard includes a full Jest and React Testing Library suite to validate lower-level utilities, logic, and state managers:
- **State Stores (`stores/user.test.ts`)**: Validates admin auth session states, login session setters, and sign-out cleanup flows.
- **Request Interceptors (`lib/api-client.test.ts`)**: Validates custom Axios handlers, automated Bearer token insertion, and dynamic JWT refresh triggers.
- **Validation Schemas (`lib/validation.test.ts`)**: Validates Ethiopian phone number patterns, secure password rules, and alphanumeric validation constraints.
- **Utility Methods (`lib/utils.test.ts`)**: Validates class name merging helper utilities.

### Run All Unit Tests
```bash
npm run test:run
```

### Run Unit Tests in Watch Mode
```bash
npm run test
```

---

## 👥 Contributors & Support

Developed for modern, intelligent metropolitan public transportation networks. 

For inquiries, support, or code updates, please contact the repository administrators or open an issue thread in this repository!
