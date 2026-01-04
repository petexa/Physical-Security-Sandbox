https://sandbox.petefox.co.uk/backend# Known Issues and Fixes

## Repository/Configuration Issues

> **Note:** These are NOT build issues. The build process (`npm install` + `npm run build`) works correctly. These are configuration and code issues in the repository that affect deployment.

### Issue #1: Nginx Document Root Mismatch (Configuration Issue)
**Date:** January 4, 2026  
**Severity:** High  
**Status:** Fixed  
**Type:** Repository Configuration Error

**Problem:**
- Nginx configuration pointed to `/var/www/sandbox/` as document root
- Deployment process was copying to `/var/www/sandbox.petefox.co.uk/`
- This caused the site to serve old cached files even after fresh builds

**Symptoms:**
- New features not appearing after rebuild
- Old bundle files being served (e.g., `index-XNGW1SYU.js` instead of `index-BJjZ0xNt.js`)
- Version showing outdated build

**Root Cause:**
```nginx
# In /etc/nginx/sites-available/sandbox.petefox.co.uk
root /var/www/sandbox;  # Pointing to wrong directory
```

**Fix:**
Deploy to the correct directory that nginx is serving:
```bash
sudo cp -r /opt/physical-security-sandbox/sandbox-frontend/dist/* /var/www/sandbox/
```

**Permanent Solution:**
Either update nginx config to point to `/var/www/sandbox.petefox.co.uk/` OR always deploy to `/var/www/sandbox/`

---

### Issue #2: API Proxy Missing Trailing Slash (Configuration Issue)
**Date:** January 4, 2026  
**Severity:** Critical  
**Status:** Fixed  
**Type:** Nginx Configuration Bug

**Problem:**
- Nginx proxy configuration was missing trailing slash in `proxy_pass`
- Frontend requests to `/api/health` were proxied to `http://localhost:3000health` (no slash)
- Backend API expected requests at `http://localhost:3000/health`

**Symptoms:**
- Console errors: `Failed to load resource: the server responded with a status of 404 (Not Found)`
- All API calls failing
- Frontend loading but no data

**Root Cause:**
```nginx
location /api/ {
    proxy_pass http://localhost:3000;  # Missing trailing slash
}
```

When nginx proxies `/api/health`, it strips `/api/` and appends `health` directly to `http://localhost:3000`, resulting in `http://localhost:3000health`.

**Fix:**
```nginx
location /api/ {
    proxy_pass http://localhost:3000/;  # Added trailing slash
}
```

**Verification:**
```bash
curl http://sandbox.petefox.co.uk/api/health
# Should return: {"status":"healthy",...}
```

---
# Issue #3: PM2 Process Crashing (Code Issue)
**Date:** January 4, 2026  
**Severity:** Medium  
**Status:** Non-blocking (API still functional)  
**Type:** Missing Module in Repository
**Status:** Non-blocking (API still functional)

**Problem:**
- Backend API (`gallagher-api`) logs show error: `Cannot find module './logger'`
- PM2 shows 65+ restarts
- API continues to work despite the error

**Symptoms:**
```
Error: Cannot find module './logger'
Require stack:
- /opt/physical-security-sandbox/mock-apis/server.js
```

**Root Cause:**
`server.js` likely has commented-out or unused require for `./logger` module that doesn't exist

**Current Status:**
- API is functional despite the error
- PM2 restarts the process automatically
- Not impacting user experience

**Recommended Fix:**
Remove or comment out the logger import in `/opt/physical-security-sandbox/mock-apis/server.js`

---

## Deployment Checklist

To avoid these issues in future deployments:

1. **Before Build:**
   - [ ] Pull latest code: `git pull`
   - [ ] Clean artifacts: `rm -rf node_modules dist`
   - [ ] Fresh install: `npm install`

2. **Build:**
   - [ ] Run build: `npm run build`
   - [ ] Verify dist/ created with new timestamps

3. **Deploy:**
   - [ ] Clear target directory: `sudo rm -rf /var/www/sandbox/*`
   - [ ] Copy build: `sudo cp -r dist/* /var/www/sandbox/`
   - [ ] Verify timestamps match

4. **Backend:**
   - [ ] Check API status: `pm2 status`
   - [ ] Test API: `curl http://localhost:3000/health`
   - [ ] Check logs: `pm2 logs gallagher-api --lines 20`

5. **Nginx:**
   - [ ] Test config: `sudo nginx -t`
   - [ ] Reload: `sudo systemctl reload nginx`
   - [ ] Test proxy: `curl http://sandbox.petefox.co.uk/api/health`

6. **Verification:**
   - [ ] Hard refresh browser (Ctrl+Shift+R)
   - [ ] Check new features visible
   - [ ] Check console for errors
   - [ ] Test API calls working

---

## Quick Fix Commands

**Full rebuild and deploy:**
```bash
cd /opt/physical-security-sandbox/sandbox-frontend
rm -rf node_modules dist
npm install
npm run build
sudo rm -rf /var/www/sandbox/*
sudo cp -r dist/* /var/www/sandbox/
sudo systemctl reload nginx
```

**Restart backend:**
```bash
pm2 restart gallagher-api
pm2 logs gallagher-api --lines 20
```

---

## Issue #4: Navbar Layout Issues (UI/CSS Bug)
**Date:** January 4, 2026  
**Severity:** Medium  
**Status:** Fixed  
**Type:** CSS/Layout Bug

**Problems:**
1. **Buttons cramped on desktop** - All navbar buttons were displayed in a single row without proper wrapping, causing text to be squeezed
2. **Home button overlapping with brand** - The "Home" button was positioned on top of the "Physical Security Sandbox" brand text

**Root Cause:**
```css
/* Old CSS had these issues: */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  /* Missing: flex-wrap and flex: 1 for proper layout */
}

.navbar-brand {
  /* Missing: flex-shrink: 0 to prevent compression */
}

.navbar-container {
  justify-content: space-between;
  /* Buttons and brand not properly constrained */
}

/* Media query breakpoint was 767px (too small) */
@media (max-width: 767px) { ... }
```

**Symptoms:**
- On desktop, navbar buttons all crammed in one line
- Brand text and Home button overlapping on smaller screens
- No space between navbar brand and menu items

**Fix Applied:**
```css
.navbar-container {
  gap: var(--spacing-md);  /* Added spacing */
}

.navbar-brand {
  flex-shrink: 0;  /* Prevents brand from being compressed */
}

.navbar-menu {
  flex: 1;  /* Takes remaining space */
  justify-content: flex-end;  /* Aligns menu to right */
  flex-wrap: wrap;  /* Allows wrapping on smaller screens */
}

/* Changed media query breakpoint from 767px to 1024px */
@media (min-width: 1024px) { ... }
@media (max-width: 1023px) { ... }
```

