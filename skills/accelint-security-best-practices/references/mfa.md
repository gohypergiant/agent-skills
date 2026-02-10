# Multi-Factor Authentication (MFA)

Implement multi-factor authentication for enhanced security. MFA adds a second verification factor beyond passwords, significantly reducing account takeover risk.

**MFA Library Examples**: This document uses common MFA patterns. Apply to your MFA solution: speakeasy (TOTP), otplib, @otplib/preset-default, or third-party services (Auth0, Clerk, AWS Cognito, Firebase Auth). Principles apply universally across MFA implementations.

## Why This Matters

MFA protects against:
- **Credential Stuffing**: Stolen passwords from data breaches cannot access accounts alone
- **Phishing**: Even if users enter passwords on fake sites, attacker still needs second factor
- **Brute Force**: Password alone insufficient, exponentially increases attack difficulty
- **Keyloggers**: Malware capturing passwords cannot access accounts without second factor
- **Social Engineering**: Attacker convincing user to reveal password still blocked by MFA

Without MFA, a single leaked password compromises the account. With MFA, attacker needs both password AND physical device/authenticator app. Success rate of account compromise drops by 99.9% with MFA enabled.

## Anti-Patterns to Avoid

### ❌ NEVER: Use SMS as Only MFA Method

```typescript
// ❌ NEVER: SMS-only MFA (vulnerable to SIM swapping)
async function sendSMSCode(phoneNumber: string, code: string) {
  await smsProvider.send({
    to: phoneNumber,
    message: `Your code: ${code}`,
  });

  // ❌ SMS can be intercepted:
  // - SIM swapping attacks
  // - SS7 protocol vulnerabilities
  // - Social engineering against carrier
}
```

**Risk:** High - SIM swapping attacks bypass SMS-based MFA

---

### ❌ NEVER: Use Short or Predictable MFA Codes

```typescript
// ❌ NEVER: 4-digit codes (too short)
function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
  // Only 10,000 possibilities, brute forceable
}

// ❌ NEVER: Sequential or predictable codes
function generateCode(): string {
  return String(lastCode + 1).padStart(6, '0');
  // Attacker can predict next code
}
```

**Risk:** Medium - Brute force attacks succeed with enough attempts

---

### ❌ NEVER: Allow Unlimited MFA Code Attempts

```typescript
// ❌ NEVER: No rate limiting on MFA verification
app.post('/api/verify-mfa', async (req, res) => {
  const { userId, code } = req.body;

  const storedCode = await db.mfaCodes.findUnique({
    where: { userId },
  });

  if (storedCode?.code === code) {
    // Login successful
  }

  // ❌ No rate limiting!
  // Attacker can try all 1,000,000 six-digit codes
});
```

**Risk:** High - Brute force attacks succeed with automated tools

---

### ❌ NEVER: Store MFA Secrets in Plain Text

```typescript
// ❌ NEVER: Plain text TOTP secrets
await db.users.update({
  where: { id: userId },
  data: {
    totpSecret: 'JBSWY3DPEHPK3PXP', // Plain text!
  },
});

// If database leaked, attacker generates valid codes
```

**Risk:** Critical - Database breach compromises all MFA secrets

---

### ❌ NEVER: Skip MFA for "Trusted" Devices Without Re-Verification

```typescript
// ❌ NEVER: Permanent trusted device bypass
app.post('/api/login', async (req, res) => {
  const { email, password, deviceId } = req.body;

  const user = await validateUser(email, password);

  // ❌ Trusted device skips MFA forever
  const trustedDevice = await db.trustedDevices.findFirst({
    where: { userId: user.id, deviceId },
  });

  if (trustedDevice) {
    // No MFA required!
    return login(user);
  }

  // Attacker steals deviceId, bypasses MFA permanently
});
```

**Risk:** High - Device compromise provides permanent MFA bypass

---

## Correct Patterns

### ✅ ALWAYS: Implement TOTP (Time-Based One-Time Password)

