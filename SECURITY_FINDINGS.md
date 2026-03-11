# Security Findings

## Fixed in this patch

1. **Privilege escalation via user-controlled `role` during registration** (High)
   - Previously, `/auth/register` accepted a `role` value from user input and stored it directly.
   - An attacker could self-register as `officer` and gain permission to issue fines and query license records.
   - **Fix**: registration now forces all self-registered users to `driver`.

2. **Insecure default JWT secret fallback** (High)
   - The API previously used a hardcoded fallback secret (`secret123`) when `JWT_SECRET` was missing.
   - This enables token forgery in misconfigured deployments.
   - **Fix**: removed fallback and fail closed with server misconfiguration errors when `JWT_SECRET` is not set.

3. **Sensitive data exposure in auth responses** (Medium)
   - Register/login responses returned the full `user` document, including hashed password.
   - While hashed, this is still sensitive and unnecessary exposure.
   - **Fix**: both register/login now return only safe user fields.

4. **User enumeration via login error messages** (Medium)
   - The API returned distinct messages for unknown email (`404 User not found`) vs wrong password.
   - This allows attackers to confirm valid accounts.
   - **Fix**: login now returns a unified `Invalid email or password` message.

5. **IDOR in fine payment endpoint** (High)
   - `/fines/pay/:fineId` previously updated by `fineId` only.
   - Any authenticated user could pay (modify) another user's fine by guessing IDs.
   - **Fix**: pay operation is now scoped to `{ _id: fineId, userId: req.user.id }` and returns 404 if no owned fine is found.

6. **Missing input validation for `fineId` route param** (Low)
   - `fineId` was not validated as a MongoDB ObjectId before use.
   - **Fix**: added route validation using `express-validator`.

7. **Password hash exposure in license lookup response** (High)
   - `/license/lookup/:idNumber` returned the full `user` document, which could include hashed password data.
   - The response was also cached, extending persistence of sensitive fields in memory.
   - **Fix**: license lookup now selects only `name`, `email`, `idNumber`, and `role` from the user record.

8. **Weak amount validation for fine issuance** (Medium)
   - Fine amount previously accepted any numeric value, including `0` or negatives.
   - This allowed invalid records and potential abuse of enforcement workflows.
   - **Fix**: `/fines/issue` now requires `amount > 0`.

## Additional risks still present (not changed)

1. **Token stored in `localStorage` in frontend** (Medium)
   - A successful XSS could exfiltrate bearer tokens.
   - Consider migrating auth tokens to secure, httpOnly cookies and adopting CSRF protection.

2. **Permissive CORS defaults** (Low/Contextual)
   - Server currently enables CORS without an origin allowlist.
   - Consider restricting origins via environment configuration in production.
