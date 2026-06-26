# 🚀 AdaptiveScan Website Scratchpad & System Overview

This scratchpad provides a visual walkthrough and structural blueprint of the **AdaptiveScan** Offensive Surface & VAPT Assessment Platform.

---

## 🛠️ Git & CI Status: Resolved & Pushed
We successfully resolved the `AttributeError: 'Finding' object has no attribute 'affected_asset'` CI issue:
* **Root Cause:** The `Finding` model in `backend/detection/base_detector.py` uses `@dataclass(slots=True)`. The `affected_asset` attribute was referenced in the scanner engine but not declared in the slots definition.
* **Fix:** Added `affected_asset: str | None = None` to `Finding` dataclass and implemented `hasattr` checks in the backend parser `backend/core/scanner_engine.py`.
* **Git Actions:** Staged, committed, and pushed changes directly to `main` on your remote repository:
  ```bash
  git push origin main
  # Successfully pushed to https://github.com/anmoliot/web-vuln-scanner.git
  ```

---

## 🏗️ System Architecture & Flow

```
UI [React/Vite Frontend] <-->|JSON REST & WebSockets| API [FastAPI Backend Server]
API <-->|SQL queries| DB [(SQLite Database)]
API -->|Offensive Recon| Recon [SPA-Aware Crawler]
API -->|Vulnerability Probes| Engine [Scanner Engine]
Engine -->|Plugin Architecture| Detectors [SQLi, XSS, NoSQL, Auth Bypass, IDOR]
Engine -->|Validation| Val [Finding Validator]
Engine -->|Output| Rep [Evidence & PDF/HTML Reports]
```

---

## 🔑 Access Credentials & Tech Stack

### Authentication

* **Flow:** Multi-factor authentication fallback configured with secure JWT session tokens (HS256).

### Technology Stack Highlights
* **Core:** Python, FastAPI, SQLite (PostgreSQL compatible)
* **Frontend:** React 19, Vite, custom CSS design tokens (Cyberpunk-dark styling, custom hardware-accelerated micro-cursors, and glassmorphic dashboards)
* **Testing:** Pytest with fully patched asynchronous loop handlers

---

## 📂 Active Routes Map

| Page Identifier | Sidebar Nav Link | Purpose |
| --- | --- | --- |
| `marketing` | N/A (Landing Page) | Marketing home page, product positioning, and auth gateway |
| `dashboard` | Dashboard | Consolidated threat score, KPI trackers, and live attack surface widgets |
| `scan` | Scan / Trigger Scan | Start new automated SPA-aware crawler & vulnerability scans |
| `findings` | Vulnerabilities | High/Medium/Low findings inventory with code snippets & remediation tips |
| `assets` | Asset Inventory | Track hosts, protocols, and exposures across scanned endpoints |
| `apis` | API Security | REST & GraphQL schema structure and coverage tracking |
| `telemetry` | Telemetry | Real-time WebSocket connection status and diagnostic metrics |
| `settings` | Settings | Profile, organization, tenant configs, and workspace keys |
