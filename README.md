# Physical Security Sandbox

A professional training platform for learning PACS (Physical Access Control System) and VMS (Video Management System) API integration.

## 🎯 Overview

This platform provides a safe, simulated environment for:
- Learning physical security system integration
- Testing API endpoints (Gallagher, Milestone, Axis, ONVIF)
- Practicing real-world security scenarios
- Exploring 6 months of realistic event data (10,000+ events)
- Leveraging AI-powered security operations tools
- Interactive training modules and hands-on labs

**Important:** This is a training simulation. All systems, data, and events are synthetic and for educational purposes only.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/petexa/Physical-Security-Sandbox.git
cd Physical-Security-Sandbox

# Navigate to the frontend
cd sandbox-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
sandbox-frontend/
├── public/              # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and design system
│   └── utils/          # Utility functions
├── index.html
└── package.json
```

## 🎨 Features

### Core Features
- **Professional Design System** - Consistent colors, typography, and spacing across all pages
- **Responsive Design** - Optimized for desktop, iPad landscape, and iPad portrait
- **Touch-Friendly** - All interactive elements meet 44px minimum size for easy touch interaction
- **Component Library** - Reusable Button, Card, StatusBadge, and specialized components
- **PWA Support** - Works as a progressive web app on iPad

### Pages & Functionality
1. **Home** - Professional landing page with feature overview and quick navigation
2. **Frontend (API Testing)** - Interactive API tester for Gallagher, Milestone, Axis, and ONVIF
   - Live API request/response testing
   - Request history tracking
   - Response syntax highlighting
   - Endpoint browser with examples

3. **Backend (PACS Browser)** - Explore simulated PACS data
   - Browse 10,000+ realistic events across 6 months
   - Advanced filtering (date range, event type, location, cardholder)
   - Event statistics and analytics
   - CSV/JSON export functionality
   - Door, cardholder, camera, and controller management

4. **Training** - Comprehensive learning modules
   - 6 interactive training modules covering PACS, VMS, and integration concepts
   - "Try It" sections for hands-on practice
   - Progress tracking with localStorage persistence
   - Code examples with syntax highlighting

5. **Labs** - Hands-on practice exercises
   - 8 practical labs with validation
   - Real-time feedback on solutions
   - Progressive difficulty levels
   - Covers API integration, event processing, and security workflows

6. **AI Tools** - AI-powered security operations
   - **Natural Language Queries** - Ask questions about events in plain English
   - **Event Summarization** - Generate comprehensive event analysis reports
   - **Incident Report Generator** - Create professional security incident reports
   - **Investigation Builder** - AI-assisted investigation workflows
   - **API Response Explainer** - Educational tool for understanding API responses
   - **Log Analyzer** - Identify security issues and anomalies in system logs

## 📱 Device Support

- Desktop (1280px+)
- iPad Landscape (768px - 1024px)
- iPad Portrait (< 768px)

## 🛠 Technology Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## 📖 Documentation

- [Gallagher Command Centre API](https://security.gallagher.com/en-NZ/Products/Command-Centre/API)
- [Milestone XProtect Developer Network](https://www.milestonesys.com/solutions/developer-network/)
- [Axis VAPIX](https://www.axis.com/vapix)
- [ONVIF Specifications](https://www.onvif.org/)

## 🗺 Roadmap

### Phase 1: Foundation & Core Structure ✅
- React application scaffold
- Design system implementation
- Core components
- Routing setup
- Professional Home page

### Phase 2: API Testing & Backend Browser ✅
- API testing console
- PACS backend browser
- Mock data integration
- Event filtering and analytics
- 10,000+ event dataset generation

### Phase 3: Training & Labs ✅
- Interactive training modules
- Hands-on practice labs
- Real-world scenarios
- Progress tracking

### Phase 4: AI-Powered Tools ✅
- Natural language event queries
- Event summarization
- Incident report generation
- Investigation builder
- API response explainer
- System log analyzer
- iPad optimization
- Professional polish

## 📄 License

This is a training simulation project. All rights reserved.

## 🙏 Acknowledgments

Built with inspiration from industry-leading physical security platforms including Gallagher Command Centre and Milestone XProtect.

---

© 2026 Physical Security Sandbox. Version 2.0.0