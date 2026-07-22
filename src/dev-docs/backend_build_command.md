I am starting a new backend repo for my Testing Services Employee Portal.

Please help me scaffold and organize an Express + Prisma + PostgreSQL backend that will eventually replace the JSON Server backend used by my React client.

Frontend repo path for reference:
../testing-services-employee-portal

Important files to inspect first:
- ../testing-services-employee-portal/src/services/
- ../testing-services-employee-portal/src/docs/ERD.dbml
- ../testing-services-employee-portal/src/docs/post_mvp_update_plan.md
- ../testing-services-employee-portal/README.md

Goal:
Build a clean, organized backend foundation similar in organization quality to my Sentinel Matrix server repo, but using Express, Prisma, PostgreSQL, JWT auth, and bcrypt password hashing.

Suggested backend repo name:
testing-services-api

Tech stack:
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing
- dotenv
- cors
- morgan or a simple request logger
- zod or express-validator for request validation
- nodemon for development

Please scaffold the project with a clean structure like:

testing-services-api/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── env.js
│   │   └── prisma.js
│   ├── middleware/
│   │   ├── requireAuth.js
│   │   ├── requireRole.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── employees/
│   │   ├── certifications/
│   │   ├── permissions/
│   │   ├── employeeCertifications/
│   │   ├── employeePermissions/
│   │   ├── employeeSchedules/
│   │   ├── examinees/
│   │   ├── locations/
│   │   ├── workstations/
│   │   ├── testFamilies/
│   │   ├── testVariants/
│   │   ├── examSchedules/
│   │   ├── examScheduleVariants/
│   │   ├── notes/
│   │   ├── tickets/
│   │   └── calendars/
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── apiError.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md

For each module, prefer this structure:

modules/employees/
├── employee.routes.js
├── employee.controller.js
├── employee.service.js
└── employee.validation.js

First phase:
1. Initialize the project.
2. Install dependencies.
3. Configure Express app.
4. Configure Prisma.
5. Create initial Prisma schema based on the ERD.
6. Create auth foundation.
7. Create REST routes that match the existing frontend service functions as closely as possible.
8. Add seed data for roles, permissions, certifications, locations, employees, test families, test variants, and workstations.
9. Add a README with setup instructions.

Existing frontend service functions that need backend support:

Employees:
- GET /employees
- GET /employees?status=active
- GET /employees?status=inactive
- GET /employees/:employeeId
- GET /employees?email=:email
- POST /employees
- PUT /employees/:employeeId
- Later: GET /employees/:employeeId/schedule

Certifications:
- GET /certifications

Permissions:
- GET /permissions

Employee Certifications:
- GET /employeeCertifications
- GET active certifications by employeeId
- POST /employeeCertifications
- PUT /employeeCertifications/:id
Important: The current frontend expects employeeCertification records to have an id and active field, even though the ERD currently shows a composite key. Please adjust the Prisma model to include id, employeeId, certificationId, active, dateGranted/dateCertified if helpful, createdAt, updatedAt.

Employee Permissions:
- GET /employeePermissions
- GET active permissions by employeeId
- POST /employeePermissions
- PUT /employeePermissions/:id
Important: Same note as employeeCertifications. Use an id primary key and active field so the current frontend update flow works.

Employee Schedules:
- GET /employeeSchedules
- POST /employeeSchedules
- PUT /employeeSchedules/:scheduleId

Examinees:
- GET /examinees
- GET /examinees/:examineeId
- GET /examinees/email/:email
- POST /examinees

Locations:
- GET /locations
- GET /locations/:locationId
- POST /locations
- PUT /locations/:locationId

Workstations:
- GET /workstations
- GET /workstations/:workstationId

Test Families:
- GET /testFamilies
- GET /testFamilies/:familyId
- POST /testFamilies
- PUT /testFamilies/:familyId
Soft delete behavior:
- Do not hard delete test families by default.
- Mark active=false.
- For deleteTestFamilyWithVariants behavior, mark the family and related variants active=false.

Test Variants:
- GET /testVariants
- GET /testVariants/:variantId
- GET /testVariants?familyId=:familyId
- GET /testVariants?expand=family
- POST /testVariants
- PUT /testVariants/:variantId

Exam Schedules:
- GET /examSchedules
- GET /examSchedules/:scheduleId
- GET /examSchedules?date=YYYY-MM-DD
- POST /examSchedules
- PUT /examSchedules/:scheduleId
Important:
- The ERD has startTime and endTime timestamps.
- Date filtering should return schedules where startTime falls within that calendar date.
- Include related examinee, employee/proctor, location, workstation, test family, variants, and notes where useful.

