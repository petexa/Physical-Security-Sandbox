# Changelog

All notable changes to the Physical Security Sandbox project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2026-01-03

### Added

#### AI Tools Enhancements
- **HowItWorksPanel Component** - Educational workflow visualization for AI tools
  - Step-by-step process transparency for all AI features
  - Expandable/collapsible panel interface
  - Visual indicators for different step types (database, processing, output)
  - Query details with show/hide toggle
  - Duration tracking for each step
  - Integrated into Natural Language Query interface (ChatInterface)
  - Helps users understand how AI processes work behind the scenes

### Identified

#### Bug Tracking and Prioritization
- Identified and documented 6 critical bugs affecting platform usability:
  1. **LocalStorage Quota Exceeded** - Generating 23,000 events exceeds browser limit (5-10MB)
  2. **Natural Language Event Queries** - AI chat shows no results when events exist
  3. **API PATCH Method** - PATCH requests fail in API Testing Console
  4. **Event API Completeness** - API endpoint returns incomplete/filtered results
  5. **API/Backend Compliance** - API responses may not match Backend display
  6. **Dark Mode Table Selection** - Selected/hovered rows invisible (white on white)

#### Documentation
- Added comprehensive bug list with status, impact, and reproduction steps
- Documented proposed fixes for dark mode table selection issue
- Established bug priority order for systematic resolution

### Technical Debt
- Identified need for localStorage management and quota optimization
- Documented need for dark mode CSS variable system improvements
- API endpoint consistency requires audit and validation

---

## [2.0.0] - 2026-01-03

### Added - Phase 4: AI Tools & Final Polish

#### AI-Powered Security Operations
- **Natural Language Query Interface** - Ask questions about events in plain English
  - Pattern matching for common security queries
  - Contextual responses with supporting data
  - Example queries to get started
  - Real-time chat-style interface
  
- **Event Summarization Tool** - Generate comprehensive security reports
  - Configurable date ranges (7 days to 6 months)
  - Event type filtering
  - Statistical analysis with visual charts
  - Key findings and security concerns
  - Actionable recommendations
  - JSON export functionality
  
- **Incident Report Generator** - Create professional security incident reports
  - Multi-event selection and correlation
  - Timeline reconstruction
  - Evidence tracking (video, logs, interviews)
  - Recommended actions with priorities
  - Follow-up task management
  - Professional report formatting
  
- **Investigation Builder** - AI-assisted investigation workflows
  - Automated related event detection
  - Step-by-step investigation procedures
  - Evidence collection checklist
  - Key questions to answer
  - Next actions with time priorities
  - Progress tracking
  
- **API Response Explainer** - Educational tool for API responses
  - Support for Gallagher, Milestone, Axis, ONVIF APIs
  - Field-by-field explanations
  - Common use cases
  - Related endpoints
  - Example code snippets
  - Copy-to-clipboard functionality
  
- **System Log Analyzer** - Identify security issues in logs
  - Security concern detection
  - System fault identification
  - Anomaly detection
  - Performance issue tracking
  - Prioritized recommendations
  - Log file upload support

#### AI Utilities
- `aiPrompts.js` - Comprehensive prompt template system
- `mockAI.js` - Intelligent mock AI with realistic delays and responses
- Context building for all AI features
- Natural language parsing utilities

#### UI/UX Improvements
- Professional tabbed interface for AI tools
- Consistent design system across all AI components
- Loading states and animations
- Touch-optimized for iPad (44px+ tap targets)
- Responsive layouts for all screen sizes
- Smooth transitions and interactions

#### iPad Optimization
- Touch-friendly controls throughout
- Optimized layouts for portrait and landscape
- Responsive tab navigation
- Smooth scrolling performance
- Safari compatibility verified

### Changed
- Updated AI page from placeholder to full implementation
- Enhanced README.md with complete feature documentation
- Improved version number to 2.0.0 reflecting major feature addition

### Documentation
- Added USAGE_GUIDE.md with 15-minute demo script
- Added CHANGELOG.md for version tracking
- Updated README.md with AI features
- Comprehensive inline code documentation

---

## [1.0.0] - 2026-01-02

### Added - Phase 3: Training & Labs

#### Training System
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

#### Labs System
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

#### Components
- `TrainingModule.jsx` - Reusable training module component
- `TryItSection.jsx` - Interactive practice sections
- `ProgressTracker.jsx` - Visual progress tracking
- `CodeExample.jsx` - Syntax-highlighted code display
- `labValidator.js` - Solution validation utility

### Changed
- Enhanced navigation to include Training and Labs pages
- Improved overall user experience flow