```typescript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

// ✅ Generate TOTP secret
async function generateTOTPSecret(userId: string) {
  const secret = speakeasy.generateSecret({
    name: `YourApp (${await getUserEmail(userId)})`,
    issuer: 'YourApp',
    length: 32, // 256-bit secret
  });

  // ✅ Encrypt secret before storing
  const encryptedSecret = encrypt(secret.base32);

  await db.users.update({
    where: { id: userId },
    data: {
      totpSecret: encryptedSecret.encrypted,
      totpSecretIv: encryptedSecret.iv,
      totpSecretTag: encryptedSecret.tag,
      mfaEnabled: false, // Not enabled until verified
    },
  });

  // ✅ Generate QR code for user to scan
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    secret: secret.base32, // Show once for manual entry
    qrCode: qrCodeUrl,
  };
}

// ✅ Enable MFA (requires verification)
app.post('/api/mfa/enable', authenticate, async (req, res) => {
  const userId = req.user!.userId;

  const { secret, qrCode } = await generateTOTPSecret(userId);

  res.json({
    secret, // User scans QR or enters secret in authenticator app
    qrCode,
    message: 'Scan QR code and verify with code to enable MFA',
  });
});

// ✅ Verify TOTP code to complete MFA setup
app.post('/api/mfa/verify-setup', authenticate, async (req, res) => {
  const { code } = req.body;
  const userId = req.user!.userId;

  const user = await db.users.findUnique({
    where: { id: userId },
  });

  if (!user?.totpSecret) {
    return res.status(400).json({ error: 'MFA not initiated' });
  }

  // ✅ Decrypt secret
  const decryptedSecret = decrypt(
    user.totpSecret,
    user.totpSecretIv!,
    user.totpSecretTag!
  );

  // ✅ Verify code
  const isValid = speakeasy.totp.verify({
    secret: decryptedSecret,
    encoding: 'base32',
    token: code,
    window: 1, // Allow 1 step before/after (30 seconds)
  });

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  // ✅ Enable MFA
  await db.users.update({
    where: { id: userId },
    data: { mfaEnabled: true },
  });

  // ✅ Generate backup codes
  const backupCodes = await generateBackupCodes(userId);

  res.json({
    message: 'MFA enabled successfully',
    backupCodes, // Show once, user must save
  });
});
```

**Benefit:** Industry-standard TOTP, works with Google Authenticator, Authy, etc.

---

### ✅ ALWAYS: Require MFA Code During Login

```typescript
// ✅ Two-step login process
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.users.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // ✅ Check if MFA enabled
  if (user.mfaEnabled) {
    // ✅ Generate temporary session for MFA verification
    const tempToken = jwt.sign(
      { userId: user.id, mfaPending: true },
      process.env.JWT_SECRET!,
      { expiresIn: '5m' } // Short-lived, only for MFA verification
    );

    return res.json({
      mfaRequired: true,
      tempToken,
    });
  }

  // MFA not enabled, complete login
  const token = generateAccessToken(user);
  setAuthCookie(res, token);

  res.json({ message: 'Login successful' });
});

// ✅ Verify MFA code
const mfaVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  keyGenerator: (req) => req.body.tempToken || req.ip,
});

app.post('/api/login/verify-mfa', mfaVerifyLimiter, async (req, res) => {
  const { tempToken, code } = req.body;

  try {
    // ✅ Verify temp token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET!) as {
      userId: string;
      mfaPending: boolean;
    };

    if (!decoded.mfaPending) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const user = await db.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user?.mfaEnabled || !user.totpSecret) {
      return res.status(400).json({ error: 'MFA not configured' });
    }

    // ✅ Decrypt TOTP secret
    const secret = decrypt(
      user.totpSecret,
      user.totpSecretIv!,
      user.totpSecretTag!
    );

    // ✅ Verify TOTP code
    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!isValid) {
      // ✅ Try backup codes
      const backupCodeValid = await verifyBackupCode(user.id, code);

      if (!backupCodeValid) {
        return res.status(401).json({ error: 'Invalid code' });
      }
    }

    // ✅ MFA verified, complete login
    const accessToken = generateAccessToken(user);
    setAuthCookie(res, accessToken);

    // ✅ Log successful MFA login
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'MFA_LOGIN',
        ipAddress: req.ip,
        timestamp: new Date(),
      },
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

**Benefit:** MFA enforced at login, rate limited to prevent brute force

---

### ✅ ALWAYS: Generate and Validate Backup Codes

```typescript
import crypto from 'crypto';

