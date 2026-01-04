# Changelog

All notable changes to the Physical Security Sandbox will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Progress
- API/Backend consistency audit
- Additional testing and validation

---

## [1.0.16] - 2026-01-04

### Added - Backend Best Practices (PR#16)
- **HATEOAS API Discovery Endpoint** - GET /api
  - Self-documenting API with hypermedia links to all resources
  - Service version, timestamp, and documentation URL
  - Complete resource catalog with methods and authentication details
- **DTO Helper Functions** - Response optimization
  - 10 DTO transformation functions for cardholders, doors, access groups, cameras, events
  - Summary DTOs reduce payload size by 60-70% for list endpoints
  - Detail DTOs include hypermedia _links for resource navigation
- **Centralized Exception Handling Middleware**
  - APIException base class with consistent error response format
  - NotFoundException (404), UnauthorizedException (401), ValidationException (400)
  - ConflictException (409), InternalServerException (500)
  - All errors include timestamp, path, and helpful error messages

### Changed - Backend Best Practices (PR#16)
- server.js - Integrated errorHandler middleware as last middleware
- Auth middleware - Updated to throw UnauthorizedException for consistency
- Production deployment to /opt/physical-security-sandbox/mock-apis/
- Zero downtime deployment with PM2 restart

---

## [1.0.15] - 2026-01-04

### Added - Performance & Reliability (PR#15)
- **API Response Caching** - apiCache.js utility
  - localStorage-based caching with configurable TTL (5 minutes default)
  - Automatic cache expiration and cleanup
  - Key-based caching (url + method + body)
- **Retry Logic with Exponential Backoff**
  - Automatic retry on network failures
  - Configurable retry attempts and backoff timing
  - Integrated into API client
- **Offline Mode Indicator**
  - Yellow banner displays when network disconnects
  - Auto-dismisses when connection restored
  - Online/offline event listeners
- **Entity Comparison Page** - /compare
  - Side-by-side entity comparison with diff highlighting
  - Color-coded differences: green (added), red (removed), orange (changed)
  - Support for cardholders, doors, cameras, and other entities

### Changed - Performance & Reliability (PR#15)
- App.jsx - Added offline detection with useState and useEffect
- NavBar.jsx - Added Compare page navigation link

---

## [1.0.14] - 2026-01-04

### Added - Operational Polish & UX (PR#14)
- **EmptyState Component** (597B)
  - Reusable component for data-less views
  - Customizable emoji, title, message, and action button
  - Dark mode support with responsive design
- **SkeletonLoader Component** (2.9KB)
  - 6 skeleton loading types: Table, Card, Text, Stats, Detail, List
  - Shimmer animations for visual feedback
  - Theme-aware with CSS variables
- **HTTPS Security Warning Banner**
  - Sticky banner for non-secure connections
  - Excludes localhost and 127.0.0.1
  - Dismissible with localStorage persistence
- **PM2 Log Rotation Documentation**
  - Complete deployment guide (PM2-DEPLOYMENT.md)
  - Configuration instructions for 10MB max size, 7 day retention, compression

### Changed - Operational Polish & UX (PR#14)
- App.jsx - Added HTTPS warning detection with useState/useEffect
- styles/global.css - Added .https-warning styles (52 lines)

### Dependencies
- Added react-loading-skeleton ^3.5.0

---

## [1.0.12] - 2026-01-04

### Added - Workflows, Console, Dashboard, Docs & Settings (PR#12 - Items 7-12)
- **Guided Workflows** - /workflows (Item 7)
  - WorkflowsPage.jsx with 4 interactive tutorials
  - Employee Onboarding, Employee Termination, Access Group Management, Security Investigation
  - Step-by-step visualization with progress tracking
  - GuidedWorkflow.jsx component with reusable workflow engine

- **API Testing Console Enhancements** (Item 8)
  - ApiTester.jsx upgraded with syntax highlighting (react-syntax-highlighter)
  - Request history with localStorage persistence
  - Favorites functionality for frequent API calls
  - Method selector (GET/POST/PUT/DELETE/PATCH)
  - JSON body editor with formatting

