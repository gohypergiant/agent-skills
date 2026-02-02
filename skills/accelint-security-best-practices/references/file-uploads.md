# File Upload Security

Never accept file uploads without validation. Malicious file uploads enable remote code execution, XSS attacks, denial of service, and data breaches.

## Why This Matters

Insecure file uploads enable:
- **Remote Code Execution**: Upload executable files (PHP, JSP, shell scripts) that run on server
- **XSS Attacks**: Upload HTML/SVG files with malicious JavaScript
- **Path Traversal**: Overwrite system files using ../ in filenames
- **Denial of Service**: Upload massive files to exhaust disk space
- **Malware Distribution**: Upload viruses that infect other users

For web applications, uploading a PHP shell to a public directory grants attacker full server access. A single unvalidated file upload can compromise entire infrastructure.

## Anti-Patterns to Avoid

### ❌ NEVER: Trust File Extensions

```typescript
import multer from 'multer';

// ❌ NEVER: Validate only file extension
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file!;

  // ❌ Only checks extension
  if (!file.originalname.endsWith('.jpg')) {
    return res.status(400).json({ error: 'Only JPG files' });
  }

  // Attacker bypass: shell.php.jpg or shell.jpg (actually PHP file)
  // File extension doesn't guarantee file type!
});

// ❌ NEVER: Trust client-provided MIME type
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file!;

  // ❌ Client controls mimetype header
  if (file.mimetype !== 'image/jpeg') {
    return res.status(400).json({ error: 'Only JPEG images' });
  }

  // Attacker sends: Content-Type: image/jpeg with PHP shell
});
```

**Risk:** Critical - Executable files uploaded, remote code execution

---

### ❌ NEVER: Store Files with User-Provided Names

```typescript
import multer from 'multer';
import path from 'path';

// ❌ NEVER: Use original filename
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    // CRITICAL: Uses user filename directly!
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Attacker payloads:
// - "../../etc/passwd" (path traversal, overwrites system file)
// - "shell.php" (executable in uploads directory)
// - "index.html" (overwrites legitimate files)
// - "<script>alert(1)</script>.jpg" (XSS in filename)
```

**Risk:** Critical - Path traversal, arbitrary file write, code execution

---

### ❌ NEVER: Allow Unlimited File Sizes

```typescript
// ❌ NEVER: No size limits
const upload = multer({ dest: 'uploads/' }); // No limits!

app.post('/api/upload', upload.single('file'), async (req, res) => {
  // Attacker uploads 10GB file, exhausts disk space
  // Application crashes, legitimate uploads fail
});
```

**Risk:** High - Denial of service, disk exhaustion

---

### ❌ NEVER: Serve Uploaded Files Directly

```typescript
import express from 'express';

// ❌ NEVER: Serve upload directory as static files
app.use('/uploads', express.static('uploads'));

// If uploads/ contains shell.php, attacker accesses:
// https://yourdomain.com/uploads/shell.php
// PHP executes, attacker has remote shell!

// ❌ NEVER: Send uploaded files without Content-Disposition
app.get('/files/:filename', (req, res) => {
  res.sendFile(`uploads/${req.params.filename}`);
  // HTML files execute JavaScript in user's browser
  // SVG files can contain malicious scripts
});
```

**Risk:** Critical - Code execution, XSS attacks on other users

---

### ❌ NEVER: Skip Virus Scanning

```typescript
// ❌ NEVER: Accept files without malware scanning
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file!;

  // No virus scanning!
  // Store file, serve to other users
  await saveFile(file);

  // Attacker uploads ransomware, other users download and execute
});
```

**Risk:** High - Malware distribution, user devices compromised

---

## Correct Patterns

### ✅ ALWAYS: Validate File Type by Magic Bytes

