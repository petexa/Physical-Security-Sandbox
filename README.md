# Physical Security Sandbox

A professional training platform for learning PACS (Physical Access Control System) and VMS (Video Management System) API integration.

## 🎯 Overview

This platform provides a safe, simulated environment for:
- Learning physical security system integration
- Testing API endpoints (Gallagher, Milestone, Axis, ONVIF)
- Practicing real-world security scenarios
- Exploring 6 months of realistic event data
- Leveraging AI for security operations

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

- **Professional Design System** - Consistent colors, typography, and spacing
- **Responsive Design** - Optimized for desktop, iPad landscape, and iPad portrait
- **Touch-Friendly** - All interactive elements meet 44px minimum size
- **Component Library** - Reusable Button, Card, and StatusBadge components
- **PWA Support** - Works as a progressive web app on iPad

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

### Phase 2: API Testing & Backend Browser (Coming Soon)
- API testing console
- PACS backend browser
- Mock data integration
- Event filtering

### Phase 3: Training & Labs (Coming Soon)
- Interactive training modules
- Hands-on practice labs
- Real-world scenarios

### Phase 4: AI-Powered Tools (Coming Soon)
- Intelligent event analysis
- Anomaly detection
- Natural language queries
- Automated reports

## 📄 License

This is a training simulation project. All rights reserved.

## 🙏 Acknowledgments

Built with inspiration from industry-leading physical security platforms including Gallagher Command Centre and Milestone XProtect.

---

© 2026 Physical Security Sandbox. Version 1.0.0