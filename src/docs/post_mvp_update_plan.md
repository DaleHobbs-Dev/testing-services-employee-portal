# 🚀 Post‑MVP Update Plan

## 🛡 Scheduling Intelligence & Conflict Prevention

### **1. Proctor Conflict Detection**

Automatically warn or block scheduling when a proctor is already assigned to another session during the selected time window.

### **2. Workstation Availability Logic**

Ensure a workstation cannot be double-booked. Provide real-time availability indicators or disable unavailable workstations.

### **3. Room Capacity + Workstation Type Indicators**

Add metadata to rooms (capacity, ADA stations, high-performance machines) and validate that scheduling matches those constraints.

### **4. Automatic End-Time Calculation**

Use the selected test variant’s default duration to auto-fill the end time. Allow manual overrides for accommodations.

### **5. Student Appointment Duplication Warnings**

Detect if an examinee has already been scheduled for the same test family, variant, or same-day session.

---

## 🧩 User Experience Enhancements

### **6. Toast Notifications Instead of Alerts**

Replace browser alerts with custom Toast components for better UX and non-blocking confirmation.

### **7. Success Page / Confirmation Modal**

After creating an appointment, show a styled confirmation screen with the session details.

### **8. Editable Summary Before Submission**

Display a review panel where the user can confirm all selections before saving.

### **9. Autocomplete for Examinee Search**

Add live-search on email or last name to make finding examinees faster.

### **10. Recently Used Examinees**

Show a small list of the last 3–5 examinees scheduled for quick repeat appointments.

### **11. Better Time Selection UI**

Replace the native datetime picker with a custom hour + minute selector respecting 15-minute intervals.

---

## 🗂 Admin Tools & Dashboard Improvements

### **12. Enhanced Admin Dashboard Tiles**

Add icons, status badges, and hover interactions. Include quick actions (e.g. “+ New Appointment” on tile corners).
Add Heroicons or Lucide icons to visually differentiate each tile (e.g., Calendar, Users, Clipboard List, Cog, etc.).

Add hover animations such as scale-up, subtle tilt, or elevated shadows for tactile UI feedback.

Add a hover glow effect using your purple/mint brand colors.

Add color-coded tile borders or accents (e.g., exams = purple, employees = mint).

Add quick action buttons that appear on hover (e.g., “+ Add Exam”, “+ Add Employee”).

Add status badges showing counts (e.g., “Today: 5 Exams”, “Active Employees: 12”).

Add recent activity indicators, like “Last scheduled: 2 hours ago.”

Add tile footers with small helpful summaries.

Add interactive focus styles for keyboard navigation (WCAG enhancement).

Add ARIA labels and roles to improve screen reader clarity.

Add optional secondary text for context:

“Create new appointments”

“Manage proctors and staff”

“Configure available exams”

Add subtle micro-interactions with Framer Motion (fade/slide on page load).

Add a favorite/pin tile feature for admins who want to customize tile order.

Add responsive tile size scaling so that tiles grow more on larger screens.

Add card image/illustration headers using brand-colored abstract waves or icons.

Add an optional “last updated” timestamp for management tiles.

Add clickable whole-tile navigation (already implemented — good job!).

Add keyboard-accessible tile ordering for drag-and-drop in future versions.

### **13. Dashboard Analytics**

Display daily stats: exams scheduled, rooms booked, proctor load, workstation usage.

### **14. Filtering & Sorting on Management Pages**

Allow sorting employees by status, filtering exams by family/variant, and searching scheduling records.

### **15. Role-Based UI Enhancements**

Add visual indicators showing whether the user is an admin or proctor and hide irrelevant sections.

---

## ⭐ Data Model & Backend Enhancements

### **16. Central Duration Source of Truth**

Move all test durations to the database and ensure variants inherit duration defaults.

### **17. Exam Requirements Metadata**

Add structured rules (e.g. "PearsonVue requires locked start times" or "HiSET allows multiple variants per session").

### **18. Archive Historical Schedules**

Move past appointments automatically into an archive after a certain date.

---

## 🎨 Visual / Tailwind Improvements

### **19. Polished PageHeader System**

Add optional breadcrumb navigation, icons, and contextual actions.

### **20. Animated Card Hover States**

Make admin tiles feel more interactive using subtle transforms and shadows.

### **21. Custom Calendar or Timeline View**

Visualize the full testing day using a horizontal or vertical schedule timeline.

### **22. Dark/Light Mode Toggle**

Enable theme switching integrated with Tailwind CSS variables.

---

## 🔧 Code Quality & Structure

### **23. Extract Reusable Form Components**

Create `<ExamineeSelector />`, `<FamilySelector />`, `<VariantSelector />`, etc. for reusability.

### **24. Add Centralized Error Handling**

Wrap fetch logic in a reusable error helper and show UI errors gracefully.

### **25. Improve API Service Layer**

Add caching, automatic retries, and loading-state helpers.

### **26. Certifications and Permissions Service Enhancements**

Add management of certifications and permissions for users with role `tech`.

### **27. Add Employee Filtering**

Add a filter to the employee list to show only those with specific certifications.

### **28. KPI Components**

Add `<KpiCard />` UI components to display key performance indicators on the dashboard (with heroicons).
Add `<DashboardKpis />` grid layout for displaying multiple KPIs.
KPIs for exams, proctors, and employees for the current day.

### **29. Add Profile View**

Add a profile view for employees to see their profile information (details card, certifications, permissions, contact info, photo placeholder, etc.).

### **30. Add Darkmode Toggle to Navbar**

Add a theme toggle button to the navbar for quick switching between dark and light modes.

### **31. Make Modal Responsive and WCAG Compliant**

Ensure modals are responsive and accessible, with proper focus management and ARIA attributes.

### **32. Add ability to add more Notes to Exam Schedules**

Allow users to add multiple notes to an exam schedule for better context and communication.

## **Feature Name**

**Category:** (Scheduling / UX / Admin / Data / Visual / Code Quality)

**Description:**
Short explanation of what the feature is and why it matters.

**Benefits:**

- [ ] Benefit 1
- [ ] Benefit 2
- [ ] Benefit 3

**Dependencies:**

- [ ] Required data fields
- [ ] UI components affected
- [ ] API updates needed

**Priority:** High / Medium / Low

**Status:** Not Started / In Progress / Completed

**Notes:**
Additional details, references, or edge cases.
