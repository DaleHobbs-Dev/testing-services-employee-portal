# Changelog

All notable changes to the Testing Services Employee Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] - 2026-07-23

### Fixed

- Limited employee selections throughout calendar creation, editing, viewing, filtering, reassignment, and badge-color management to active employees.
- Limited test-family selections throughout calendar editing, viewing, filtering, and badge-color management to test families with `active` set to `true`.
- Prevented inactive employees embedded in existing calendar records from being reintroduced into calendar employee-filter options.
- Preserved the display of historical calendar entries while excluding inactive employees and test families from new list selections.

## [1.1.0] - 2026-07-23

### Added

- Frontend-specific Git workflow, versioning, changelog, and release guidance.
- System-notification management for administrators and technicians, including role targeting, editing, retiring, and deletion.
- Dashboard release notifications that remain visible to targeted employees until dismissed.
- Exam Management dashboard and landing area for test-related administration.
- Test Type Management for administrators, including creating, editing, and soft-deactivating test types.
- A technician-facing section for reactivating inactive test types.
- Calendar badge-color management for test types and employees, including hex-color validation, per-category uniqueness feedback, and color clearing.
- Calendar-card editing in the Edit Calendars view, including calendar renaming and employee reassignment for administrators and clerks.
- Granular management of existing calendar-day entries, with edit and delete controls for custom labels, test types, employee schedules, and colored notes.

### Changed

- Updated test-family mutations to use the backend `/test-families` `PATCH` and `DELETE` API contract.
- Limited test-type color changes to administrators while allowing administrators and technicians to manage employee calendar colors.
- Reworked the calendar day editor so existing custom labels, test types, employee schedules, and notes appear together directly below the testing-center closure control.
- Replaced the Testing Center Closed checkbox with a distinct toggle button and explanatory hover tooltip.
- Made end times optional for calendar test types and employee schedules; requests now send `null` when no end time is selected, and badges display only their start time without a trailing hyphen.
- Added frontend support for updating calendars, day labels, test-family badges, employee badges, and day notes through their `PATCH` endpoints, alongside granular delete flows.

### Fixed

- Prevented granular entry edits from submitting the enclosing day editor, ensuring Save Changes sends the intended `PATCH` request without reloading the calendar page.
- Marked modal close, cancellation, and deletion controls as non-submit buttons to prevent unintended form submissions.

### Security

- Limited the Delete Calendars control in the Edit Calendars view to employees with the administrator role.

<!--
When releasing:
1. Move the applicable Unreleased entries into a versioned section such as:
   ## [1.1.0] - 2026-08-15
2. Remove empty headings from the released section.
3. Leave a fresh, empty Unreleased section at the top.
4. Add comparison links at the bottom once the repository has release tags, for example:
   [Unreleased]: https://github.com/DaleHobbs-Dev/testing-services-employee-portal/compare/v1.1.1...HEAD
   [1.1.1]: https://github.com/DaleHobbs-Dev/testing-services-employee-portal/compare/v1.1.0...v1.1.1
   [1.1.0]: https://github.com/DaleHobbs-Dev/testing-services-employee-portal/compare/v1.0.0...v1.1.0

Write entries for users and integrators, not as raw commit messages. Call out API contract,
configuration, security, accessibility, browser behavior, and backend compatibility impacts when relevant.
-->
