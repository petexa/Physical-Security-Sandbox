# Changelog

All notable changes to the Physical Security Sandbox project will be documented in this file.

## [1.0.17] - 2026-01-04

### Fixed
- **Issue #14:** Workflow data persistence - Workflows now correctly save changes to localStorage
- **Issue #15:** Status badge colors - INACTIVE statuses now display red instead of green
- **Issue #16:** Audit log filters - Fixed data type coercion bug in status code filters

### Added
- **Feature #17:** AI Transparency - Prompt Inspector for Natural Language Queries tab
- **Feature #18:** Extended Prompt Inspector to all 6 AI tabs (Event Summarization, Incident Reports, Investigation Builder, API Explainer, Log Analysis)

### Changed
- All AI components now include "Inspect Prompt" button to show LLM prompts and implementation examples
- PromptInspector component refactored to support 6 different prompt types
- AI.jsx updated to pass PACS data (doors, cardholders, cameras) to all child components

### Technical Details
- Modified 37 files across frontend codebase
- Added new components: PromptInspector.jsx, PromptInspector.css
- Updated all workflow step components to persist data correctly
- Fixed CSS specificity issues with status badges
- Fixed audit log filter type coercion

---

## [1.0.16] - 2026-01-04

### Fixed
- Navbar layout issues on desktop and mobile
- Frontend page (API Tester) layout restoration
- Backend Dashboard systems showing offline incorrectly
- Vendor tab bar showing wrong tabs
- CSS changes not reflecting (deployment path fix)
- Workflow steps showing no data (API response parsing)
- CSS variable naming inconsistencies site-wide

### Changed
- Standardized CSS variable naming convention across all files
- Improved responsive design for navbar
- Updated TabBar component to accept vendor-specific tabs

### Removed
- Compare page feature (orphaned files cleaned up)

---

## Earlier Versions

See KNOWN_ISSUES.md for detailed documentation of all fixes from v1.0.1 to v1.0.15.
