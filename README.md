# Testing Services Scheduler – Employee Portal

A modern React-based scheduling and proctoring system designed for college and university testing centers. This application allows testing center staff to manage examinees, schedule exams, assign workstations and proctors, and oversee daily testing operations.

This project was developed as a capstone project for the client side portion of my Nashville Software School Software Development Bootcamp and models real-world scheduling constraints and workflows used in academic testing environments.

---

## Overview

The Testing Services Scheduler provides an interface for managing testing appointments across multiple locations, workstations, and test types. It supports role-based workflows and handles both standardized exams (CLEP, HiSET, Accuplacer, etc.) and faculty-created exams.

Key features include:

* Appointment scheduling with automatic duration calculation
* Multi-location and workstation assignment
* Multi-variant exam support (including sequential variants)
* Faculty exam creation with dynamically generated variants
* Role-based dashboards for testing staff and proctors
* Dark mode UI with Tailwind v4 theme system
* JSON Server–based REST API for rapid development

---

## Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS v4
* React Router v6
* Context API

**Backend (API)**

* JSON Server
* Node.js

**Other Tools**

* Heroicons
* LocalStorage (theme persistence)
* Custom Tailwind theme tokens

---

## Project Structure

This project consists of two separate repositories:

```
testing-services-employee-api      → JSON Server backend (mock REST API)
testing-services-employee-portal   → React frontend
```

Both must be running for the application to function correctly.

---

## Getting Started

### 1. Start the Backend Server

Open a terminal and navigate to:

```
testing-services-employee-api
```

Run:

```bash
npm install
npm run server
```

This starts the JSON Server backend, typically at:

```
http://localhost:8088
```

---

### 2. Start the Frontend Application

Open a second terminal and navigate to:

```
testing-services-employee-portal
```

Run:

```bash
npm install
npm run dev
```

This starts the Vite development server, typically at:

```
http://localhost:5173
```

Open that URL in your browser.

---

## Development Workflow

Both servers must be running simultaneously:

Terminal 1:

```
testing-services-employee-api
npm run server
```

Terminal 2:

```
testing-services-employee-portal
npm run dev
```

---

## Core Features

### Appointment Scheduling

* Create appointments for examinees
* Automatically calculates end time based on selected test variants
* Supports multi-variant exams in sequence
* Assigns proctors, locations, and workstations

### Faculty Exams

* Faculty exams do not require pre-existing variants
* Variants are dynamically generated based on entered exam information
* Supports custom duration and metadata

### Workstation & Location Support

* Multiple testing locations
* Workstation assignment per location
* Foundation in place for conflict detection logic

### Dashboard Views

* Staff dashboard for appointment management
* Proctor dashboard filtered by assigned exams
* Appointment detail view

### UI & Accessibility

* Fully responsive layout
* Custom Tailwind design system
* Dark mode toggle with persistence
* Semantic and accessible components

---

## Data Model Highlights

Core entities include:

* Examinees
* TestFamilies
* TestVariants
* ExamSchedules
* ExamScheduleVariants
* Employees
* Workstations
* Locations
* Notes

Exam durations are calculated from associated test variants, allowing accurate scheduling and conflict detection.

---

## Future Improvements

Planned enhancements include:

* Workstation conflict detection
* Calendar-based scheduling interface
* Reporting and analytics dashboard
* Real-time availability indicators
* Authentication and role-based permissions
* Migration to a full backend (Node / Express / SQL)

---

## Screenshots

(Add screenshots here if desired)

---

## Author

Dale Hobbs
Software Developer | Former Mathematics Instructor
Nashville Software School Student

GitHub: [https://github.com/DaleHobbs-Dev](https://github.com/DaleHobbs-Dev)
LinkedIn: [https://www.linkedin.com/in/curtis-dale-hobbs/](https://www.linkedin.com/in/curtis-dale-hobbs/)

---

## License

This project was created for educational and portfolio purposes.
