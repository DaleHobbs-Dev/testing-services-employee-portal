# Changelog

All notable changes to the Testing Services Employee Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Planned for version 1.1.0.

### Added

- Frontend-specific Git workflow, versioning, changelog, and release guidance.
- System-notification management for administrators and technicians, including role targeting, editing, retiring, and deletion.
- Dashboard release notifications that remain visible to targeted employees until dismissed.
- Exam Management dashboard and landing area for test-related administration.
- Test Type Management for administrators, including creating, editing, and soft-deactivating test types.
- A technician-facing section for reactivating inactive test types.
- Calendar badge-color management for test types and employees, including hex-color validation, per-category uniqueness feedback, and color clearing.

### Changed

- Updated test-family mutations to use the backend `/test-families` `PATCH` and `DELETE` API contract.
- Limited test-type color changes to administrators while allowing administrators and technicians to manage employee calendar colors.

### Deprecated

### Removed

### Fixed

### Security

<!--
When releasing:
1. Move the applicable Unreleased entries into a versioned section such as:
   ## [1.1.0] - 2026-08-15
2. Remove empty headings from the released section.
3. Leave a fresh, empty Unreleased section at the top.
4. Add comparison links at the bottom once the repository has release tags, for example:
   [Unreleased]: https://github.com/DaleHobbs-Dev/testing-services-employee-portal/compare/v1.1.0...HEAD
   [1.1.0]: https://github.com/DaleHobbs-Dev/testing-services-employee-portal/compare/v1.0.0...v1.1.0

Write entries for users and integrators, not as raw commit messages. Call out API contract,
configuration, security, accessibility, browser behavior, and backend compatibility impacts when relevant.
-->