- **Backend Dashboard with Vendor Split** (Item 9)
  - BackendDashboard.jsx - System health monitoring hub
  - System health cards for Gallagher and Milestone
  - Server stats panel with progress bars (CPU, RAM, storage)
  - Recent activity feed (last 10 events from both systems)
  - Quick stats cards with entity counts
  - BackendVendor.jsx - Vendor-specific tab pages
  - Restructured routes: /backend (dashboard), /backend/gallagher, /backend/milestone

- **API Documentation Wiki** - /docs (Item 10)
  - ApiDocs.jsx (17.4KB) - Comprehensive API reference
  - Searchable endpoints with live filtering (debounced 300ms)
  - Collapsible Gallagher and Milestone sections
  - "Try it" buttons that open API Console with pre-filled requests
  - Code snippets in curl, JavaScript, and Python with copy buttons
  - Sticky sidebar navigation with scroll tracking
  - 20+ documented endpoints with parameters, examples, and response schemas

- **Editable Entity Details** (Item 11)
  - Edit buttons on all entity detail views
  - Modal forms with pre-filled values and validation
  - PUT request integration with optimistic UI updates
  - Error handling with inline messages and retry capability
  - Editable fields: cardholders, doors, access groups, cameras, recording servers, bookmarks

- **Settings Page Enhancements** (Item 12)
  - Connection testing with "Test Connection" button
  - Real-time connection status panel (last sync, quality, error count)
  - Export settings to JSON file (all localStorage data)
  - Import settings from JSON file with preview and confirmation
  - Auto-test on page load with 30-second refresh interval

### Changed - Workflows, Console, Dashboard, Docs & Settings (PR#12)
- App.jsx - Added routes for /workflows, /api-console, /backend, /docs
- NavBar.jsx - Added navigation links for all new pages
- Backend.jsx - Refactored for vendor split routing
- All entity components - Updated with edit modal integration

### Dependencies
- Added react-syntax-highlighter ^16.1.0

**Note:** PR#13 was skipped in numbering sequence. Items 9-12 were implemented in PR#12.

---


### In Progress
- API/Backend consistency audit
- Additional testing and validation

---

## [1.0.11] - 2026-01-04

### Added
- **Audit Log Viewer** - Track all API calls during session
  - Simulated API call logging infrastructure (ready for implementation)
  - Error helper utilities for user-friendly error messages

- **Health Check Endpoint** - `/api/health`
  - System status and version information
  - Service health monitoring (Gallagher, Milestone, database)
  - Accurate storage usage calculation
  - Performance stats (CPU, memory, requests/min)

- **Cardholder Access Group Management**
  - POST `/api/cardholders/{id}/access-groups` - Add access groups with validation
  - DELETE `/api/cardholders/{id}/access-groups/{groupId}` - Remove access groups
  - Dynamic validation against actual groups from localStorage
  - Helpful error messages listing valid group names
  - Duplicate detection (409 error if group already assigned)

- **Error Handling System**
  - Created `/src/utils/errorHelper.js` with comprehensive error explanations
  - User-friendly messages for all HTTP status codes (400, 401, 403, 404, 409, 500, etc.)
  - Actionable suggestions for resolving errors
  - Retry logic helpers for transient failures
  - Error icons for visual clarity

### Changed
- **Settings Page Enhancements**
  - Backend URL and API key now editable
  - Configuration persisted to localStorage
  - Test Connection button with health check integration
  - Visual connection status with response time tracking
  - Replaced alert() with inline success messages for better UX

- **AI "How It Works" Section** - Enhanced with detailed workflow
  - Intent Classification with confidence scores
  - Entity Extraction (doors, cardholders, time ranges, event types)
  - Query Transformation to structured parameters
  - Data Filtering criteria display
  - Result Aggregation logic explanation
  - Results Formatting step
  - Total: 6 detailed processing steps (was 2 generic steps)

