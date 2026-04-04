# Backend note: profile persistence (`GET/PATCH /me`)

**Audience:** backend developers maintaining the auth / user API consumed by the DataPlus (dy3) frontend.

## What the frontend does today

- **Profile page:** `dplus_frontend-devServer/src/pages/Profile.jsx`
- **API helpers:** `dplus_frontend-devServer/src/store/actions/auth-actions.js`

On **Save**:

1. The full user object (including `avatar` as a **base64 data URL** when the user picks an image) is written to **`localStorage`** under the `user` key. This always works in the browser, so **refresh on the same device** will still show the last saved values even if the server call fails.

2. The app then calls **`PATCH /me`** with a JSON body containing (when present):  
   `name`, `fullName`, `username`, `email`, `phone`, `title`, and optionally **`avatar`**.

3. After a successful PATCH (HTTP 2xx), the client dispatches **`GET /me`** again to merge the server user into Redux + `localStorage`.

On **load / login**, **`GET /me`** is used to load menu + user; the response’s `user` object is merged into the existing `localStorage` user.

## Problems (backend / contract side)

### 1. Large profile photos are not always sent to the server

In `auth-actions.js`, **`avatar` is omitted from the PATCH body** if its string length exceeds **`MAX_AVATAR_PATCH_LENGTH` (80,000 characters)**. This was added to avoid gateway / body-size limits when sending huge base64 strings in JSON.

**Symptom:** User uploads a high-resolution image → it appears after save (localStorage) on that browser, but **does not persist for other devices or after re-login from server truth** because the backend never received it.

**Fix options (pick one or combine):**

- Raise the acceptable JSON body limit on the API gateway and Flask/Werkzeug (and document a safe max).
- Prefer **`multipart/form-data`** upload, e.g. `POST /me/avatar` or `PATCH /me` with `multipart`, store the file in object storage (S3, etc.), and return a **stable HTTPS URL**; frontend then saves the URL in `user.avatar` instead of base64.
- Or accept base64 only up to N KB and return **400** with a clear message so the UI can ask the user to use a smaller image (frontend can be updated to match).

### 2. `PATCH /me` may be missing, incomplete, or failing in some environments

If PATCH returns non-2xx or is not implemented, the UI shows a message like **saved on this device only**. That indicates **server persistence is not working** for that deployment.

**Fix:** Implement (or repair) **`PATCH /me`** so it:

- Accepts the fields the frontend sends (see list above).
- Persists them on the user record (database).
- Returns the updated user (or ensures **`GET /me`** reflects changes immediately after).

Document the canonical field names and validation rules (email format, unique username, etc.).

### 3. Password change is not integrated with the backend yet

The Profile UI can collect current/new password, but the frontend **does not send password updates** to a dedicated endpoint yet (user messaging in-app reflects this).

**Fix:** Expose a secure endpoint (e.g. **`POST /me/password`** or OAuth-provider flow) with current-password verification, rate limiting, and policy (length, complexity). Then the frontend can call it explicitly on Save when password fields are filled.

## Quick checklist for backend devs

| Item | Action |
|------|--------|
| Avatar persistence | Support smaller JSON base64 **or** add file upload + URL storage; align max size with gateway. |
| Profile fields | Ensure `PATCH /me` persists `name`, `fullName`, `username`, `email`, `phone`, `title`, `avatar` as applicable. |
| Read after write | Ensure `GET /me` returns updated profile after PATCH. |
| Password | Add documented password-change API; coordinate with frontend to wire it. |

## Reference (frontend)

- `saveProfile` → `PATCH` body construction and avatar length guard:  
  `dplus_frontend-devServer/src/store/actions/auth-actions.js` (`MAX_AVATAR_PATCH_LENGTH`, `saveProfile`, `fetchMe`).
- Profile form + local save:  
  `dplus_frontend-devServer/src/pages/Profile.jsx`.

If the real `/me` implementation lives in another repository, copy or link this note there so gateway and API limits stay aligned with the SPA.
