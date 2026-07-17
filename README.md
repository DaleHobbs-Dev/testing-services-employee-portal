# Testing Services Employee Portal

Testing Services Employee Portal is a scheduling and proctoring dashboard for academic testing centers. The goal is to help testing services staff manage appointments, examinees, exams, workstations, employee schedules, and daily proctoring workflows from one focused interface.

This repository is the **Vite + React client** for the project. It currently uses JSON Server during local development, with a planned migration to an Express, Prisma, and PostgreSQL backend for authentication, authorization, and production deployment.

---

## Tech Stack

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

---

## Related Repository

| Repo | Description |
| --- | --- |
| `testing-services-api` | Planned Express + Prisma + PostgreSQL backend for authentication, role-based permissions, and testing services data |

The backend repository has not been created yet. A fitting name for it would be **testing-services-api** because it leaves room for more than just employee workflows while still matching this client project.

---

## Current Project Structure

```txt
testing-services-employee-portal/
├── public/                     # Static public assets
├── src/
│   ├── assets/                 # Imported images and frontend assets
│   ├── components/
│   │   ├── appointments/       # Appointment forms, tables, and appointment pages
│   │   ├── dashboards/         # Employee dashboard cards and dashboard page
│   │   ├── employees/          # Employee list, forms, and details
│   │   ├── exams/              # Exam/test family management
│   │   ├── layout/             # Layout, navbar, and footer
│   │   ├── proctoring/         # Daily proctoring dashboard and filters
│   │   ├── schedules/          # Employee schedule management
│   │   ├── ui/                 # Reusable UI components
│   │   └── utils/              # Shared component utilities
│   ├── context/                # Current user context
│   ├── docs/                   # Planning docs and database notes
│   ├── hooks/                  # Shared React hooks
│   ├── pages/                  # Route-level layout pages
│   ├── routes/                 # React Router route definitions and guards
│   ├── services/               # API request helpers and resource services
│   ├── App.jsx                 # Main app component
│   ├── App.css
│   ├── index.css
│   └── main.jsx                # Vite/React entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── eslint.config.js
```

Planned backend structure once `testing-services-api` is created:

```txt
testing-services-api/
├── prisma/
│   ├── schema.prisma           # PostgreSQL data model
│   └── migrations/             # Database migrations
├── src/
│   ├── middleware/             # Auth and permission middleware
│   ├── routes/                 # Express route modules
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   └── server.js               # Express app entry point
├── package.json
└── .env.example
```

---

## Documentation

Project documentation currently lives in [`src/docs/`](src/docs/):

| File | Description |
| --- | --- |
| [ERD.dbml](src/docs/ERD.dbml) | Database schema planning for employees, examinees, exams, schedules, workstations, and permissions |
| [ERD.dbdiagram](src/docs/ERD.dbdiagram) | Database diagram source/export |
| [JSONServerSetup.md](src/docs/JSONServerSetup.md) | Notes for the current JSON Server development backend |
| [installTailwind.md](src/docs/installTailwind.md) | Tailwind setup notes |
| [post_mvp_update_plan.md](src/docs/post_mvp_update_plan.md) | Post-MVP ideas and improvement plan |

JSON Server is still useful for quick local development, but it is a temporary backend. The production path is planned around Express, Prisma, and PostgreSQL.

---

## MVP Goals

The planned MVP focuses on testing center employee workflows:

- **Authentication** — log in securely, store auth state, and protect dashboard routes
- **Authorization** — support role-based access for admins, proctors, schedulers, technicians, and front desk staff
- **Appointments** — create and manage testing appointments for examinees
- **Exam Management** — manage test families, variants, and faculty-created exams
- **Proctoring Dashboard** — review daily testing activity by date, examinee, and proctor
- **Employee Management** — create and update employee profiles, roles, certifications, and permissions
- **Employee Schedules** — manage employee working days and hours
- **Workstations & Locations** — assign testing sessions to available testing spaces

---

## Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- JSON Server data available locally while the Express backend is still planned
- Eventually, the planned `testing-services-api` running locally with PostgreSQL

### Steps

1. Clone the repository:

   ```bash
   git clone git@github.com:DaleHobbs-Dev/testing-services-employee-portal.git
   cd testing-services-employee-portal
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the temporary JSON Server API, if using the local mock database:

   ```bash
   npm run api
   ```

4. Start the Vite development server:

   ```bash
   npm run dev
   ```

5. Open the local Vite URL shown in the terminal. By default, this is usually:

   ```txt
   http://localhost:5173
   ```

The client currently expects the local API to be available at:

```txt
http://localhost:8088
```

When the Express + Prisma backend is added, this should move to a Vite environment variable:

```txt
VITE_API_BASE_URL=http://localhost:8000
```

---

## Available Scripts

```bash
npm run dev      # Start the Vite dev server
npm run build    # Build the production client
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
npm run api      # Start the temporary JSON Server API on port 8088
```

## Render Static Site Deployment

Use these settings if you configure the static site manually in Render:

```txt
Build Command: npm ci && npm run build
Publish Directory: dist
```

Set this environment variable on the Render static site:

```txt
VITE_API_BASE_URL=https://testing-services-server.onrender.com
```

This repo also includes `render.yaml` for Render Blueprint deployments. It configures the Vite build, publishes `dist`, rewrites all routes to `index.html` for React Router, and adds baseline security headers for the static site.

---

## Development Notes

- This project uses Vite, React, React Router, and Tailwind CSS.
- Active route work lives in `src/routes/`.
- Route-level wrapper pages live in `src/pages/`.
- Reusable feature code lives in `src/components/`, grouped by domain.
- Generic controls live in `src/components/ui/`.
- API calls are centralized in `src/services/`.
- Current auth is temporary and localStorage-based while the app still uses JSON Server.
- The intended production backend is Express + Prisma + PostgreSQL, with real authentication and role-based authorization.

---

## Contributor

| Name | GitHub |
| --- | --- |
| Dale Hobbs | [@DaleHobbs-Dev](https://github.com/DaleHobbs-Dev) |