// ✅ Generate backup codes
async function generateBackupCodes(userId: string): Promise<string[]> {
  const codes: string[] = [];
  const hashedCodes: Array<{ hash: string; used: boolean }> = [];

  // ✅ Generate 10 backup codes
  for (let i = 0; i < 10; i++) {
    // ✅ Cryptographically secure random code
    const code = crypto
      .randomBytes(4)
      .toString('hex')
      .toUpperCase()
      .match(/.{1,4}/g)!
      .join('-'); // Format: XXXX-XXXX

    codes.push(code);

    // ✅ Hash before storing
    const hash = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    hashedCodes.push({ hash, used: false });
  }

  // ✅ Store hashed codes
  await db.users.update({
    where: { id: userId },
    data: {
      backupCodes: JSON.stringify(hashedCodes),
    },
  });

  return codes; // Return plaintext once for user to save
}

// ✅ Verify backup code
async function verifyBackupCode(
  userId: string,
  code: string
): Promise<boolean> {
  const user = await db.users.findUnique({
    where: { id: userId },
  });

  if (!user?.backupCodes) {
    return false;
  }

  const backupCodes: Array<{ hash: string; used: boolean }> = JSON.parse(
    user.backupCodes
  );

  // ✅ Hash provided code
  const codeHash = crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');

  // ✅ Find matching unused code
  const codeIndex = backupCodes.findIndex(
    (bc) => bc.hash === codeHash && !bc.used
  );

  if (codeIndex === -1) {
    return false; // Code not found or already used
  }

  // ✅ Mark code as used
  backupCodes[codeIndex].used = true;

  await db.users.update({
    where: { id: userId },
    data: {
      backupCodes: JSON.stringify(backupCodes),
    },
  });

  // ✅ Alert user backup code was used
  await sendEmail(user.email, {
    subject: 'Backup code used',
    body: 'A backup code was used to access your account. If this was not you, secure your account immediately.',
  });

  return true;
}
```

**Benefit:** Users can regain access if they lose authenticator app

---

### ✅ ALWAYS: Implement Trusted Device Management

```typescript
// ✅ Trusted device with expiration
interface TrustedDevice {
  id: string;
  userId: string;
  deviceFingerprint: string;
  deviceName: string;
  ipAddress: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date;
}

// ✅ Generate device fingerprint
function generateDeviceFingerprint(req: Request): string {
  const data = [
    req.headers['user-agent'],
    req.ip,
    req.headers['accept-language'],
    req.headers['accept-encoding'],
  ].join('|');

  return crypto.createHash('sha256').update(data).digest('hex');
}

