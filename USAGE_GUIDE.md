# Physical Security Sandbox - Usage Guide

## Quick Demo Script (15 minutes)

This guide helps you deliver a professional demonstration of the Physical Security Sandbox platform.

---

## Pre-Demo Setup (5 minutes before)

1. **Start the Application:**
   ```bash
   cd sandbox-frontend
   npm run dev
   ```
   Or use production build:
   ```bash
   npm run build
   npx serve -s dist
   ```

2. **Access on iPad (optional):**
   - Find your local IP: `ipconfig` or `ifconfig`
   - On iPad, navigate to `http://YOUR_IP:5173` (dev) or `http://YOUR_IP:3000` (production)
   - For best experience, add to Home Screen (PWA mode)

3. **Verify Data:**
   - Open the Backend page
   - Confirm events are loaded (should see 10,000+ events)
   - If no events, they will auto-generate on first visit

---

## Demo Script

### 1. Introduction (2 minutes)

**Start on Home Page**

"Welcome to the Physical Security Sandbox - a professional training platform for learning PACS and VMS integration. This is a complete, working simulation with:
- 10,000+ realistic security events spanning 6 months
- Multiple integrated systems (access control, video, alarms)
- AI-powered analysis tools
- Interactive training and hands-on labs

Everything you see here is synthetic data designed for safe learning and testing."

**Navigate through the menu to show all pages briefly**

---

### 2. Frontend - API Testing (2 minutes)

**Go to Frontend page**

"First, let's look at API testing. This interface simulates real API endpoints from major physical security platforms."

**Demo Actions:**
1. Select **Gallagher Command Centre** from API dropdown
2. Choose endpoint: **Get Cardholders**
3. Click "Send Request"
4. Point out the formatted JSON response
5. Show the Request History feature

**Key Points:**
- "This works offline - no real API calls needed"
- "Great for learning API structures before working with real systems"
- "Supports Gallagher, Milestone, Axis, and ONVIF"

---

### 3. Backend - PACS Browser (3 minutes)

**Go to Backend page**

"This is where you browse and analyze security events - think of it as a PACS event viewer."

**Demo Actions:**
1. Show the event list (10,000+ events)
2. **Apply filters:**
   - Set date range: "Last 30 Days"
   - Event type: "Alarms"
   - Click "Apply Filters"
3. Show the statistics panel
4. Click "Export to CSV" to demonstrate export

**Key Points:**
- "All events are realistic - door access, alarms, faults, system events"
- "Advanced filtering helps find specific incidents"
- "Export functionality for reporting and analysis"

**Switch to Doors tab:**
- "You can also browse doors, cardholders, cameras - just like a real PACS"

---

### 4. AI Tools - The Impressive Feature (4 minutes)

**Go to AI page**

"Now for the most powerful feature - AI-powered security operations."

#### Natural Language Queries
1. Click **Natural Language Queries** tab
2. Click example: "How many door faults occurred last month?"
3. Wait for AI response (1-2 seconds)
4. Show the supporting data

**Say:** "You can ask questions in plain English about your security data. The AI understands context and provides actionable answers."

#### Event Summarization
1. Click **Event Summarization** tab
2. Select "Last 30 Days"
3. Click "Generate Summary"
4. Point out:
   - Overview section
   - Key findings
   - Statistics with charts
   - Security concerns
   - Recommendations

**Say:** "Perfect for management reports or shift handovers."

#### Investigation Builder (If time permits)
1. Click **Investigation Builder** tab
2. Select an alarm event from the list
3. Click "Build Investigation Workflow"
4. Show the investigation steps, evidence checklist, timeline

**Say:** "The AI builds a complete investigation workflow - tells you exactly what to do when an incident occurs."

---

### 5. Training & Labs (2 minutes)

**Go to Training page**

"For learning, we have comprehensive training modules."

**Demo Actions:**
1. Open a module (e.g., "Introduction to PACS")
2. Show the structured content
3. Scroll to "Try It" section - show interactive element
4. Point out progress tracking at the top

