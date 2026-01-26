# Agent Code Skills

## Overview

Skills are modular, self-contained knowledge packages that extend an agent's capabilities with specialized domain expertise, workflows, and tool integrations. Think of skills as "onboarding guides" that transform an agent from a general-purpose agent into a specialized agent equipped with procedural knowledge, reference materials, and reusable assets for specific tasks or domains.

Skills enable agents to perform complex, domain-specific operations by providing:

1. **Specialized workflows**: Multi-step procedures for specific domains
2. **Tool integrations**: Instructions for working with specific file formats, APIs, or systems
3. **Domain expertise**: Company-specific knowledge, schemas, business logic, or technical specifications
4. **Bundled resources**: Scripts, references, and assets for complex and repetitive tasks

## Skill Architecture

### Structure

Skills consist of a required `SKILL.md` file and optional bundled resources organized in a specific directory structure:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (required)
│   │   ├── name: (required)
│   │   ├── description: (required)
│   │   ├── license: (optional)
│   │   └── metadata: (optional)
│   └── Markdown body (required)
└── Bundled Resources (optional)
    ├── scripts/      Executable code (Python, Bash, etc.)
    ├── references/   Documentation loaded into context as needed
    └── assets/       Files used in output (templates, icons, etc.)
```

### SKILL.md (Required)

Every skill requires a `SKILL.md` file containing:

#### Frontmatter (YAML)

```yaml
---
name: skill-name
description: Comprehensive description of what the skill does and when to use it. Include both capabilities and specific triggers/contexts.
license: Complete terms in LICENSE.txt (optional)
metadata: (optional)
  author: organization-name
  version: "1.0"
---
```

**Critical fields:**

- `name`: Skill identifier (kebab-case)
- `description`: Primary triggering mechanism - must include:
  - What the skill does
  - When to use it (specific triggers and contexts)
  - Supported operations or workflows

  Example: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. Use when the agent needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"

**Note:** Only `name` and `description` are used by agents to determine skill triggering. All "when to use" information must be in the description, not in the body, as the body is only loaded after the skill triggers.

#### Body (Markdown)

Instructions and guidance for using the skill and its bundled resources. The body is loaded into an agent's context only after the skill triggers based on the description.

**Writing guidelines:**

- Use imperative/infinitive form (e.g., "Execute the script", not "The script is executed")
- Keep under 500 lines to minimize context bloat
- Include only essential procedural instructions
- Reference bundled resources with clear guidance on when to use them
- Prefer concise examples over verbose explanations

### Bundled Resources (Optional)

#### Scripts Directory (`scripts/`)

Executable code for tasks requiring deterministic reliability or repeatedly rewritten logic.

**When to include:**
- Same code pattern is rewritten repeatedly
- Deterministic execution is critical
- Complex operations benefit from tested implementations

**Example:** `scripts/rotate_pdf.py` for PDF rotation operations

**Benefits:**
- Token efficient (may be executed without loading into context)
- Deterministic behavior
- Tested and reliable

**Note:** Scripts may still need to be read by agents for patching or environment-specific adjustments.

#### References Directory (`references/`)

Documentation and reference material loaded into context as needed to inform the process.

**When to include:**
- Documentation that agents should reference while working
- Detailed specifications too large for SKILL.md
- Information needed only in specific scenarios

**Examples:**
- `references/schema.md`: Database schemas and relationships
- `references/api_docs.md`: API specifications
- `references/policies.md`: Company policies
- `references/workflows.md`: Detailed workflow guides

**Benefits:**
- Keeps SKILL.md lean
- Loaded only when agents determine it's needed
- Supports progressive disclosure of information

**Best practices:**
- For large files (>10k words), include grep search patterns in SKILL.md
- Information should live in either SKILL.md or references, not both
- Prefer references for detailed specifications
- Keep only essential procedural instructions in SKILL.md

#### Assets Directory (`assets/`)

Files used in output but not loaded into context.

**When to include:**
- Files that will be copied, modified, or used in final output
- Templates that serve as starting points
- Brand assets, fonts, or media files

**Examples:**
- `assets/logo.png`: Brand assets
- `assets/template.pptx`: PowerPoint templates
- `assets/frontend-template/`: HTML/React boilerplate
- `assets/font.ttf`: Typography files

**Use cases:**
- Templates and boilerplate code
- Images, icons, and media
- Sample documents for modification

**Benefits:**
- Separates output resources from documentation
- Enables agents to use files without context overhead

### What NOT to Include

Skills should contain only essential files supporting their functionality. Do NOT create:

- `INSTALLATION_GUIDE.md`
- `QUICK_REFERENCE.md`
- `CHANGELOG.md`
- User-facing documentation
- Setup and testing procedures

Skills are designed for AI agent consumption, not human onboarding. Auxiliary context about the creation process should be excluded.

## Progressive Disclosure

Skills use a three-level loading system for context efficiency:

```
┌──────────────────────────────────────────┐
│ Level 1: Metadata (Always in context)    │
│ ────────────────────────────────────     │
│ - name: "pdf-editor"                     │
│ - description: "PDF manipulation..."     │
│ Cost: ~100 words                         │
└──────────────────────────────────────────┘
                  ↓
             Skill triggers?
                  ↓