// ✅ Remember device after successful MFA
app.post('/api/login/verify-mfa', mfaVerifyLimiter, async (req, res) => {
  const { tempToken, code, rememberDevice } = req.body;

  // ... verify MFA code ...

  if (rememberDevice) {
    const deviceFingerprint = generateDeviceFingerprint(req);

    // ✅ Create trusted device (expires in 30 days)
    await db.trustedDevices.create({
      data: {
        userId: user.id,
        deviceFingerprint,
        deviceName: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Complete login...
});

// ✅ Check trusted device during login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await validateUser(email, password);

  if (user.mfaEnabled) {
    const deviceFingerprint = generateDeviceFingerprint(req);

    // ✅ Check if device is trusted and not expired
    const trustedDevice = await db.trustedDevices.findFirst({
      where: {
        userId: user.id,
        deviceFingerprint,
        expiresAt: { gt: new Date() },
      },
    });

    if (trustedDevice) {
      // ✅ Update last used
      await db.trustedDevices.update({
        where: { id: trustedDevice.id },
        data: { lastUsedAt: new Date() },
      });

      // ✅ Skip MFA for trusted device
      const token = generateAccessToken(user);
      setAuthCookie(res, token);

      return res.json({ message: 'Login successful' });
    }

    // Not trusted device, require MFA
    return res.json({ mfaRequired: true, tempToken: generateTempToken(user) });
  }

  // MFA not enabled...
});

// ✅ List trusted devices
app.get('/api/mfa/trusted-devices', authenticate, async (req, res) => {
  const devices = await db.trustedDevices.findMany({
    where: {
      userId: req.user!.userId,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      deviceName: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  res.json(devices);
});

// ✅ Revoke trusted device
app.delete('/api/mfa/trusted-devices/:deviceId', authenticate, async (req, res) => {
  const { deviceId } = req.params;

  await db.trustedDevices.deleteMany({
    where: {
      id: deviceId,
      userId: req.user!.userId,
    },
  });

  res.json({ message: 'Device revoked' });
});
```

**Benefit:** Balance security and usability, users can revoke compromised devices

---

### ✅ ALWAYS: Provide MFA Recovery Options

```typescript
// ✅ Disable MFA (requires current password + MFA code)
app.post('/api/mfa/disable', authenticate, async (req, res) => {
  const { password, code } = req.body;
  const userId = req.user!.userId;

  const user = await db.users.findUnique({
    where: { id: userId },
  });

  // ✅ Verify password
  if (!(await bcrypt.compare(password, user!.password))) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // ✅ Verify MFA code
  const secret = decrypt(
    user!.totpSecret!,
    user!.totpSecretIv!,
    user!.totpSecretTag!
  );

  const isValid = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid MFA code' });
  }

  // ✅ Disable MFA
  await db.users.update({
    where: { id: userId },
    data: {
      mfaEnabled: false,
      totpSecret: null,
      totpSecretIv: null,
      totpSecretTag: null,
      backupCodes: null,
    },
  });

  // ✅ Revoke all trusted devices
  await db.trustedDevices.deleteMany({
    where: { userId },
  });

  // ✅ Alert user
  await sendEmail(user!.email, {
    subject: 'MFA disabled',
    body: 'Multi-factor authentication has been disabled on your account.',
  });

  res.json({ message: 'MFA disabled' });
});

// ✅ Account recovery (when MFA device lost)
app.post('/api/account-recovery', async (req, res) => {
  const { email } = req.body;

  // ✅ Always return success (don't reveal if email exists)
  res.json({
    message: 'If account exists, recovery email sent',
  });

  const user = await db.users.findUnique({
    where: { email },
  });

  if (!user) {
    return; // Email doesn't exist
  }

  // ✅ Generate secure recovery token
  const recoveryToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto
    .createHash('sha256')
    .update(recoveryToken)
    .digest('hex');

  await db.users.update({
    where: { id: user.id },
    data: {
      recoveryTokenHash: tokenHash,
      recoveryTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  // ✅ Send recovery email
  await sendEmail(user.email, {
    subject: 'Account Recovery',
    body: `Reset your account: https://yourdomain.com/account-recovery?token=${recoveryToken}`,
  });
});
```

**Benefit:** Users can recover access without compromising security

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] TOTP implementation using standard library (speakeasy)
- [ ] MFA secrets encrypted before storing in database
- [ ] QR codes generated for easy setup
- [ ] MFA required during login (two-step process)
- [ ] Rate limiting on MFA verification (5 attempts per 15 min)
- [ ] Backup codes generated (10 codes, hashed before storage)
- [ ] Backup codes marked as used after first use
- [ ] Trusted device management with expiration (30 days)
- [ ] Users can view and revoke trusted devices
- [ ] MFA disable requires password + current MFA code
- [ ] Account recovery process for lost MFA device
- [ ] Audit logging for MFA events (enable, disable, login)
- [ ] Email notifications for security events
- [ ] SMS MFA available but not sole option (if supported)
- [ ] Window of 1-2 time steps for TOTP validation (30-60 seconds)