```typescript
import multer from 'multer';
import fileType from 'file-type';
import fs from 'fs/promises';

// ✅ Validate file type by content (magic bytes)
async function validateFileType(
  filePath: string,
  allowedTypes: string[]
): Promise<boolean> {
  const buffer = await fs.readFile(filePath);

  // ✅ Detect actual file type from content
  const type = await fileType.fromBuffer(buffer);

  if (!type) {
    return false; // Unknown file type
  }

  // ✅ Check against whitelist
  return allowedTypes.includes(type.mime);
}

// ✅ Strict validation
const upload = multer({
  dest: 'uploads/temp/', // Temporary location
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;

  try {
    // ✅ Whitelist allowed MIME types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    // ✅ Validate file type by magic bytes
    const isValid = await validateFileType(file.path, allowedTypes);

    if (!isValid) {
      await fs.unlink(file.path); // Delete invalid file
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // ✅ Generate safe filename
    const safeFilename = `${crypto.randomUUID()}.${
      (await fileType.fromFile(file.path))!.ext
    }`;

    // ✅ Move to permanent location
    await fs.rename(file.path, `uploads/images/${safeFilename}`);

    res.json({
      message: 'File uploaded',
      filename: safeFilename,
    });
  } catch (error) {
    // Clean up on error
    await fs.unlink(file.path).catch(() => {});
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

**Benefit:** Validates actual file content, not just extension or client-provided type

---

### ✅ ALWAYS: Generate Random Filenames

```typescript
import { randomUUID } from 'crypto';
import path from 'path';

// ✅ Generate cryptographically secure random filenames
const storage = multer.diskStorage({
  destination: 'uploads/temp/',
  filename: (req, file, cb) => {
    // ✅ Random UUID filename (no user input)
    const safeFilename = `${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, safeFilename);
  },
});

const upload = multer({ storage });

// ✅ Store original filename in database separately
interface FileMetadata {
  id: string;
  storageFilename: string; // Random UUID
  originalFilename: string; // User-provided (for display only)
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file!;

  // ✅ Sanitize original filename for display
  const sanitizedOriginalName = file.originalname
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace unsafe chars
    .substring(0, 255); // Limit length

  const metadata: FileMetadata = {
    id: randomUUID(),
    storageFilename: file.filename, // Random UUID
    originalFilename: sanitizedOriginalName,
    mimeType: file.mimetype,
    size: file.size,
    uploadedBy: req.user!.userId,
    uploadedAt: new Date(),
  };

  await db.files.create({ data: metadata });

  res.json({
    fileId: metadata.id,
    filename: metadata.originalFilename,
  });
});
```

**Benefit:** Prevents path traversal, filename conflicts, predictable filenames

---

### ✅ ALWAYS: Enforce Size Limits at Multiple Layers

```typescript
import multer from 'multer';

// ✅ Configure multer with strict limits
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 1, // Only 1 file per request
    fields: 10, // Max form fields
    parts: 20, // Max parts in multipart
  },
  fileFilter: (req, file, cb) => {
    // ✅ Early rejection of disallowed types
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }

    cb(null, true);
  },
});

// ✅ Additional size validation
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file!;

  // ✅ Double-check size (defense in depth)
  const MAX_SIZE = 5 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    await fs.unlink(file.path);
    return res.status(400).json({ error: 'File too large' });
  }

  // Process file...
});

// ✅ Global payload size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
```

**Benefit:** Multiple layers prevent DoS via oversized uploads

---

### ✅ ALWAYS: Serve Files with Safe Headers

```typescript
import path from 'path';

// ✅ Serve uploaded files with security headers
app.get('/api/files/:fileId', authenticate, async (req, res) => {
  const { fileId } = req.params;

  const file = await db.files.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  // ✅ Authorization check
  if (file.uploadedBy !== req.user!.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // ✅ Set secure headers
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${file.originalFilename}"` // Force download
  );
  res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME sniffing
  res.setHeader('Content-Security-Policy', "default-src 'none'"); // No scripts

  // ✅ Stream file
  const filePath = path.join('uploads/images', file.storageFilename);
  res.sendFile(filePath);
});

// ✅ For inline display (images), use restrictive CSP
app.get('/api/images/:fileId', async (req, res) => {
  const { fileId } = req.params;

  const file = await db.files.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  // ✅ Only allow image display
  if (!file.mimeType.startsWith('image/')) {
    return res.status(400).json({ error: 'Not an image' });
  }

  // ✅ Inline but with CSP
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'");

  const filePath = path.join('uploads/images', file.storageFilename);
  res.sendFile(filePath);
});
```

**Benefit:** Forces download for executable types, prevents XSS from uploaded files

---

### ✅ ALWAYS: Store Files Outside Web Root

```typescript
// ✅ Store uploads outside publicly accessible directory
// Project structure:
// /var/www/app/
//   ├── public/          (web root, served by nginx)
//   ├── src/
//   └── uploads/         (OUTSIDE web root)
//      └── files/