┌──────────────────────────────────────────┐
│ Level 2: SKILL.md Body (On trigger)      │
│ ────────────────────────────────────     │
│ - Core workflows                         │
│ - Essential instructions                 │
│ - Resource references                    │
│ Cost: <5k words                          │
└──────────────────────────────────────────┘
                  ↓
       Specific need identified?
                  ↓
┌──────────────────────────────────────────┐
│ Level 3: Bundled Resources (As needed)   │
│ ────────────────────────────────────     │
│ - references/*.md (loaded into context)  │
│ - scripts/*.py (may execute directly)    │
│ - assets/* (copied to output)            │
│ Cost: Unlimited (scripts execute w/o     │
│       loading into context)              │
└──────────────────────────────────────────┘
```

### Progressive Disclosure Patterns

**Pattern 1: High-level guide with references**

Keep only core workflow and selection guidance in SKILL.md:

```markdown
# PDF Processing

## Quick Start

Extract text with pdfplumber:
[code example]

## Advanced Features

- **Form filling**: See references/forms.md for complete guide
- **API reference**: See references/reference.md for all methods
- **Examples**: See references/examples.md for common patterns
```

Agents load detail files only when needed.

**Pattern 2: Framework selection with variant details**

```markdown
# Frontend Component Builder

## Supported Frameworks

1. React (recommended)
2. Vue
3. Svelte

## Framework-Specific Patterns

For implementation details:
- React: references/react-patterns.md
- Vue: references/vue-patterns.md
- Svelte: references/svelte-patterns.md
```

Load only the relevant framework's patterns.

**Pattern 3: Executable scripts for deterministic operations**

```markdown
# Image Processing

## Rotation

Execute scripts/rotate_image.py:

```bash
python scripts/rotate_image.py --input photo.jpg --angle 90
```

## Compression

Execute scripts/compress_image.py:

```bash
python scripts/compress_image.py --input photo.jpg --quality 85
```
```

Scripts execute without loading into context unless patching is needed.

## Degree of Freedom Principle

Match specificity level to task fragility and variability:

### High Freedom (Text-based instructions)

**Use when:**
- Multiple approaches are valid
- Decisions depend on runtime context
- Heuristics guide the approach

**Example:**
```markdown
## API Integration Strategy

1. Analyze API documentation to identify endpoints
2. Choose authentication method based on available options
3. Implement error handling for common failure modes
4. Add retry logic for transient failures
```

### Medium Freedom (Pseudocode with parameters)

**Use when:**
- Preferred pattern exists but variation is acceptable
- Configuration affects behavior
- Some flexibility benefits different scenarios

**Example:**
```markdown
## Database Query Pattern

```typescript
type QueryOptions = {
  table: string;
  filters: Record<string, unknown>;
  limit?: number;
};

const query = (options: QueryOptions) => {
  // 1. Build WHERE clause from filters
  // 2. Apply LIMIT if specified
  // 3. Execute query with parameterized values
  // 4. Return typed results
};
```
```

### Low Freedom (Specific scripts, few parameters)

**Use when:**
- Operations are fragile and error-prone
- Consistency is critical
- Specific sequence must be followed

**Example:**
```markdown
## PDF Form Filling

Always use scripts/fill_pdf_form.py:

```bash
python scripts/fill_pdf_form.py \
  --template template.pdf \
  --data data.json \
  --output filled.pdf
```

Do not attempt manual form filling - the script handles field mapping, data validation, and proper PDF structure preservation.
```

**Think of agents exploring a path:** A narrow bridge with cliffs needs specific guardrails (low freedom), while an open field allows many routes (high freedom).

## Development Workflow

### Step 1: Understanding Concrete Examples

Skip only when usage patterns are already clearly understood.

Establish clear examples of how the skill will be used. Relevant questions:

- What functionality should the skill support?
- Can you provide examples of how this skill would be used?
- What would a user say that should trigger this skill?
- Are there other ways you imagine this skill being used?

Conclude when there's clear understanding of supported functionality.

### Step 2: Planning Reusable Contents

Analyze each example by:

1. Consider execution approach from scratch
2. Identify helpful scripts, references, and assets for repeated execution

**Examples:**

**PDF Editor Skill:**
```
Query: "Help me rotate this PDF"
Analysis:
  1. Rotating PDF requires rewriting the same code each time
  2. scripts/rotate_pdf.py would store this logic
```

**Frontend Webapp Builder Skill:**
```
Query: "Build me a todo app"
Analysis:
  1. Frontend apps require same boilerplate HTML/React each time
  2. assets/hello-world/ template would provide boilerplate
```

**BigQuery Skill:**
```
Query: "How many users logged in today?"
Analysis:
  1. Querying requires rediscovering table schemas each time
  2. references/schema.md would document schemas and relationships
```

### Step 3: Initialize Skill Structure

Use the `init_skill.py` script to generate template:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

The script creates:
- Skill directory at specified path
- SKILL.md template with proper frontmatter and TODO placeholders
- Example resource directories: `scripts/`, `references/`, `assets/`
- Example files in each directory for customization

After initialization, customize or remove generated files as needed.

### Step 4: Edit the Skill

Remember the skill is for another agent instance to use. Include information beneficial and non-obvious to an agent.

#### Learn Proven Patterns

Consult established patterns:

- **Multi-step processes**: See references/workflows.md for sequential workflows and conditional logic
- **Specific output formats**: See references/output-patterns.md for template and example patterns

#### Start with Bundled Resources

Implement reusable resources first: scripts, references, and assets.

**Testing requirements:**
- Test all added scripts by execution
- Verify output matches expectations
- For many similar scripts, test representative sample

Delete unused example files created by initialization.

#### Update SKILL.md

##### Frontmatter

Write YAML with `name` and `description`:

```yaml
---
name: skill-name
description: |
  Comprehensive description including:
  - What the skill does
  - When to use it (specific triggers)
  - Supported operations
---
```

Include all "when to use" information in description - the body is loaded only after triggering.

##### Body

Write instructions for using the skill and bundled resources:

- Use imperative form
- Keep under 500 lines
- Reference bundled resources clearly
- Provide examples where helpful
- Focus on essential procedural knowledge

### Step 5: Package the Skill

Create distributable `.skill` file with validation:

```bash
scripts/package_skill.py <path/to/skill-folder>
```

Optional output directory:

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

The packaging script:

1. **Validates** the skill:
   - YAML frontmatter format and required fields
   - Naming conventions and directory structure
   - Description completeness and quality
   - File organization and resource references

2. **Packages** if validation passes:
   - Creates `.skill` file (zip with `.skill` extension)
   - Names file after skill (e.g., `my-skill.skill`)
   - Includes all files with proper structure

If validation fails, fix errors and rerun.

### Step 6: Iterate

After testing, users may request improvements.

**Iteration workflow:**

1. Use skill on real tasks
2. Notice struggles or inefficiencies
3. Identify SKILL.md or resource updates needed
4. Implement changes and test again

## Best Practices

### Context Economy

The context window is shared with system prompt, conversation history, other skills' metadata, and user requests.

**Default assumption:** Agents are already very smart.

Challenge each piece of information:
- "Does the agent really need this explanation?"
- "Does this paragraph justify its token cost?"

Prefer concise examples over verbose explanations.

### Description Quality

The description field is the primary triggering mechanism.

**Requirements:**
- Include what the skill does
- List specific triggers and contexts
- Mention supported operations
- Be comprehensive - this determines when skill loads

**Poor description:**
```yaml
description: Helps with documents
```

**Good description:**
```yaml
description: |
  Comprehensive document creation, editing, and analysis with support for
  tracked changes, comments, formatting preservation, and text extraction.
  Use when working with professional documents (.docx files) for:
  (1) Creating new documents, (2) Modifying or editing content,
  (3) Working with tracked changes, (4) Adding comments, or any other
  document tasks.
```

### File Organization

**SKILL.md content:**
- Essential procedural instructions
- Core workflow guidance
- References to bundled resources
- When to use different resources

**References content:**
- Detailed specifications
- API documentation
- Schemas and data models
- Extended examples
- Detailed workflow guides

**Rule:** Information lives in either SKILL.md or references, not both.

### Script Development

**When to include scripts:**
- Same code pattern repeatedly rewritten
- Deterministic behavior critical
- Complex error-prone operations

**Testing requirements:**
- Execute scripts to verify functionality
- Check output against expectations
- Test edge cases and error conditions

**Script documentation in SKILL.md:**
```markdown
## PDF Rotation

Execute scripts/rotate_pdf.py:

```bash
python scripts/rotate_pdf.py --input file.pdf --angle 90 --output rotated.pdf
```

Parameters:
- `--input`: Input PDF file path
- `--angle`: Rotation angle (90, 180, 270)
- `--output`: Output file path
```

### Large Reference Files

For files >10k words, provide search patterns in SKILL.md:

```markdown
## Company Policies

See references/policies.md for complete documentation.

**Quick search patterns:**
- Remote work policy: `grep -n "remote work" references/policies.md`
- Expense reporting: `grep -n "expense" references/policies.md`
- PTO guidelines: `grep -n "time off\|PTO" references/policies.md`
```

## Common Patterns

### Pattern: Database Schema Reference

```
database-skill/
├── SKILL.md
│   ## Overview
│   Query company database with proper joins and filters.
│
│   ## Schema Reference
│   See references/schema.md for complete table definitions.
│
│   ## Query Patterns
│   [common query examples]
└── references/
    └── schema.md
        - Table definitions
        - Column types
        - Relationships
        - Indexes
```

### Pattern: Multi-Framework Support

```
frontend-skill/
├── SKILL.md
│   ## Supported Frameworks
│   - React (recommended)
│   - Vue
│   - Svelte
│
│   ## Framework Selection
│   Choose based on project requirements.
│
│   ## Implementation Details
│   - React: references/react.md
│   - Vue: references/vue.md
│   - Svelte: references/svelte.md
└── references/
    ├── react.md
    ├── vue.md
    └── svelte.md
```

### Pattern: Template-Based Output

```
report-skill/
├── SKILL.md
│   ## Report Generation
│   1. Copy template from assets/template.docx
│   2. Fill in sections with data
│   3. Apply formatting from references/style-guide.md
└── assets/
    └── template.docx
```

### Pattern: Deterministic Operations

```
image-skill/
├── SKILL.md
│   ## Image Operations
│
│   All operations use scripts for consistent results:
│
│   - Rotation: scripts/rotate.py
│   - Compression: scripts/compress.py
│   - Conversion: scripts/convert.py
│
│   [usage examples for each script]
└── scripts/
    ├── rotate.py
    ├── compress.py
    └── convert.py
```

## Skill Triggering

Skills trigger based on the `description` field in frontmatter. Agents evaluate all skill descriptions against user requests to determine relevance.

### Triggering Behavior

```
User Request
     ↓
Compare against all skill descriptions
     ↓
Match found? ──[No]──→ Proceed without skill
     ↓
   [Yes]
     ↓
Load SKILL.md body into context
     ↓
Execute according to instructions
     ↓
Load bundled resources as needed
```

### Optimization Tips

**Make descriptions specific:**
- Include file extensions: "...when working with .docx files..."
- Mention operations: "...for creating, editing, and analyzing..."
- List triggers: "Use when (1) creating documents, (2) modifying content..."

**Avoid generic descriptions:**
- ❌ "Helps with documents"
- ✅ "Document creation and editing for .docx files with tracked changes, comments, and formatting preservation"

## Advanced Topics

### Multi-Skill Coordination

Skills can reference each other when workflows span domains:

```markdown
## Image Processing with Storage

1. Process image using image-processing skill
2. Upload result to cloud storage using cloud-storage skill
3. Generate shareable link

See cloud-storage skill for upload documentation.
```

### Conditional Resource Loading

Guide agents on when to load specific resources:

```markdown
## Advanced Configuration

For basic usage, follow the Quick Start section above.

Load references/advanced-config.md only when:
- Custom authentication is required
- Advanced filtering is needed
- Performance optimization is critical
```

### Performance Considerations

**Minimize SKILL.md size:**
- Keep under 500 lines when possible
- Split detailed content into references
- Use concise examples

**Optimize resource organization:**
- Group related scripts together
- Combine related reference documents
- Avoid duplication across files

**Script execution:**
- Scripts can execute without loading into context
- Reduces token usage for deterministic operations
- Prefer scripts for repeated, complex logic

### Error Handling in Skills

**SKILL.md guidance:**
```markdown
## Error Handling

When script execution fails:

1. Check error message in script output
2. Verify input file format matches requirements
3. Consult references/troubleshooting.md for common issues
4. Fall back to manual implementation if script unavailable
```

**Script design:**
- Return clear error messages
- Validate inputs before processing
- Exit with non-zero codes on failure
- Log diagnostic information

## References

For detailed guidance and advanced patterns:

- Workflow patterns: Check skill references for established patterns
- Output patterns: Consult skills for template and example patterns

## Contributing

When creating new skills:

1. Follow the skill specification format exactly
2. Test scripts thoroughly before packaging
3. Provide comprehensive examples in SKILL.md
4. Organize bundled resources clearly
5. Write detailed descriptions for triggering
6. Keep SKILL.md under 500 lines
7. Reference bundled resources explicitly
8. Validate with packaging script before distribution