Exam Schedule Variants:
- GET /examScheduleVariants
- GET /examScheduleVariants?examScheduleId=:scheduleId
- POST /examScheduleVariants
- PUT /examScheduleVariants/:id
- DELETE /examScheduleVariants/:id
Important:
- Keep sequenceOrder.
- Track status, actualStartTime, actualEndTime, score, and notes.

Notes:
- GET /notes
- GET /notes?examScheduleId=:scheduleId
- POST /notes
Future-friendly route:
- GET /examSchedules/:scheduleId/notes
- POST /examSchedules/:scheduleId/notes

Auth:
Create real authentication.
- POST /auth/register
- POST /auth/login
- GET /auth/me
- POST /auth/logout can be stateless/no-op for JWT
Employee auth should use:
- email
- passwordHash
- role
- status
Do not return passwordHash in API responses.
JWT payload should include employee id, email, role, and status.
Add requireAuth middleware.
Add requireRole middleware.
Protect write routes.
Admin-only routes should include employee management, exam management, certifications, permissions, employee permissions, and employee certifications.
Scheduler/admin/proctor routes should support appointment workflows.

Prisma schema:
Use the ERD in ../testing-services-employee-portal/src/docs/ERD.dbml as the source of truth, but make practical adjustments for Express/Prisma:
- Use PascalCase model names and map to table names if needed.
- Use createdAt and updatedAt consistently.
- Use enums where useful:
  - EmployeeRole: ADMIN, PROCTOR, SCHEDULER, CHECKIN, FRONTDESK, TECHNICIAN, CLERK
  - EmployeeStatus: ACTIVE, INACTIVE, RESTRICTED
  - ExamScheduleStatus: SCHEDULED, CHECKED_IN, IN_PROGRESS, COMPLETED, CANCELLED
  - ExamScheduleVariantStatus: SCHEDULED, IN_PROGRESS, COMPLETED, SKIPPED
  - TicketStatus: OPEN, PENDING, CLOSED, CANCELLED
  - TicketPriority: LOW, NORMAL, HIGH, URGENT
- If enum casing would make frontend conversion annoying, add mapping helpers so API responses use the frontend’s current lowercase/kebab strings where appropriate.

Core models from ERD:
- Employee
- Certification
- Permission
- EmployeeCertification
- EmployeePermission
- TestFamily
- TestVariant
- Workstation
- Examinee
- ExamSchedule
- ExamScheduleVariant
- Location
- EmployeeSchedule
- Note
- Irregularity
- Ticket
- TicketAssignee
- Calendar
- CalendarMonth
- Holiday
- CalendarClosure
- CalendarDayLabel
- CalendarTestFamilyBadge
- CalendarEmployeeBadge
- CalendarDayNote

Calendar features are planned but not fully built in the frontend yet. Still include Prisma models and organize empty/stub modules for:
- calendars
- calendarMonths
- holidays
- calendarClosures
- calendarDayLabels
- calendarTestFamilyBadges
- calendarEmployeeBadges
- calendarDayNotes

Ticket features are also planned but not fully built in the frontend yet. Still include Prisma models and organize empty/stub modules for:
- tickets
- ticketAssignees
- irregularities

For calendar and ticket modules, create the structure and basic list/create/read/update routes, but do not overbuild complex business logic yet.

Important business logic to prepare for:
- Proctor conflict detection
- Workstation double-booking prevention
- Examinee duplicate appointment warnings
- Automatic appointment end-time calculation from selected test variants
- Role-based access control
- Soft deletion for test families and variants
- Internal notes on exam schedules
- Ticket assignment tracking
- Calendar closures, holidays, employee badges, and test family badges

API response compatibility:
The React frontend currently expects camelCase field names like:
- employeeId
- testFamilyId
- testVariantId
- examScheduleId
- startTime
- endTime
- createdAt
Please keep API JSON camelCase.

Frontend migration awareness:
The frontend currently has apiSettings.js pointing at JSON Server on http://localhost:8088.
The new backend should probably run on http://localhost:8000 during development.
After the backend is ready, we will update the frontend to use VITE_API_BASE_URL.

Please proceed carefully:
1. Inspect the frontend service functions and ERD first.
2. Propose the backend organization and Prisma model adjustments.
3. Then scaffold files.
4. Then implement the first working vertical slice:
   - auth
   - employees
   - locations
   - testFamilies
   - testVariants
   - examinees
   - examSchedules
   - examScheduleVariants
   - notes
5. Add seed data.
6. Add clear setup docs.
7. Run lint/build or at least node syntax checks if available.
8. Do not delete unrelated files.
9. Keep the code organized and readable.