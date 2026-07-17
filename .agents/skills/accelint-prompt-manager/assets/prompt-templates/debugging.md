# Debugging Template

Use for: Error investigation, bug fixing, root cause analysis, troubleshooting.

## Structure

```
Debug this issue: [SYMPTOM_DESCRIPTION]

Expected behavior: [What should happen]
Actual behavior: [What's happening instead]

Error messages:
[Paste exact error text, stack traces, or relevant log lines]

Environment:
- [Language/framework versions]
- [Operating system]
- [Relevant configuration]
- [Recent changes that might be related]

Steps to reproduce:
1. [Action 1]
2. [Action 2]
3. [Observe: actual behavior]

Already tried:
- [Attempt 1]: [Result]
- [Attempt 2]: [Result]

Investigation approach:
1. Reproduce the issue reliably
2. Isolate the root cause (narrow down to specific code/config)
3. Form hypothesis about why it's failing
4. Test hypothesis with targeted changes
5. Implement fix with rationale
6. Verify fix resolves issue without introducing regressions

Success criteria:
✓ Root cause identified and understood
✓ Fix resolves issue in all reproduction cases
✓ No regressions (existing functionality still works)
✓ Add test case to prevent future regression
```

## Example Usage

```
Debug login failure occurring only on mobile browsers.

Expected behavior:
- User enters valid credentials
- Clicks "Login" button
- Redirected to dashboard with authenticated session

Actual behavior:
- User enters valid credentials
- Clicks "Login" button
- Loading spinner shows briefly
- Login fails silently (no error message)
- User remains on login screen

Error messages:
[Browser console, iOS Safari]
"SecurityError: The operation is insecure."
at saveAuthToken (auth.js:42)

[No server-side errors logged]

Environment:
- Frontend: React 18, running on Vite 4
- Occurs on: iOS Safari 16+, Android Chrome 110+
- Does NOT occur on: Desktop browsers (any)
- Started: After deployment on 2024-03-15
- Affects: ~15% of mobile users

Steps to reproduce:
1. Open site on iPhone Safari
2. Navigate to /login
3. Enter credentials: test@example.com / password123
4. Tap "Login" button
5. Observe: login fails silently, console shows SecurityError

Already tried:
- Verified API returns 200 OK with valid token: ✓ Works correctly
- Checked CORS headers: ✓ Properly configured
- Tested on desktop: ✓ Works fine
- Rolled back recent frontend changes: ✗ Issue persists

Investigation approach:
1. Reproduce issue in mobile browser dev tools
2. Identify exact line causing SecurityError (auth.js:42)
3. Research SecurityError in mobile browser context
   → Hypothesis: localStorage access restricted in iOS Safari private mode or cross-origin iframe
4. Check if we're saving to localStorage vs cookies
   → Finding: Using localStorage.setItem('authToken', token)
5. Test: Switch from localStorage to httpOnly cookies
6. Verify: Login works on mobile after cookie-based auth

Root cause: iOS Safari blocks localStorage in certain contexts (cross-origin iframes, private browsing). Desktop browsers more permissive.

Fix: Replace localStorage with httpOnly cookies for auth tokens
- More secure anyway (XSS protection)
- Works across all browsers and modes
- Server-side change needed: set cookie on login response

Success criteria:
✓ Mobile users can log in successfully
✓ Desktop users unaffected (existing sessions preserved)
✓ Security improved (httpOnly cookies vs localStorage)
✓ Add mobile browser test to prevent regression
```

## Common Pitfalls

- **Vague symptoms:** "It's broken" → Describe exact observable behavior
- **Missing environment details:** Can't reproduce without knowing context
- **No investigation plan:** Random attempts waste time, systematic approach faster
- **Stopping at fix:** Without understanding root cause, likely to recur