// ❌ NEVER: uploads inside public/
// /var/www/app/public/uploads/  (❌ directly accessible)

// ✅ Serve files through application logic
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'files');

app.get('/api/download/:fileId', authenticate, async (req, res) => {
  const { fileId } = req.params;

  // ✅ Authorization check
  const file = await db.files.findUnique({
    where: { id: fileId },
  });

  if (!file || !canAccessFile(req.user, file)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // ✅ File served through application, not static server
  const filePath = path.join(UPLOAD_DIR, file.storageFilename);
  res.sendFile(filePath);
});

// ✅ Nginx configuration (DO NOT serve uploads directly)
/*
location /uploads {
  deny all;  # Prevent direct access
}

location /api {
  proxy_pass http://localhost:3000;  # Application handles file serving
}
*/
```

**Benefit:** All file access goes through application authentication/authorization

---

### ✅ ALWAYS: Scan Files for Malware

```typescript
import { NodeClam } from 'clamscan';

// ✅ Configure ClamAV scanner
const clam = new NodeClam({
  clamdscan: {
    host: process.env.CLAMAV_HOST || 'localhost',
    port: 3310,
  },
});

async function scanFile(filePath: string): Promise<boolean> {
  try {
    const { isInfected, viruses } = await clam.isInfected(filePath);

    if (isInfected) {
      console.warn('Malware detected', {
        file: filePath,
        viruses,
        timestamp: new Date().toISOString(),
      });

      // ✅ Delete infected file immediately
      await fs.unlink(filePath);

      return false; // Infected
    }

    return true; // Clean
  } catch (error) {
    console.error('Virus scan failed', error);
    // ✅ Fail closed: reject file if scan fails
    return false;
  }
}

// ✅ Scan during upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file!;

  try {
    // ✅ Validate file type
    const isValidType = await validateFileType(file.path, allowedTypes);

    if (!isValidType) {
      await fs.unlink(file.path);
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // ✅ Scan for malware
    const isClean = await scanFile(file.path);

    if (!isClean) {
      // File already deleted by scanFile
      return res.status(400).json({ error: 'Malware detected' });
    }

    // Move to permanent location...
  } catch (error) {
    await fs.unlink(file.path).catch(() => {});
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

**Benefit:** Prevents malware distribution, protects other users

---

### ✅ ALWAYS: Implement Upload Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// ✅ Rate limit file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour per user
  keyGenerator: (req) => req.user?.userId || req.ip,
  message: 'Too many uploads, please try again later',
});

// ✅ Per-user storage quota
async function checkStorageQuota(
  userId: string,
  fileSize: number
): Promise<boolean> {
  const userFiles = await db.files.findMany({
    where: { uploadedBy: userId },
  });

  const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);

  const QUOTA = 100 * 1024 * 1024; // 100MB per user

  return totalSize + fileSize <= QUOTA;
}

app.post('/api/upload',
  authenticate,
  uploadLimiter,
  upload.single('file'),
  async (req, res) => {
    const file = req.file!;
    const userId = req.user!.userId;

    // ✅ Check quota
    if (!(await checkStorageQuota(userId, file.size))) {
      await fs.unlink(file.path);
      return res.status(403).json({ error: 'Storage quota exceeded' });
    }

    // Process file...
  }
);
```

**Benefit:** Prevents abuse, disk exhaustion, controls costs

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] File type validated by magic bytes (not extension)
- [ ] Random UUIDs used for storage filenames
- [ ] Original filenames sanitized before display
- [ ] File size limits enforced (5-10MB typical)
- [ ] Upload rate limiting per user/IP
- [ ] Storage quotas per user implemented
- [ ] Files stored outside web root directory
- [ ] Content-Disposition: attachment for downloads
- [ ] X-Content-Type-Options: nosniff header set
- [ ] CSP header prevents script execution from uploads
- [ ] Malware scanning configured (ClamAV or similar)
- [ ] Authorization checks before file access
- [ ] Path traversal prevention (no user input in paths)
- [ ] Executable extensions blocked (.php, .jsp, .sh, .exe)
- [ ] SVG files sanitized if allowed (remove scripts)