- **Empty States** - Improved across all data tables
  - Added helpful icons and titles
  - Context-specific messages
  - Better visual design with proper spacing

### Fixed
- **Bug #1: Duplicate Function** - Build error resolved
  - Removed duplicate `getStorageUsage` from dataManager.js
  - Now uses centralized storageHelper implementation
  - Fixed storage usage wrapper to return correct format

- **Bug #2: Version Display** - Settings page now shows correct version
  - SystemInfo.jsx now imports VERSION_INFO from config/version.js
  - Displays v1.0.11 and build date dynamically

- **Bug #3: Dark Mode Table Hover** - White text on white background
  - Added `[data-theme="dark"]` styles for clickable table rows
  - Text remains readable with proper color contrast
  - Uses `--color-surface-elevated` for hover state

- **Bug #4: Dark Mode Labs Cards** - Visibility issues resolved
  - Lab cards use proper dark mode CSS variables
  - Fixed hardcoded `#fafafa` background in locked state
  - All card text elements now visible in dark mode

- **Bug #5: Storage Calculation** - Health check endpoint
  - Fixed incorrect localStorage.length usage
  - Now calculates actual byte size (UTF-16 encoding)
  - Returns storage usage in MB with percentage

### Improved
- **Code Quality**
  - Addressed code review feedback
  - Replaced alert() dialogs with inline messages
  - Better accessibility with non-blocking notifications
  - Consistent error handling patterns

---

## [1.0.10] - 2026-01-04

### Added
- **Version Management System**
  - Created `/src/config/version.js` with centralized version information
  - Version number tracks PR number (v1.0.X where X = PR number)
  - Build number and version date tracking
  - Codename support ("Gallagher Guardian")

- **Storage Management System**
  - New `/src/utils/storageHelper.js` utility for localStorage quota management
  - Storage usage monitoring and validation
  - Storage capacity warnings (safe/warning/critical states)
  - Recommended max event count calculation
  - Visual storage meter in Settings with color-coded progress bar

### Changed
- **Event Generation Limits** - Reduced to prevent quota errors:
  - Light: 2,000 events (was 5,000)
  - Medium: 5,000 events (was 25,000)
  - Heavy: 7,000 events (was 50,000)
  - Extreme: 8,000 events max (was 100,000)

- **Settings Page** - Enhanced Data Management tab:
  - Added storage usage display with percentage and MB used
  - Added visual progress bar with color-coded status
  - Added storage warnings when approaching quota limits
  - Added recommended event count display

### Fixed
- **Bug #1: PATCH Method** - localStorage persistence implemented
  - PATCH requests now properly persist changes to cardholders, doors, and access groups
  - Loads existing entity, merges updates, saves back to localStorage
  - Returns 404 for non-existent entities
  - Added Gallagher-compliant href fields in responses

- **Bug #2: Events API Completeness** - Full data returned
  - Fixed filtering to avoid mutating original array
  - Added support for multiple parameter names (start_time/start_date, event_type/type, top/limit)
  - Implemented proper descending sort (newest first)
  - Added Gallagher-compliant pagination with totalResults and next href
  - Added comprehensive logging for debugging

- **Bug #3: LocalStorage Quota** - Quota management prevents errors
  - Event generator validates count before generating
  - Data manager enforces storage limits
  - Clear error messages when quota would be exceeded
  - Storage usage tracking prevents "quota exceeded" errors

- **Bug #4: AI Queries Show No Data** - Data loading fixed
  - Fixed localStorage key usage in AI.jsx (pacs-events not pacs_events)
  - Added console logging to track data loading
  - Added helpful error messages when no data is available
  - Improved query filtering and result counts

### Technical Improvements
- Added validation before event generation to prevent storage errors
- Improved error messages throughout the application
- Enhanced console logging for debugging
- Better handling of edge cases (empty data, missing entities)

---

## [1.0.9] - 2026-01-03

### Added
- **HowItWorksPanel Component** - Educational workflow visualization
  - Step-by-step process transparency for all AI features
  - Expandable/collapsible panel interface
  - Visual indicators for different step types (database, processing, output)
  - Query details with show/hide toggle
  - Duration tracking for each step
  - Integrated into Natural Language Query interface (ChatInterface)

