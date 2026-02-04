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

# Part 2

# OAuth 2.0 Implementation: TikTok Ads Manager

**Architecture**
Implemented **Authorization Code Flow with PKCE** (Proof Key for Code Exchange) to ensure secure authentication without exposing client secrets in the browser.

**✅ What Works**
* **Security:** `pkce.js` successfully generates and validates S256 cryptographic keys.
* **State Management:** Token persistence (`storage.js`) and session verification are unit-tested.
* **Flow:** The frontend correctly constructs the parameterized Auth URL and handles the callback logic.

**❌ Challenges (Infrastructure)**
* **Localhost Restriction:** TikTok’s API rejects `localhost` as a Redirect URI, blocking standard local development.
* **Static URL Failure:** Attempting to redirect to a live site (e.g., GitHub) failed because the local app could not intercept the authorization code.
* **Solution:** Requires **HTTPS Tunneling (ngrok)** to provide the compliant public URL needed to complete the handshake locally.

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

# Part 5 - Error Handlings


# Notes