---

## [0.3.0] - 2026-01-01

### Added - Phase 2: API Testing & Backend Browser

#### Backend Features
- PACS Backend Browser with tabbed interface
- Event viewer with 10,000+ synthetic events
- Advanced filtering capabilities:
  - Date range selection
  - Event type filtering
  - Location/door filtering
  - Cardholder filtering
  - Full-text search
  
- Event statistics dashboard
- CSV and JSON export functionality
- Door management browser
- Cardholder management browser
- Camera management browser
- Controller and access group browsers

#### Data Generation
- Realistic event generator creating 10,000+ events
- 6-month event history
- 20 doors across multiple buildings
- 50 cardholders with realistic data
- 15 cameras with locations
- Event types: access grants, denials, faults, alarms, system events
- Business hour patterns and off-hours activity simulation

#### API Testing
- Interactive API tester for multiple platforms
- Support for Gallagher, Milestone, Axis, ONVIF
- Request/response viewer
- Request history tracking
- Endpoint browser with examples
- Mock API client with realistic responses

#### Utilities
- `eventGenerator.js` - Generate realistic security events
- `eventQuery.js` - Advanced event filtering and querying
- `apiClient.js` - Mock API client implementation
- `initData.js` - Data initialization and management

#### Components
- `EventViewer.jsx` - Event list with filtering
- `DataTable.jsx` - Reusable data display component
- `TabBar.jsx` - Tab navigation component
- `ApiTester.jsx` - API testing interface
- `RequestHistory.jsx` - API request history
- `EndpointBrowser.jsx` - Browse available endpoints
- `ResponseViewer.jsx` - Formatted response display

### Changed
- Enhanced backend architecture to support large datasets
- Optimized filtering for performance with 10,000+ events

---

## [0.2.0] - 2025-12-30

### Added - Phase 1: Foundation & Core Structure

#### Application Foundation
- React 19 application with Vite build system
- React Router for client-side navigation
- Professional design system implementation
- Responsive layout system

#### Design System
- CSS custom properties (variables) for theming
- Color palette: primary, secondary, success, warning, danger, info
- Typography system with standardized font sizes
- Spacing system (xs, sm, md, lg, xl, 2xl, 3xl)
- Responsive breakpoints for desktop, iPad, mobile
- Border radius and shadow utilities

#### Core Components
- `Button.jsx` - Reusable button with variants and sizes
- `Card.jsx` - Content card component
- `StatusBadge.jsx` - Status indicator badges
- `NavBar.jsx` - Responsive navigation bar
- `Footer.jsx` - Application footer
- `Layout.jsx` - Page layout wrapper

#### Pages
- `Home.jsx` - Professional landing page with feature cards
- Placeholder pages for: Frontend, Backend, Training, Labs, AI
- Consistent page structure and styling

#### Styling
- Global CSS with design system variables
- Responsive CSS with mobile-first approach
- Component-specific CSS modules
- Touch-optimized controls (44px minimum)

#### Developer Experience
- ESLint configuration for code quality
- Hot module replacement for fast development
- Production build optimization
- Clean project structure

### Infrastructure
- Git repository initialization
- README.md with setup instructions
- Package.json with all dependencies
- Vite configuration
- Project structure documentation

---

## [0.1.0] - 2025-12-29

### Added
- Initial project setup
- Basic React application scaffolding
- Development environment configuration

---

## Version History Summary

- **v2.0.1** - Bug Tracking & AI Workflow Transparency ✅
- **v2.0.0** - AI Tools & Final Polish (Phase 4) ✅
- **v1.0.0** - Training & Labs (Phase 3) ✅
- **v0.3.0** - API Testing & Backend Browser (Phase 2) ✅
- **v0.2.0** - Foundation & Core Structure (Phase 1) ✅
- **v0.1.0** - Initial Setup

---

## Future Enhancements (Planned)

### Potential v2.1.0
- Real-time event simulation (live event feed)
- User authentication and roles
- Multi-language support
- **Planned Bug Fixes**:
  - LocalStorage quota management and optimization
  - Dark mode table selection visibility improvements
  - API PATCH method functionality
  - Natural language query data display
  - Event API completeness and consistency
  - API/Backend response alignment

### Potential v3.0.0
- Real API integration options (Gallagher, Milestone)
- Collaborative features (multi-user investigations)
- Advanced reporting and analytics
- Mobile app (iOS/Android)

### Potential v3.1.0
- Compliance tracking (GDPR, HIPAA)
- Integration with ticketing systems
- Predictive analytics
- Anomaly detection ML models

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
