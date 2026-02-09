# Part 1 - Project SetUp

## 📁 Project Structure

```bash
api/                # Serverless OAuth logic
public/             # Static assets

src/
├── assets/styles/  # Global & theme CSS
├── components/     # Reusable UI components
├── pages/          # App routes (Home, OAuth callback, tests)
├── services/       # API & business logic
├── utils/          # Helpers (PKCE, storage)
├── App.jsx         # Root component
└── main.jsx        # App entry point

.env.local          # Environment variables
vite.config.js      # Vite config
vercel.json         # Vercel deployment
```

## ▶️ How to Run the Project

This is a **Vite + React** application that uses **OAuth authentication** and includes an **Ad Creation Form**.

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup
```bash
npm install
npm run dev

```
## Part 2 — OAuth 2.0 Integration (TikTok Ads Manager)

### Overview
Implemented **OAuth 2.0 Authorization Code Flow with PKCE (S256)** to securely authenticate users with TikTok Ads Manager in a frontend-only setup, without exposing client secrets.

### What’s Implemented
- **PKCE Security:** Cryptographically secure `code_verifier` and `code_challenge` generation.
- **OAuth Flow:** Auth request → TikTok consent → callback handling → token exchange → auth persistence.
- **Token Handling:** Mocked async token exchange to simulate real backend behavior.
- **Auth State:** Access token persisted client-side; authenticated UI survives refresh.

### Development Constraint & Solution
- **Constraint:** TikTok does not allow `localhost` as a redirect URI.
- **Solution:** Used **ngrok (HTTPS tunneling)** to expose the local app and complete the OAuth handshake on a compliant public origin.

### Result
A complete, production-aligned OAuth PKCE flow with clear separation of concerns, secure handling, and realistic development constraints.


# Part 3

* **Ad Service:** Simulates async submission with **1.5s latency** and enforces business logic (e.g., "Conversions" objective requires Music).
* **Chaos Testing:** Randomly triggers **403 Geo-blocking errors** (20% chance) to test frontend error resilience.
* **Music Service:** Handles asynchronous field-level validation (e.g., checking Music IDs while typing).

# Part 4 - AdForm Implementation Approach


### 1. State Management
* **Nested Object State:** Use a single state object for form fields to maintain a "Single Source of Truth," facilitating easier data mapping for API submission.
* **Async Status Tracking:** Implement a discrete state machine (`idle` | `loading` | `valid` | `error`) specifically for the Music ID validation to manage UI feedback independently of the main form.

### 2. Validation Logic
* **Two-Tier Validation:** * **Synchronous:** Check field lengths and required values.
    * **Conditional:** Enforce business rules (e.g., if `objective === 'Conversions'`, then `music.mode` cannot be `none`).
* **Error Mapping:** Store errors in a keyed object (`errors.field`) to enable field-specific UI messaging.

### 3. User Experience (UX)
* **Reactive UI:** Disable invalid options (like "No Music") dynamically based on the selected objective.
* **System Error Handling:** Use a "Global Banner" for non-input errors (Auth, Permissions, Geo-fencing) to distinguish between user mistakes and system limitations.

### 4. API Submission
* **Request Sanitization:** Transform the UI state (nested music object) into the flat structure required by the `submitAd` service.
* **Loading Guards:** Disable the submit button during `isSubmitting` and `musicStatus === 'loading'` to prevent duplicate entries and race conditions.

# Notes