**Go to Labs page**

"And hands-on labs where you write actual code or configuration."

**Demo Actions:**
1. Open a lab (e.g., Lab 1)
2. Show the problem description
3. Point to the code editor
4. If time, enter a solution and click "Validate"

---

### 6. Closing & Questions (2 minutes)

**Return to Home page**

"To summarize, this platform provides:
- ✅ Realistic training environment with 10,000+ events
- ✅ Safe offline testing - no real systems at risk
- ✅ AI-powered tools for modern security operations
- ✅ Comprehensive training and hands-on practice
- ✅ Works on desktop and iPad

This is perfect for:
- Training new security staff
- Learning integration before real deployments
- Testing security procedures and workflows
- Demonstrating concepts to stakeholders"

**Open for questions**

---

## Common Questions & Answers

### Q: Is this connected to real security systems?
**A:** "No, everything is simulated. All data is synthetic and generated locally. This is specifically designed for safe training and testing."

### Q: Can it generate more events?
**A:** "Yes, the event generator can create unlimited realistic events. Currently configured for 6 months of data but easily adjustable."

### Q: Does the AI use real AI/LLM?
**A:** "In this demo version, it uses intelligent pattern matching for fast, offline functionality. In a production deployment, you could integrate with actual LLM APIs like Claude or GPT-4 for even more sophisticated analysis."

### Q: Can you integrate with real APIs?
**A:** "Yes, the architecture is designed to support real API integration. The mock API layer can be swapped with actual API clients."

### Q: What about data privacy?
**A:** "Since all data is synthetic and local, there are no privacy concerns. Perfect for demos and training without exposing real security data."

### Q: Can I customize it for our organization?
**A:** "Absolutely. You can customize door names, locations, cardholders, and even branding to match your specific environment."

---

## Tips for Professional Presentation

### Do's:
✅ Practice the flow beforehand
✅ Have the "impressive" feature ready (AI Investigation Builder)
✅ Explain it's synthetic data upfront
✅ Show the practical value (training, testing, learning)
✅ Demonstrate on iPad if available (shows responsive design)
✅ Keep momentum - don't get stuck on technical details

### Don'ts:
❌ Don't claim it's production-ready security software
❌ Don't skip the AI features - they're the most impressive
❌ Don't apologize for it being "just a demo"
❌ Don't show the code unless specifically asked
❌ Don't let the demo run longer than 15 minutes

---

## Troubleshooting During Demo

**If no events show up:**
- Refresh the page (events auto-generate on first load)
- Check browser console for errors
- Events are stored in localStorage

**If AI is slow:**
- That's normal - simulated thinking time (1-3 seconds)
- Shows realistic processing time

**If iPad isn't connecting:**
- Verify both devices on same network
- Check firewall settings
- Fall back to laptop demo

---

## After the Demo

Share these resources:
- GitHub repository: https://github.com/petexa/Physical-Security-Sandbox
- Documentation: README.md
- Installation instructions for their own testing

Offer to:
- Customize for their environment
- Provide training on the platform
- Discuss real integration possibilities

---

## Quick Reference

### Essential URLs
- Home: `http://localhost:5173/`
- Frontend: `http://localhost:5173/frontend`
- Backend: `http://localhost:5173/backend`
- AI: `http://localhost:5173/ai`
- Training: `http://localhost:5173/training`
- Labs: `http://localhost:5173/labs`

### Data Reset
If you need fresh data:
```javascript
// Open browser console and run:
localStorage.clear();
// Then refresh the page
```

### Demo Checklist
- [ ] Application running and accessible
- [ ] Events loaded (check Backend page)
- [ ] iPad connected (if using)
- [ ] No developer console open during demo
- [ ] Browser zoom at 100%
- [ ] Full screen mode (F11) if presenting
- [ ] Close unneeded browser tabs
- [ ] Silence notifications

---

**Good luck with your presentation! 🎯**