### Identified
- Documented 6 critical bugs affecting platform usability
- Established bug priority order for systematic resolution
- Created comprehensive bug list with status, impact, and reproduction steps

---

## [1.0.0] - 2025-12-29

### Added - Initial Release

#### Phase 1: Foundation & Core Structure
- React 19 application with Vite build system
- React Router for client-side navigation
- Professional design system implementation
  - CSS custom properties (variables) for theming
  - Color palette: primary, secondary, success, warning, danger, info
  - Typography system with standardized font sizes
  - Spacing system (xs, sm, md, lg, xl, 2xl, 3xl)
  - Responsive breakpoints for desktop, iPad, mobile
  
- **Core Components**
  - `Button.jsx` - Reusable button with variants and sizes
  - `Card.jsx` - Content card component
  - `StatusBadge.jsx` - Status indicator badges
  - `NavBar.jsx` - Responsive navigation bar with hamburger menu
  - `Footer.jsx` - Application footer
  - `Layout.jsx` - Page layout wrapper

- **Pages**
  - `Home.jsx` - Professional landing page with feature cards
  - Consistent page structure and styling across all pages

#### Phase 2: API Testing & Backend Browser
- **Frontend Page** - API Testing Console
  - Interactive API tester for multiple platforms
  - Support for Gallagher, Milestone, Axis, ONVIF
  - Request/response viewer with syntax highlighting
  - Request history tracking
  - Endpoint browser with examples
  - Mock API client with realistic responses

- **Backend Page** - PACS Backend Browser
  - Event viewer with 10,000+ synthetic events
  - Advanced filtering capabilities:
    - Date range selection
    - Event type filtering
    - Location/door filtering
    - Cardholder filtering
    - Full-text search
  - Event statistics dashboard
  - CSV and JSON export functionality
  - Tabbed interface for different entity types:
    - Events
    - Cardholders
    - Doors
    - Controllers
    - Inputs/Outputs
    - Cameras
    - Access Groups

- **Data Generation**
  - Realistic event generator creating 10,000+ events
  - 6-month event history
  - 20 doors across multiple buildings
  - 50 cardholders with realistic data
  - 15 cameras with locations
  - Event types: access grants, denials, faults, alarms, system events
  - Business hour patterns and off-hours activity simulation

- **Components**
  - `EventViewer.jsx` - Event list with filtering
  - `DataTable.jsx` - Reusable data display component
  - `TabBar.jsx` - Tab navigation component
  - `ApiTester.jsx` - API testing interface
  - `RequestHistory.jsx` - API request history
  - `EndpointBrowser.jsx` - Browse available endpoints
  - `ResponseViewer.jsx` - Formatted response display

- **Utilities**
  - `eventGenerator.js` - Generate realistic security events
  - `eventQuery.js` - Advanced event filtering and querying
  - `apiClient.js` - Mock API client implementation
  - `initData.js` - Data initialization and management

#### Phase 3: Training & Labs
- **Training System**
  - 6 comprehensive training modules:
    1. Introduction to PACS
    2. Understanding Access Control Events
    3. VMS Integration Basics
    4. PACS API Integration
    5. Event Correlation & Analysis
    6. Security Best Practices
  - Interactive "Try It" sections in each module
  - Progress tracking with localStorage persistence
  - Code examples with syntax highlighting
  - Structured learning paths

- **Labs System**
  - 8 hands-on practice labs with validation
  - Progressive difficulty levels
  - Real-time solution feedback
  - Covers:
    - API integration
    - Event filtering
    - Data correlation
    - Security workflows
    - Advanced scenarios
  - Lab validation system with detailed feedback
  - Code editor interface
  - Copy-to-clipboard functionality

- **Components**
  - `TrainingModule.jsx` - Reusable training module component
  - `TryItSection.jsx` - Interactive practice sections
  - `ProgressTracker.jsx` - Visual progress tracking
  - `CodeExample.jsx` - Syntax-highlighted code display
  - `labValidator.js` - Solution validation utility