**Result:**
- Desktop (>1024px): Buttons display horizontally with proper spacing and wrapping
- Tablet/Mobile (<1024px): Hamburger menu activates, buttons stack vertically
- Brand text always stays on left without compression
- No overlapping elements

---

## Issue #5: Frontend Page (API Tester) Layout Broken
**Date:** January 4, 2026  
**Severity:** High  
**Status:** Fixed (Restored PR#10 Version)  
**Type:** CSS Grid Layout Bug

**Problem:**
- Frontend page (/frontend) showing broken three-column layout
- Sidebar, main content, and history panel were bunched at bottom-left instead of displaying side-by-side
- Grid CSS not properly sizing/positioning columns

**Symptoms:**
- Three-column grid displaying as stacked content at bottom-left
- Columns not spreading across full width
- EndpointBrowser (left), ApiTester main (center), and RequestHistory (right) not in proper grid positions

**Root Cause:**
Post-PR#10 changes introduced complex nested DOM structure with additional wrapper divs (`.api-container`, `.api-layout`) that broke the original grid layout:

```jsx
// Broken structure (post-PR#10):
<div className="api-tester">
  <div className="api-container">
    <div className="api-layout">
      {/* Components here */}
    </div>
  </div>
</div>

// Working structure (PR#10):
<div className="api-tester">
  <div className="api-tester-sidebar">
    <EndpointBrowser />
  </div>
  <div className="api-tester-main">
    {/* Main content */}
  </div>
  <div className="api-tester-history">
    <RequestHistory />
  </div>
</div>
```

**CSS Grid Configuration (PR#10 - Working):**
```css
.api-tester {
  display: grid;
  grid-template-columns: 280px 1fr 300px;
  height: calc(100vh - 80px);
  gap: 0;
  background: var(--color-background);
}

.api-tester-sidebar {
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
}

.api-tester-main {
  padding: var(--spacing-xl);
  overflow-y: auto;
}

.api-tester-history {
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  overflow-y: auto;
}
```

**Fix Applied:**
Restored working versions from PR#10:
- `ApiTester.jsx` - Simple three-div structure
- `ApiTester.css` - Clean grid layout with `280px 1fr 300px` columns

**Commands Used:**
```bash
cd /opt/physical-security-sandbox
git show b166fa7:sandbox-frontend/src/components/frontend/ApiTester.jsx > /tmp/ApiTester-pr10.jsx
git show b166fa7:sandbox-frontend/src/components/frontend/ApiTester.css > /tmp/ApiTester-pr10.css
cp /tmp/ApiTester-pr10.jsx sandbox-frontend/src/components/frontend/ApiTester.jsx
cp /tmp/ApiTester-pr10.css sandbox-frontend/src/components/frontend/ApiTester.css
cd sandbox-frontend && npm run build
sudo rm -rf /var/www/sandbox/* && sudo cp -r dist/* /var/www/sandbox/
```

**Result:**
- Three-column layout displays correctly
- Left sidebar (280px): Endpoint Browser with Gallagher PACS expanded by default
- Center (flexible): Request Builder with method selector, URL input, headers, body
- Right sidebar (300px): Request History with recent API calls
- Full-height layout fills viewport properly

**Verification:**
Visit http://sandbox.petefox.co.uk/frontend and confirm:
- [x] Three columns visible side-by-side
- [x] Gallagher PACS section expanded
- [x] Request builder in center
- [x] History panel on right
- [x] Layout fills full viewport height


---

## Issue #6: Backend Dashboard Page Shows No Data  
**Date:** January 4, 2026  
**Severity:** Medium  
**Status:** Open - Design Issue  
**Type:** Mock API Data Missing

**Problem:**
- Backend Dashboard page (`/backend`) displays no data
- API calls return 404 or empty results: `{"results":[],"total":0}`  
- Console errors: `TypeError: (R.results || R || []).slice is not a function`
- Mock API server has no seed data

**Symptoms:**
```
[APILogger] Logged GET /api/gallagher/cardholders - 404 (301ms)
[APILogger] Logged GET /api/gallagher/doors - 404 (302ms)  
[APILogger] Logged GET /api/gallagher/access-groups - 404 (305ms)
[APILogger] Logged GET /api/gallagher/events?top=10 - 404 (314ms)
Failed to fetch stats: TypeError: (R.results || R || []).slice is not a function
```

**Root Cause:**
The mock API server (`/opt/physical-security-sandbox/mock-apis/server.js`) has no data storage or seed data. It returns empty arrays:
```bash
$ curl http://localhost:3000/api/gallagher/cardholders
{"results":[],"total":0,"skip":0,"top":100}
```

Meanwhile, the frontend initializes mock data in `localStorage` via `initData.js`, but the backend dashboard tries to fetch from the API server instead of using localStorage.

**Architectural Mismatch:**
1. **Frontend pages** (Events, etc.) → Use `localStorage` data (initialized by `initData.js`)
2. **Backend Dashboard** → Tries to use API server data (which is empty)

**Possible Solutions:**

**Option 1: Seed the Mock API Server**
Add data initialization to `/opt/physical-security-sandbox/mock-apis/server.js`:
```javascript
// Add in-memory data storage
let cardholders = [];
let doors = [];
let accessGroups = [];
let events = [];

// Initialize with seed data on startup
function initializeData() {
  // Generate mock cardholders, doors, etc.
  cardholders = generateMockCardholders(100);
  doors = generateMockDoors(50);
  // ...
}

initializeData();
```

**Option 2: Make Backend Dashboard Use localStorage**
Modify `BackendDashboard.jsx` to read from `localStorage` instead of API:
```javascript
// Instead of:
const cardholdersData = await apiClient.get('/api/gallagher/cardholders');

// Use:
const cardholders = JSON.parse(localStorage.getItem('pacs-cardholders') || '[]');
```

**Option 3: Proxy API to localStorage**
Create a service worker or API layer that intercepts API calls and serves localStorage data

**Current Workaround:**
None - Backend Dashboard page is non-functional until one of the above solutions is implemented.

**Recommended Fix:**
Option 2 is simplest - make Backend Dashboard read from the same localStorage that the rest of the app uses.

---

## Issue #7: Backend Dashboard Shows Systems as Offline (Fixed)
**Date:** January 4, 2026  
**Severity:** Medium  
**Status:** Fixed  
**Type:** Frontend API Response Handling Bug

**Problem:**
- Backend Dashboard displayed both Gallagher and Milestone systems as "Offline" (red status)
- Performance metrics not showing in system cards
- Cards not displaying side-by-side
- API calls succeeded (200 status) but data wasn't properly extracted

**Symptoms:**
```
✅ [APILogger] Logged GET /api/health - 200 (313ms)
✅ [APILogger] Logged GET /api/cardholders - 200 (304ms)
❌ Both systems showing red "Offline" indicators
❌ Performance metrics missing from cards
```

**Root Cause:**
The `apiClient.get()` mock function returns a response object with structure:
```javascript
{
  status: 200,
  data: {
    gallagher: { status: 'online', ... },
    milestone: { status: 'online', ... }
  }
}
```

However, `BackendDashboard.jsx` was incorrectly accessing the response:
```javascript
// ❌ WRONG - accessing response directly
const healthData = await apiClient.get('/api/health');
setHealth(healthData);  // Sets entire response object

// Then later:
const isOnline = health.gallagher?.status === 'online';  // ❌ undefined
```

The code expected `health.gallagher.status` but got `health.data.gallagher.status`.

**Additional Issues:**
1. **Wrong API paths**: Frontend called `/api/gallagher/cardholders` but mock handled `/api/cardholders`
2. **Missing .data access**: All API responses needed `.data` property access
3. **Events array error**: `(eventsData.results || eventsData || []).slice()` failed because `eventsData` was the full response object

**Fix Applied:**
Modified `/opt/physical-security-sandbox/sandbox-frontend/src/pages/BackendDashboard.jsx`:

```javascript
// ✅ FIXED - extract data property
const healthData = await apiClient.get('/api/health');
setHealth(healthData.data);  // Access .data

// Fixed API paths (removed /gallagher prefix)
const cardholdersData = await apiClient.get('/api/cardholders');  // not /api/gallagher/cardholders
const doorsData = await apiClient.get('/api/doors');
const accessGroupsData = await apiClient.get('/api/access_groups');
const eventsData = await apiClient.get('/api/events?top=10');

// Fixed data access for all responses
setStats({
  cardholders: cardholdersData.data?.results?.length || 0,
  doors: doorsData.data?.results?.length || 0,
  accessGroups: accessGroupsData.data?.results?.length || 0,
});

// Fixed events array access
const eventsList = (eventsData.data?.results || eventsData.data || []).slice(0, 10);
```

**Verification:**
After fix (deployed at 14:46:09):
- ✅ Both Gallagher and Milestone show green "Online" status
- ✅ Performance metrics display in each card (CPU, Memory, Connections, etc.)
- ✅ Cards display side-by-side in 2-column grid
- ✅ No console errors
- ✅ Recent activity feed populates correctly

**Files Changed:**
- `/opt/physical-security-sandbox/sandbox-frontend/src/pages/BackendDashboard.jsx`
- Deployed bundle: `index-CLFshB4V.js` (686 KB)

**Lesson Learned:**
When working with wrapper/mock API clients, always document the response structure clearly. The disconnect between mock response format (`{status, data}`) and expected format led to multiple issues.

---

## Issue #8: Vendor Tab Bar Ignored Vendor-Specific Tabs (Fixed)
**Date:** January 4, 2026  
**Severity:** Medium  
**Status:** Fixed  
**Type:** Frontend UI Logic Bug

**Problem:**
- Tab bar used a hardcoded global tab list, so vendor detail pages showed the wrong tabs/labels.
- Gallagher tabs missed Operator Groups, Inputs, Outputs; Milestone tabs included Gallagher items.

**Fix:**
- Updated `TabBar.jsx` to consume the `tabs` prop from callers and map icons dynamically.
- Passed `counts` and vendor-specific tab arrays from `BackendVendor.jsx`.
- Adjusted tab labels/order to:
  - Gallagher: Cardholders, Access Groups, Doors, Controllers, Operator Groups, Inputs, Outputs, Events.
  - Milestone: Milestone Cameras, Bookmarks, VMS Events, Recording Servers.

**Files Changed:**
- `/opt/physical-security-sandbox/sandbox-frontend/src/components/backend/TabBar.jsx`
- `/opt/physical-security-sandbox/sandbox-frontend/src/pages/BackendVendor.jsx`

**Deploy:**
- Bundle `index-BKpixjFg.js` deployed at 14:57:33 on Jan 4, 2026.

**Verification:**
- Visiting `/backend/gallagher` shows only Gallagher tabs above.
- Visiting `/backend/milestone` shows only Milestone tabs above.
- Tab counts render correctly via `counts` prop.


---

## Issue #9: CSS Changes Not Reflecting on Live Site (Deployment Path Mismatch)
**Date:** January 4, 2026  
**Severity:** High  
**Status:** Fixed  
**Type:** Deployment Configuration Error

**Problem:**
- CSS styling changes to workflow modal (dark theme) were made and verified in built bundles
- After multiple rebuilds and deployments, user consistently reported "no change at all"
- Browser was serving old CSS file (`index-CFJ-yoNh.css`) instead of newly deployed file (`index-DUCpi3bu.css`)

**Symptoms:**
- Workflow modal appeared extremely dark with invisible text
- Form inputs had wrong background colors
- `curl` to live site showed different CSS filename than what was deployed

```bash
# Deployed files showed:
ls /var/www/sandbox.petefox.co.uk/assets/*.css | tail -1
# index-DUCpi3bu.css

# But curl to live site showed:
curl -s https://sandbox.petefox.co.uk/ | grep -o 'index-[^"]*\.css'
# index-CFJ-yoNh.css  ← OLD FILE!
```

**Root Cause:**
Nginx was configured to serve from `/var/www/sandbox/` but the deployment script was copying files to `/var/www/sandbox.petefox.co.uk/`:

```nginx
# /etc/nginx/sites-enabled/sandbox.petefox.co.uk
server {
    root /var/www/sandbox;  # ← This is where nginx reads from
    ...
}
```

```bash
# But deployment was going to wrong directory:
sudo cp -r dist/* /var/www/sandbox.petefox.co.uk/  # ← Wrong!
```

**Investigation Steps:**
1. Verified CSS was correctly built with dark theme styles: `grep "1e293b" dist/assets/*.css` ✓
2. Verified deployed CSS had styles: `grep "guided-workflow-modal" /var/www/sandbox.petefox.co.uk/assets/*.css` ✓
3. Compared timestamps - `/var/www/sandbox/` was from 14:57, `/var/www/sandbox.petefox.co.uk/` was 15:37
4. Discovered nginx root mismatch via `curl` vs `ls` comparison

**Fix Applied:**
Deploy to the correct nginx document root:
```bash
sudo cp -r /opt/physical-security-sandbox/sandbox-frontend/dist/* /var/www/sandbox/
```

**Verification:**
```bash
# Before fix:
curl -s https://sandbox.petefox.co.uk/ | grep -o 'index-[^"]*\.css'
# index-CFJ-yoNh.css

# After fix:
curl -s https://sandbox.petefox.co.uk/ | grep -o 'index-[^"]*\.css'
# index-DUCpi3bu.css ✓
```

**Prevention:**
Update the VS Code task "Deploy UI" to use the correct path:
```json
{
    "label": "Deploy UI",
    "type": "shell",
    "command": "sudo mkdir -p /var/www/sandbox && sudo cp -r /opt/physical-security-sandbox/sandbox-frontend/dist/* /var/www/sandbox/"
}
```

**Lesson Learned:**
When CSS changes aren't appearing, always verify the live site is actually serving the files you deployed by comparing:
1. The filename in the HTML (`curl site | grep css`)
2. The filename in the deploy directory (`ls /deploy/path/*.css`)

If they don't match, you're deploying to the wrong location.


---

## Issue #10: Workflow Steps Show No Data (API Response Parsing Bug)
**Date:** January 4, 2026  
**Severity:** High  
**Status:** Fixed  
**Type:** Frontend Data Extraction Bug

**Problem:**
- All workflow steps showed "No items available" despite mock data existing
- Employee Onboarding: No access groups to add
- Security Investigation: No events to show
- Access Group Management: No doors to add
- Employee Termination: No employees

**Symptoms:**
```
// Console showed successful API calls:
[APILogger] GET /api/access_groups - 200
[APILogger] GET /api/cardholders - 200
[APILogger] GET /api/events - 200

// But UI displayed:
"No access groups available"
"No items"
```

**Root Cause:**
The apiClient returns **paginated responses** with this structure:
```javascript
{
  status: 200,
  data: {
    results: [...],  // ← The actual data array is HERE
    next: {...},
    href: "..."
  }
}
```

But all workflow step components were incorrectly checking if `response.data` was an array:
```javascript
// ❌ WRONG - response.data is an object, not an array
const groups = Array.isArray(response?.data)
  ? response.data
  : [];
// Result: Always returned empty array []
```

**Fix Applied:**
Changed all data extraction to properly access `response.data.results`:
```javascript
// ✅ CORRECT - extract results from paginated response
const groups = response?.data?.results 
  || response?.data 
  || response?.results 
  || [];
setAccessGroups(Array.isArray(groups) ? groups : []);
```

**Files Changed:**
- `EmployeeOnboarding.jsx` - Fixed access groups extraction
- `EmployeeTermination.jsx` - Fixed cardholders, credentials, access groups extraction
- `SecurityInvestigation.jsx` - Fixed events extraction
- `AccessGroupManagement.jsx` - Fixed doors and cardholders extraction

**Additional Fixes (Issue #10a - Wrong API Paths):**
Some workflow steps were also calling wrong API endpoints:
```javascript
// ❌ WRONG - these paths don't exist in apiClient
get('/api/gallagher/access-groups')
get('/api/gallagher/cardholders')
get('/api/gallagher/events')

// ✅ CORRECT - paths that apiClient handles
get('/api/access_groups')
get('/api/cardholders')
get('/api/events')
```

**Additional Fixes (Issue #10b - Missing API Endpoints):**
Added missing endpoints to `apiClient.js`:
- `GET /api/cardholders/{id}/credentials` - Returns cardholder's credentials
- `GET /api/cardholders/{id}/access-groups` - Returns cardholder's access groups
- `PATCH /api/access_groups/{id}/doors` - Update doors in access group
- `PATCH /api/credentials/{id}` - Update credential
- `POST /api/access_groups/{id}/members` - Add member to access group
- `DELETE /api/access_groups/{id}/members/{id}` - Remove member from access group

**Verification:**
After fix:
- ✅ Employee Onboarding shows access groups in step 2
- ✅ Security Investigation shows events list
- ✅ Access Group Management shows doors and cardholders
- ✅ Employee Termination shows employee list

**Lesson Learned:**
When using a mock API client that wraps responses, always document the response structure clearly:
```javascript
// apiClient.js returns:
{ status: 200, data: { results: [...], next: {...} } }

// NOT:
{ status: 200, data: [...] }
```

Consumers must extract `.data.results`, not just `.data`.



---

## Issue #11: ApiDocs Page Theme Mismatch (CSS Bug)
**Date:** January 4, 2026  
**Severity:** Low  
**Status:** Fixed  
**Type:** CSS Variable Naming Inconsistency

**Problem:**
- `/docs` page (ApiDocs component) was not following the site's dark theme
- Page displayed with incorrect colors and didn't match other pages like Home, Settings, Training

**Root Cause:**
`ApiDocs.css` was using outdated CSS variable naming convention:
```css
/* WRONG - Old variable names */
background: var(--bg-primary);
background: var(--bg-secondary);
color: var(--text-primary);
color: var(--text-secondary);
border-color: var(--border-color);
background: var(--primary-color);
```

While the rest of the app uses the correct convention:
```css
/* CORRECT - Site-wide variable names */
background: var(--color-background);
background: var(--color-surface);
color: var(--color-text-primary);
color: var(--color-text-secondary);
border-color: var(--color-border);
background: var(--color-primary);
```

**Symptoms:**
- Docs page had wrong background colors
- Text colors didn't match theme
- Buttons and UI elements looked inconsistent
- Page didn't match the visual style of other pages

**Fix:**
Updated all CSS variables in `ApiDocs.css` to use the correct naming convention:
- `--bg-primary` → `--color-background`
- `--bg-secondary` → `--color-surface`
- `--text-primary` → `--color-text-primary`
- `--text-secondary` → `--color-text-secondary`
- `--border-color` → `--color-border`
- `--primary-color` → `--color-primary`
- `--primary-dark` → Removed (using hardcoded #2563eb instead)

**Files Changed:**
- `src/pages/ApiDocs.css` - Updated all CSS variable references

**Verification:**
After fix:
- ✅ Docs page matches dark theme
- ✅ Sidebar has correct background color
- ✅ Text colors consistent with site
- ✅ Buttons follow theme styling
- ✅ Visual consistency across all pages

**Lesson Learned:**
When adding new pages, always check that CSS follows the site-wide variable naming convention. The correct pattern is `--color-{purpose}` not `--{purpose}-color` or `--{element}-{purpose}`.

---

## Issue #12: Comprehensive CSS Variable Cleanup (CSS Standardization)
**Date:** January 4, 2026  
**Severity:** Low  
**Status:** Fixed  
**Type:** CSS Variable Naming Inconsistency (Site-wide)

**Problem:**
- Multiple CSS files throughout the codebase were using inconsistent CSS variable naming conventions
- Some files used old naming (`--bg-primary`, `--text-primary`, `--primary-color`)
- Other files used correct naming (`--color-background`, `--color-text-primary`, `--color-primary`)
- This caused visual inconsistencies across different pages and components

**Affected Files:**
- `src/pages/Backend.css`
- `src/pages/BackendDashboard.css`
- `src/pages/ApiDocs.css` (Issue #11)
- `src/components/settings/SystemInfo.css`
- `src/components/workflows/GuidedWorkflow.css`

**Root Cause:**
Inconsistent CSS variable naming convention across the codebase. Different developers or different development phases used different naming patterns without a unified standard.

**Fix:**
Standardized ALL CSS files to use the correct site-wide convention:
- `--bg-primary` → `--color-background`
- `--bg-secondary` → `--color-surface`
- `--bg-tertiary` → `--color-surface`
- `--text-primary` → `--color-text-primary`
- `--text-secondary` → `--color-text-secondary`
- `--primary-color` → `--color-primary`
- `--primary-dark` → Removed (using hardcoded colors)
- `--bg-primary-rgb` → Replaced with actual RGB values (`15, 23, 42`)

**Files Changed:**
- `src/pages/Backend.css` - Updated all variable references
- `src/pages/BackendDashboard.css` - Updated all variable references
- `src/pages/ApiDocs.css` - Updated all variable references (Issue #11)
- `src/components/settings/SystemInfo.css` - Updated all variable references
- `src/components/workflows/GuidedWorkflow.css` - Replaced RGB variable

**Verification:**
After fix:
- ✅ All pages use consistent CSS variable naming
- ✅ Dark theme applies correctly site-wide
- ✅ No visual inconsistencies between pages
- ✅ Easy to maintain and extend theme in the future

**Standard CSS Variable Convention:**
```css
/* Backgrounds */
--color-background     /* Main page background */
--color-surface        /* Card/panel surfaces */

/* Text */
--color-text-primary   /* Primary text color */
--color-text-secondary /* Secondary/muted text */

/* Borders */
--color-border         /* Border colors */

/* Brand/Theme */
--color-primary        /* Primary brand color (blue) */
```

**Lesson Learned:**
Establish and document CSS variable naming conventions early in the project. Use linting or code review to enforce consistency. A single standard prevents fragmentation and makes theming much easier.

---

## Issue #13: Orphaned Compare.jsx File (Cleanup)
**Date:** January 4, 2026  
**Severity:** Very Low  
**Status:** Fixed  
**Type:** Code Cleanup

**Problem:**
- `Compare.jsx` file still existed in `src/pages/` directory
- File was not imported or used anywhere (removed from App.jsx and NavBar.jsx earlier)
- Orphaned code can cause confusion and bloat the repository

**Root Cause:**
When removing the Compare page feature, the file deletion was missed while routes and imports were removed.

**Fix:**
Deleted orphaned file:
```bash
rm src/pages/Compare.jsx
```

**Files Deleted:**
- `src/pages/Compare.jsx`

**Note:**
`Compare.css` was already deleted in earlier cleanup. This completes the full removal of the Compare feature.

---

## Summary of PR Changes (January 4, 2026)

### Fixed Issues:
1. ✅ **Issue #7:** Backend Dashboard Systems Offline - Fixed API response data extraction
2. ✅ **Issue #8:** Vendor Tab Bar Ignored Tabs - Made TabBar accept tabs prop, added missing Gallagher tabs
3. ✅ **Issue #10:** Workflow Steps Show No Data - Fixed response.data.results extraction, corrected API paths
4. ✅ **Issue #10a:** Wrong API Paths - Removed /gallagher prefix from API calls
5. ✅ **Issue #10b:** Missing API Endpoints - Added 6 new endpoints to apiClient.js
6. ✅ **Issue #11:** ApiDocs Theme Mismatch - Fixed CSS variables
7. ✅ **Issue #12:** CSS Variable Cleanup - Standardized site-wide
8. ✅ **Issue #13:** Orphaned Compare.jsx - Deleted unused file

### Files Modified:
- `src/pages/BackendDashboard.jsx` - Fixed API response data extraction and paths
- `src/components/backend/TabBar.jsx` - Made tabs configurable via props
- `src/pages/BackendVendor.jsx` - Added 3 missing Gallagher tabs with table views
- `src/components/workflows/steps/EmployeeOnboarding.jsx` - Fixed API paths and response parsing
- `src/components/workflows/steps/EmployeeTermination.jsx` - Fixed API paths and response parsing
- `src/components/workflows/steps/SecurityInvestigation.jsx` - Fixed API paths and response parsing
- `src/components/workflows/steps/AccessGroupManagement.jsx` - Fixed API paths and response parsing
- `src/utils/apiClient.js` - Added 6 missing API endpoints
- `src/pages/ApiDocs.css` - Fixed CSS variables
- `src/pages/Backend.css` - Fixed CSS variables
- `src/pages/BackendDashboard.css` - Fixed CSS variables
- `src/components/settings/SystemInfo.css` - Fixed CSS variables
- `src/components/workflows/GuidedWorkflow.css` - Fixed CSS variables
- `src/App.jsx` - Removed Compare route
- `src/components/NavBar.jsx` - Removed Compare link

### Files Deleted:
- `src/pages/Compare.jsx`
- `src/pages/Compare.css`

### API Endpoints Added:
- `GET /api/cardholders/{id}/credentials` - Returns cardholder's credentials
- `GET /api/cardholders/{id}/access-groups` - Returns cardholder's access groups
- `PATCH /api/access_groups/{id}/doors` - Update doors in access group
- `PATCH /api/credentials/{id}` - Update credential
- `POST /api/access_groups/{id}/members` - Add member to access group
- `DELETE /api/access_groups/{id}/members/{id}` - Remove member from access group

### Testing Completed:
- ✅ Backend Dashboard shows systems online with correct status
- ✅ Gallagher tabs show Operator Groups, Inputs, Outputs
- ✅ Milestone tabs show only Milestone-specific items
- ✅ Workflow steps load data correctly (Employee Onboarding, Termination, Security Investigation, Access Group Management)
- ✅ Compare page fully removed (no 404s, no broken links)
- ✅ ApiDocs page matches dark theme
- ✅ All pages have consistent theming
- ✅ No console errors
- ✅ Build completes successfully
- ✅ Deployment successful

### Build Info:
- Build time: ~5.96s
- No errors
- 1 CSS warning (benign - keyframe syntax)
- Bundle size: 665KB JS, 152KB CSS

### Ready for PR ✓
All issues resolved, code cleaned up, CSS standardized, API endpoints added, and deployment verified.

---

## Issue #14: Workflow Data Not Persisting to localStorage
**Date:** January 4, 2026  
**Severity:** High  
**Status:** Fixed  
**Type:** Data Persistence Bug

**Problem:**
- Workflows displayed summaries but didn't update backend cardholder data
- After running "EmployeeTermination" workflow, cardholder status remained "active" even though workflow showed "INACTIVE" result
- Data was lost on page refresh because it wasn't persisted to localStorage

**Symptoms:**
- Workflow summary showed updated data (e.g., "Status: INACTIVE")
- Returning to Backend/Gallagher showed original data (e.g., "Status: ACTIVE")
- No localStorage updates found in browser DevTools
- Data reverted to mock data on refresh

**Root Cause:**
Workflow step components didn't update the localStorage 'pacs-cardholders' state after API calls completed. Summary was derived from temporary state but never saved.

**Fix Applied:**
Modified all workflow step components (EmployeeTermination, EmployeeOnboarding, SecurityInvestigation, AccessGroupManagement) to:

1. Call API endpoint to update backend
2. Extract updated cardholder data from response
3. Persist to localStorage with updated fields

Example (EmployeeTermination.jsx):
```javascript
// After API call succeeds:
const updatedCardholder = {
  ...cardholder,
  status: 'inactive',  // Map 'authorised: false' to 'status: inactive'
  modified: new Date().toISOString()
};

// Save to localStorage
const cardholders = JSON.parse(localStorage.getItem('pacs-cardholders'));
const index = cardholders.findIndex(c => c.id === cardholder.id);
cardholders[index] = updatedCardholder;
localStorage.setItem('pacs-cardholders', JSON.stringify(cardholders));
```

**Files Modified:**
- `src/components/workflows/steps/EmployeeTermination.jsx` - Now updates cardholder.status and saves to localStorage
- `src/components/workflows/steps/EmployeeOnboarding.jsx` - Syncs hired_date and status changes
- `src/components/workflows/steps/SecurityInvestigation.jsx` - Persists investigation status
- `src/components/workflows/steps/AccessGroupManagement.jsx` - Saves access group updates

**Result:**
- ✅ Workflow changes persist after page refresh
- ✅ Backend/Gallagher table shows updated status
- ✅ Browser back/forward preserves state
- ✅ Multiple workflows can be run sequentially

---

## Issue #15: Inactive Status Badge Showing Green Instead of Red
**Date:** January 4, 2026  
**Severity:** High  
**Status:** Fixed  
**Type:** CSS Specificity and Logic Bug

**Problem:**
- INACTIVE cardholder statuses displayed with teal/green background instead of red
- Badge showed correct lowercase text "inactive" but wrong color
- CSS case-sensitivity: comparison was `value === 'active'` but data had "INACTIVE" (uppercase)
- Global CSS rules from other pages (.status-badge rules in ApiDocs.css and AuditLog.css) were overriding StatusBadge component styles

**Symptoms:**
- CH-001 (INACTIVE) showed teal badge: `<span class="status-badge-success">inactive</span>`
- CH-002 (ACTIVE) correctly showed green badge
- Text was correctly lowercase (from another fix)
- But color remained teal regardless of status value

**Root Cause:**
Two separate issues:

1. **Case Sensitivity Bug:**
   ```javascript
   // OLD - Case sensitive, failed for uppercase values
   status={value === 'active' ? 'success' : 'error'}
   ```

2. **CSS Specificity Collision:**
   ```css
   /* ApiDocs.css defined conflicting .status-badge rules */
   .status-badge {
     background: rgba(16, 185, 129, 0.1);  /* Teal - overrode component styles */
     color: #10b981;
   }
   ```
   Since CSS is global, ApiDocs.css styles were winning over StatusBadge.css styles.

**Fix Applied:**

1. **Fixed case sensitivity in BackendVendor.jsx:**
   ```javascript
   // Line 98 - Now case-insensitive
   status={value?.toLowerCase() === 'active' ? 'success' : 'error'}
   ```

2. **Protected StatusBadge.css with !important:**
   ```css
   .status-badge-success {
     background-color: #d1fae5 !important;
     color: #065f46 !important;
   }

   .status-badge-error {
     background-color: #fee2e2 !important;  /* Red background for inactive */
     color: #991b1b !important;
   }
   ```

**Files Modified:**
- `src/pages/BackendVendor.jsx` - Line 98: Added `.toLowerCase()` to status comparison
- `src/components/StatusBadge.css` - Added `!important` to all status-badge-* color rules

**Result:**
- ✅ INACTIVE statuses now display red background (#fee2e2)
- ✅ ACTIVE statuses display green background (#d1fae5)
- ✅ Text remains lowercase
- ✅ Icons show correct status (X for error/red, ✓ for success/green)
- ✅ CSS specificity no longer an issue

**Testing:**
- CH-001 (INACTIVE): Red badge with X icon
- CH-002 (ACTIVE): Green badge with ✓ icon
- Multiple status changes via workflows: Colors update correctly

---

## Issue #16: Audit Log Page Filter Breaking (Data Type Bug)
**Date:** January 4, 2026  
**Severity:** High  
**Status:** Fixed  
**Type:** Type Coercion Bug

**Problem:**
- Audit Log page (/audit) appears to show no data or behaves unexpectedly
- Status code range filters (Min/Max) cause incorrect filtering logic
- Empty string inputs being compared directly to numbers

**Symptoms:**
- No API call entries displayed on audit page even if API calls were made
- Filters are not working properly
- Page appears "broken" because filtering logic fails silently

**Root Cause:**
```javascript
// OLD - BROKEN: Empty strings compared to numbers
if (filters.statusMin !== undefined) {
    filtered = filtered.filter(e => e.statusCode >= filters.statusMin);
    // When statusMin is "", this becomes: e.statusCode >= ""
    // Which coerces to: e.statusCode >= 0
}
```

The status filter inputs start with empty strings `''`, but the filter function checked `!== undefined`. This caused:
1. Empty string inputs to pass the `!== undefined` check
2. String-to-number comparisons that didn't work as intended
3. Filtering logic that silently filtered out data

**Fix Applied:**
```javascript
// NEW - CORRECT: Check for empty strings and parse to numbers
if (filters.statusMin !== '' && filters.statusMin !== undefined) {
    const minStatus = parseInt(filters.statusMin, 10);
    filtered = filtered.filter(e => e.statusCode >= minStatus);
}
if (filters.statusMax !== '' && filters.statusMax !== undefined) {
    const maxStatus = parseInt(filters.statusMax, 10);
    filtered = filtered.filter(e => e.statusCode <= maxStatus);
}
```

**Files Modified:**
- `src/utils/apiLogger.js` - Lines in `filterLogEntries()` function:
  - Added empty string checks: `!== '' && !==undefined`
  - Added parseInt conversion for statusMin/statusMax
  - Now correctly handles empty inputs and numeric comparisons

**Result:**
- ✅ Audit log page now displays all logged API calls
- ✅ Status code filters work correctly when values are entered
- ✅ Empty filter inputs don't interfere with filtering
- ✅ Numeric comparisons work as intended

**Testing:**
- Empty filters show all entries
- Status Min "200" filters correctly
- Status Max "399" filters correctly
- Combining multiple filters works
- Export and Clear buttons function properly

---

## Feature #17: AI Transparency - Prompt Inspector (NEW - IMPLEMENTED ✅)

### Description
Added comprehensive transparency tool to show "behind the curtain" how Natural Language Event Queries work with real LLM APIs.

### What Was Added
- **PromptInspector Component** (`src/components/ai/PromptInspector.jsx`)
  - 500+ lines of production code
  - Shows actual prompt construction and context injection
  - Includes Python and Node.js implementation examples
  - Links to official Anthropic documentation
  - Copy-to-clipboard for all code examples

- **ChatInterface Integration**
  - Added "Inspect Prompt" button to AI responses
  - Passes events, doors, cardholders, cameras data to inspector
  - State management for modal open/close

- **AI.jsx Updates**
  - Now passes all PACS data down to ChatInterface
  - Ensures context data is available for transparency

### How It Works

1. User asks a question in Natural Language Queries tab
2. AI responds with an answer
3. "Inspect Prompt" button appears next to AI response
4. Click button to open Prompt Inspector modal showing:
   - Original query
   - Exact prompt sent to Claude API
   - Structured data context
   - Production Python implementation with Anthropic API
   - Production Node.js implementation with SDK
   - Links to learning resources

### Key Technical Details

**Prompt Constructor:**
- Uses `buildContext()` from `aiPrompts.js`
- Injects: totalEvents, dateRange, doors, eventTypes, sampleEvents
- Creates production-ready prompt for Claude API

**Code Examples:**
- Python: Uses `anthropic.Anthropic()` client, claude-3-5-sonnet-20241022
- Node.js: Uses `@anthropic-ai/sdk`, full async/await pattern
- Both are production-ready and can be copy-pasted

**Learning Resources:**
- Claude API Documentation
- Prompt Engineering Guide
- Available Models & Pricing
- Vision Capabilities

### Implementation Files Modified
1. `src/components/ai/ChatInterface.jsx` - Added PromptInspector import, state, and button
2. `src/pages/AI.jsx` - Updated ChatInterface props to include events/doors/cardholders/cameras
3. `src/components/ai/PromptInspector.jsx` - Complete transparency component
4. `src/components/ai/PromptInspector.css` - Styling for inspector modal

### Testing
- ✅ Component builds without errors
- ✅ UI deployed successfully
- ✅ All imports correct
- ✅ Data flowing correctly from AI.jsx → ChatInterface → PromptInspector
- ✅ Modal displays all 5+ sections
- ✅ Copy buttons work for code examples
- ✅ External links to documentation open correctly

### Model & API Information
- **Model**: claude-3-5-sonnet-20241022 (Latest Claude 3.5)
- **Provider**: Anthropic
- **Setup**: Need API key from https://console.anthropic.com/
- **Installation**: 
  - Python: `pip install anthropic`
  - Node.js: `npm install @anthropic-ai/sdk`

### User Guide
See `PROMPT_INSPECTOR_GUIDE.md` for comprehensive usage instructions and integration steps.

### Status
✅ **COMPLETE AND DEPLOYED** - Available at https://sandbox.petefox.co.uk/ai in Natural Language Queries tab

---

## Feature #18: Prompt Inspector Extended to All AI Tabs (NEW - IMPLEMENTED ✅)

### Description
Extended the "Inspect Prompt" transparency feature from Natural Language Queries to all 6 AI tabs.

### What Was Added

**PromptInspector Refactored** (`src/components/ai/PromptInspector.jsx`)
- Now supports `promptType` prop to handle all 6 prompt types:
  - `eventQuery` - Natural Language Queries (Chat)
  - `eventSummarization` - Event Summarization
  - `incidentReport` - Incident Reports
  - `investigationBuilder` - Investigation Builder
  - `apiResponseExplainer` - API Explainer
  - `logAnalysis` - Log Analysis
- Dynamic prompt construction based on type
- Type-specific input descriptions
- Python and Node.js examples adapted per prompt type

**Components Updated:**

1. **SummaryGenerator.jsx**
   - Added PromptInspector import and state
   - "Inspect Prompt" button in footer after generation
   - Passes: events, dateRange, eventTypeFilter

2. **IncidentReportGenerator.jsx**
   - Added PromptInspector import and state
   - "Inspect Prompt" button in report actions section
   - Passes: selectedEvents, doors, cardholders, cameras

3. **InvestigationBuilder.jsx**
   - Added PromptInspector import and state
   - "Inspect Prompt" button in investigation footer
   - Passes: selectedEvent, related events

4. **ApiExplainer.jsx**
   - Added PromptInspector import and state
   - "Inspect Prompt" button after explanation section
   - Passes: apiResponse, apiType (Gallagher/Milestone/etc.)

5. **LogAnalyzer.jsx**
   - Added PromptInspector import and state
   - "Inspect Prompt" button in analysis footer
   - Passes: logs text content

6. **AI.jsx (Parent Page)**
   - Updated to pass `doors`, `cardholders`, `cameras` props to all AI components
   - Ensures all components have access to full PACS data for transparency

### User Experience
1. User performs an AI action (generate summary, create report, analyze logs, etc.)
2. Results are displayed
3. "Inspect Prompt" button appears with results
4. Click to see:
   - What prompt type was used
   - Input data description
   - Exact prompt that would be sent to Claude API
   - Structured data context
   - Production Python implementation
   - Production Node.js implementation
   - Learning resources

### Prompt Types Supported

| Tab | Prompt Type | Input Data |
|-----|-------------|------------|
| Natural Language Queries | `eventQuery` | Query text, events context |
| Event Summarization | `eventSummarization` | Events, date range |
| Incident Reports | `incidentReport` | Selected events, context |
| Investigation Builder | `investigationBuilder` | Initial event, related events |
| API Explainer | `apiResponseExplainer` | API response JSON, vendor type |
| Log Analysis | `logAnalysis` | Log text content |

### Files Modified
- `src/components/ai/PromptInspector.jsx` - Refactored for multi-type support
- `src/components/ai/SummaryGenerator.jsx` - Added PromptInspector
- `src/components/ai/IncidentReportGenerator.jsx` - Added PromptInspector
- `src/components/ai/InvestigationBuilder.jsx` - Added PromptInspector
- `src/components/ai/ApiExplainer.jsx` - Added PromptInspector
- `src/components/ai/LogAnalyzer.jsx` - Added PromptInspector
- `src/pages/AI.jsx` - Updated component props

### Status
✅ **COMPLETE AND DEPLOYED** - All 6 AI tabs now have "Inspect Prompt" functionality

---

## Issue #19: New Cardholders Not Persisting to localStorage (Workflow Bug)
**Date:** January 4, 2026  
**Severity:** High  
**Status:** Fixed  
**Type:** Data Persistence Bug

**Problem:**
- Creating new cardholders through Employee Onboarding workflow resulted in incomplete data
- Cardholder appeared in the UI but with missing fields (e.g., "undefined undefined" for name)
- Access groups assigned in workflow were not saved
- Data was not persisted to localStorage, so refreshing lost the new cardholder

**Symptoms:**
- Created CH-919 through workflow showing:
  - Name: "undefined undefined"
  - Email: Present
  - Phone: N/A
  - Department: Present but other fields missing
  - Status: ERROR
  - Access groups: Missing
- Cardholder existed temporarily but disappeared on page refresh
- Console showed successful API calls but localStorage remained unchanged

**Root Cause:**
The `POST /api/cardholders` endpoint in `apiClient.js` was returning the created cardholder data but **never saving it to localStorage**:

```javascript
// OLD - BROKEN: Data returned but not saved
if (path === '/api/cardholders') {
  return {
    status: 201,
    data: {
      id: `CH-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...body,  // Just spread the body without field mapping
      created_at: new Date().toISOString()
    }
  };
}
```

Two problems:
1. **No localStorage persistence** - Created cardholder was never added to `pacs-cardholders` in localStorage
2. **Incorrect field mapping** - Used `...body` spread which didn't map `firstName` → `first_name`, `lastName` → `last_name`, etc.

**Fix Applied:**
Modified `POST /api/cardholders` handler in `src/utils/apiClient.js`:

```javascript
// NEW - FIXED: Properly save and map fields
if (path === '/api/cardholders') {
  // Load existing cardholders
  const cardholders = JSON.parse(localStorage.getItem('pacs-cardholders') || '[]');
  
  // Create new cardholder with properly mapped fields
  const newCardholder = {
    id: `CH-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    first_name: body.firstName || '',
    last_name: body.lastName || '',
    email: body.email || '',
    phone: body.phone || 'N/A',
    department: body.department || '',
    job_title: body.jobTitle || '',
    division: body.division || 'N/A',
    status: body.authorised ? 'active' : 'inactive',
    access_groups: [],
    hired_date: body.hiredDate || new Date().toISOString().split('T')[0],
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  };
  
  // Add to localStorage
  cardholders.push(newCardholder);
  localStorage.setItem('pacs-cardholders', JSON.stringify(cardholders));
  
  console.log('[API] Created new cardholder:', newCardholder.id);
  
  return {
    status: 201,
    data: newCardholder
  };
}
```

**Files Modified:**
- `src/utils/apiClient.js` - Fixed `POST /api/cardholders` endpoint to:
  - Load existing cardholders from localStorage
  - Map camelCase fields from request body to snake_case for database consistency
  - Set default values for optional fields
  - Save new cardholder to localStorage
  - Return properly formatted cardholder object

**Result:**
- ✅ New cardholders created via workflow are properly saved to localStorage
- ✅ All fields correctly mapped (firstName → first_name, etc.)
- ✅ Names display correctly in UI ("Hayley Fox" instead of "undefined undefined")
- ✅ Access groups persist after being assigned in step 2
- ✅ Cardholder remains in system after page refresh
- ✅ Status badge shows correct color (green for active, red for inactive)

**Testing:**
1. Go to /workflows
2. Start Employee Onboarding workflow
3. Enter first name, last name, department → Create Cardholder
4. Select access groups → Assign Groups
5. Complete workflow
6. Go to /backend/gallagher and verify new cardholder appears with all fields
7. Refresh page → Cardholder still present with correct data
8. Open cardholder detail modal → All fields populated correctly

**Related Issues:**
- Issue #14: Workflow Data Not Persisting to localStorage (similar persistence problem but for workflow step updates, not creation)

---

## Issue #20: AI Page Not Loading Event Data (Data Initialization Bug)
**Date:** January 4, 2026  
**Severity:** High  
**Status:** Fixed  
**Type:** Data Loading/Initialization Bug

**Problem:**
- Natural Language Event Queries tab showed example queries but no actual results/data
- When users tried to query events, they got a message: "No event data is currently loaded"
- The `initializeData()` function was being called but its return value was not being used
- Events were only loaded from localStorage fallback, which might be empty

**Symptoms:**
- AI page loaded with "Try asking:" examples
- User clicks on example or types question
- Response: "⚠️ No event data is currently loaded. Please generate events first..."
- Even though events should have been generated and stored in localStorage
- Other pages (Backend, etc.) could load data correctly

**Root Cause:**
The `AI.jsx` page initialization had a flaw:

```javascript
// PROBLEM: Calling initializeData() but ignoring return value
useEffect(() => {
  const data = initializeData();  // Returns events, doors, etc. but...
  
  // ...immediately tries to load from localStorage instead
  const storedEvents = localStorage.getItem('pacs-events');
  if (storedEvents) {
    setEvents(JSON.parse(storedEvents));
  } else {
    console.log('[AI] No events found in localStorage');  // Falls back to empty
  }
}, []);
```

The `initializeData()` function returns an object with `events`, `doors`, etc. but the code was:
1. Calling the function
2. Discarding its return value
3. Only looking in localStorage afterwards
4. If localStorage was empty, states remained empty

This could happen if:
- User visited AI page before other pages that trigger localStorage initialization
- Browser localStorage quota was exceeded (silently fails)
- First visit to the app (localStorage not yet populated)

**Fix Applied:**
Modified `/opt/physical-security-sandbox/sandbox-frontend/src/pages/AI.jsx` useEffect:

```javascript
useEffect(() => {
  // Initialize and load data
  const data = initializeData();
  
  // Use data from initializeData() first, then try localStorage fallback
  if (data && data.events && data.events.length > 0) {
    setEvents(data.events);
    console.log(`[AI] Loaded ${data.events.length} events from initializeData`);
  } else {
    // Fallback to localStorage
    const storedEvents = localStorage.getItem('pacs-events');
    if (storedEvents) {
      const allEvents = JSON.parse(storedEvents);
      setEvents(allEvents);
      console.log(`[AI] Loaded ${allEvents.length} events from localStorage`);
    } else {
      console.log('[AI] No events found');
    }
  }
  
  // Same pattern for doors, cardholders, cameras
  // Try initializeData() first, then localStorage fallback
  if (data && data.doors && data.doors.length > 0) {
    setDoors(data.doors);
  } else {
    // localStorage fallback...
  }
  
  // etc. for cardholders and cameras
}, []);
```

**Key Changes:**
1. Use the return value from `initializeData()` first
2. Fall back to localStorage only if initializeData() didn't return data
3. Applied to all four data types (events, doors, cardholders, cameras)
4. Added logging to show which source was used

**Result:**
- ✅ AI page now loads events on first visit
- ✅ Example queries appear with actual data to query against
- ✅ Users get responses with real event data immediately
- ✅ No more "No event data" messages for normal usage
- ✅ Works on first visit before other pages are loaded

**Files Modified:**
- `src/pages/AI.jsx` - Fixed useEffect to use initializeData() return value

**Testing:**
1. Open new browser session/incognito window
2. Go directly to https://sandbox.petefox.co.uk/ai
3. Try clicking one of the example queries
4. Get back actual event data (not "No event data" warning)
5. Verify multiple queries work with loaded events

**Related Issues:**
- Issue #6: Backend Dashboard showing no data (similar data loading issue)

---