#### Phase 4: AI Tools & Final Polish
- **AI-Powered Security Operations**
  - **Natural Language Query Interface**
    - Ask questions about events in plain English
    - Pattern matching for common security queries
    - Contextual responses with supporting data
    - Example queries to get started
    - Real-time chat-style interface
  
  - **Event Summarization Tool**
    - Generate comprehensive security reports
    - Configurable date ranges (7 days to 6 months)
    - Event type filtering
    - Statistical analysis with visual charts
    - Key findings and security concerns
    - Actionable recommendations
    - JSON export functionality
  
  - **Incident Report Generator**
    - Create professional security incident reports
    - Multi-event selection and correlation
    - Timeline reconstruction
    - Evidence tracking (video, logs, interviews)
    - Recommended actions with priorities
    - Follow-up task management
    - Professional report formatting
  
  - **Investigation Builder**
    - AI-assisted investigation workflows
    - Automated related event detection
    - Step-by-step investigation procedures
    - Evidence collection checklist
    - Key questions to answer
    - Next actions with time priorities
    - Progress tracking
  
  - **API Response Explainer**
    - Educational tool for API responses
    - Support for Gallagher, Milestone, Axis, ONVIF APIs
    - Field-by-field explanations
    - Common use cases
    - Related endpoints
    - Example code snippets
    - Copy-to-clipboard functionality
  
  - **System Log Analyzer**
    - Identify security issues in logs
    - Security concern detection
    - System fault identification
    - Anomaly detection
    - Performance issue tracking
    - Prioritized recommendations
    - Log file upload support

- **AI Utilities**
  - `aiPrompts.js` - Comprehensive prompt template system
  - `mockAI.js` - Intelligent mock AI with realistic delays and responses
  - Context building for all AI features
  - Natural language parsing utilities

- **UI/UX Improvements**
  - Professional tabbed interface for AI tools
  - Consistent design system across all AI components
  - Loading states and animations
  - Touch-optimized for iPad (44px+ tap targets)
  - Responsive layouts for all screen sizes
  - Smooth transitions and interactions

- **iPad Optimization**
  - Touch-friendly controls throughout
  - Optimized layouts for portrait and landscape
  - Responsive tab navigation
  - Smooth scrolling performance
  - Safari compatibility verified

### Technical Stack
- React 19 with Vite
- React Router for navigation
- Lucide React for icons
- CSS Variables for theming
- localStorage for data persistence
- Mock API layer for training

### Infrastructure
- Git repository initialization
- README.md with setup instructions
- Package.json with all dependencies
- Vite configuration
- Project structure documentation
- ESLint configuration for code quality
- Hot module replacement for fast development
- Production build optimization

---

## Version History Summary

- **v1.0.10** - Bug Fixes & Version Management ✅
- **v1.0.9** - AI Workflow Transparency & Bug Tracking ✅
- **v1.0.0** - Initial Release (All Phases Complete) ✅

---

## Future Enhancements

### Planned for v1.1.0
- Real-time event simulation (live event feed)
- User authentication and roles
- Multi-language support
- Dark mode table selection visibility improvements
- API/Backend response alignment completion
- Real API integration options (Gallagher, Milestone)

### Planned for v1.2.0
- Collaborative features (multi-user investigations)
- Advanced reporting and analytics
- Compliance tracking (GDPR, HIPAA)
- Integration with ticketing systems

### Planned for v2.0.0
- Mobile app (iOS/Android)
- Predictive analytics
- Anomaly detection ML models
- Real-time collaboration tools

---

## Notes

- All versions are backward compatible with data stored in localStorage
- Mock AI responses can be replaced with real LLM integration without breaking changes
- Design system is extensible for theming and branding
- Component library follows React best practices
- Optimized for modern browsers (Chrome, Safari, Edge, Firefox)
- Special attention to iPad/touch device support

---

For questions or suggestions about this changelog, please open an issue on GitHub.
