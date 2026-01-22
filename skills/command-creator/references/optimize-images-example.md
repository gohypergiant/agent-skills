---
description: Compress and resize images in a directory while preserving quality
argument-hint: [input-dir] [--output output-dir] [--quality N] [--max-width N]
---

# optimize-images

Batch process images with compression and resizing while maintaining visual quality. Supports JPEG, PNG, WebP, and GIF formats with configurable quality and dimension constraints.

## Arguments

- `input` (directory, required): Directory containing images to optimize
  - Must exist and be readable
  - Will recursively scan for image files
  - Example: `./photos` or `src/assets/images`

- `output` (directory, optional, default: `{input}/optimized`): Output directory for processed images
  - Created automatically if doesn't exist
  - Preserves subdirectory structure from input
  - Example: `./web-ready` or `dist/images`

- `--quality` (number, optional, default: 85): Compression quality percentage
  - Validation: Must be between 1 and 100
  - Lower values = smaller files but reduced quality
  - Recommended: 80-90 for web, 90-95 for print

- `--max-width` (number, optional, default: 1920): Maximum width in pixels
  - Images wider than this will be resized proportionally
  - Height automatically calculated to maintain aspect ratio
  - Use 0 to disable resizing

- `--format` (string, optional, default: "preserve"): Output format conversion
  - Validation: Must be one of: preserve, jpeg, png, webp
  - `preserve`: Keep original format
  - `jpeg`: Convert all to JPEG
  - `png`: Convert all to PNG
  - `webp`: Convert all to WebP (best compression)

## Workflow

### Phase 1: Discovery and Validation

1. Validate input directory exists and is accessible

2. Scan directory recursively for image files:
   - Supported extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
   - Case-insensitive matching
   - Skip hidden files and directories

3. Validate/create output directory:
   - If output directory doesn't exist, create it
   - Verify write permissions
   - Preserve subdirectory structure from input

4. Report discovered files count and total size

### Phase 2: Image Processing

For each discovered image:

1. **Load and validate**:
   - Read image file
   - Parse format and dimensions
   - Validate image is not corrupted

2. **Resize if needed**:
   - If width > `--max-width`, calculate new dimensions
   - Maintain aspect ratio
   - Use high-quality resampling algorithm (Lanczos3)

3. **Format conversion**:
   - If `--format` is not "preserve", convert to target format
   - Apply format-specific optimization settings

4. **Compress**:
   - Apply quality setting from `--quality` flag
   - Use optimized encoding parameters for each format
   - Strip unnecessary metadata (EXIF, color profiles) unless critical

5. **Save**:
   - Write to output directory preserving relative path
   - Use original filename unless format changed (update extension)
   - Verify write succeeded

6. **Track statistics**:
   - Original size
   - Optimized size
   - Compression ratio
   - Processing time

### Phase 3: Report Generation

Generate comprehensive report with:
- Per-file processing results
- Aggregate statistics
- Size reduction metrics
- Performance metrics

### Error Handling

- **Invalid input directory**: Exit with error message and code 1
- **No images found**: Warn user and exit with code 2
- **Output directory creation fails**: Exit with error and code 1
- **Corrupted image file**: Skip file, log error, continue processing
- **Insufficient disk space**: Exit with error and code 1
- **Permission errors**: Skip file, log warning, continue processing

## Statistics Reporting

The command outputs detailed statistics in multiple dimensions:

### File-Level Statistics
- Total images processed (by format: JPEG, PNG, WebP, GIF)
- Successfully optimized count vs errors/skipped
- Processing throughput (images/second)

### Size Reduction Statistics
- Total input size (MB)
- Total output size (MB)
- Total saved (MB and percentage)
- Average compression ratio
- Best/worst compression per file

### Performance Statistics
- Total processing time
- Average time per image
- Slowest file to process

### Example Output Structure
```
=== Optimization Complete ===

Processed 47 images in 12.4s (3.8 images/sec)

Format breakdown:
- JPEG: 32 files (68.1%)
- PNG: 12 files (25.5%)
- WebP: 3 files (6.4%)

Size reduction:
- Input:  24.8 MB
- Output:  8.3 MB
- Saved: 16.5 MB (66.5% reduction)

Average compression: 3.0:1

Top space savers:
1. IMG_2048.jpg: 2.4 MB → 0.6 MB (75% reduction)
2. photo_large.png: 1.8 MB → 0.5 MB (72% reduction)
3. banner.jpg: 1.2 MB → 0.4 MB (67% reduction)

Files requiring attention:
- corrupted_image.png: Skipped (corrupted file)
```

## Examples

### Example 1: Optimize Current Directory with Defaults

```bash
$ claude optimize-images ./photos
```

**Output:**
```
Discovering images in ./photos...
Found 47 images (24.8 MB total)

Processing images...
[========================================] 47/47 (100%)

=== Optimization Complete ===

Processed 47 images in 12.4s (3.8 images/sec)

Format breakdown:
- JPEG: 32 files (68.1%)
- PNG: 12 files (25.5%)
- WebP: 3 files (6.4%)

Size reduction:
- Input:  24.8 MB
- Output:  8.3 MB
- Saved: 16.5 MB (66.5% reduction)

Results saved to: ./photos/optimized/
```

### Example 2: High-Quality Resize with Custom Output

```bash
$ claude optimize-images ./raw --output ./web-ready --quality 90 --max-width 2560
```

**Output:**
```
Discovering images in ./raw...
Found 23 images (52.3 MB total)

Processing images with settings:
- Quality: 90%
- Max width: 2560px
- Output: ./web-ready

Processing images...
[========================================] 23/23 (100%)

=== Optimization Complete ===

Processed 23 images in 8.7s (2.6 images/sec)

Format breakdown:
- JPEG: 20 files (87.0%)
- PNG: 3 files (13.0%)

Size reduction:
- Input:  52.3 MB
- Output: 31.8 MB
- Saved: 20.5 MB (39.2% reduction)

Note: Reduced compression ratio due to high quality setting (90%)

Results saved to: ./web-ready/
```

### Example 3: Convert All to WebP

```bash
$ claude optimize-images ./photos --format webp --quality 85
```

**Output:**
```
Discovering images in ./photos...
Found 47 images (24.8 MB total)

Processing images with settings:
- Converting to: WebP
- Quality: 85%
- Max width: 1920px (default)

Processing images...
[========================================] 47/47 (100%)

=== Optimization Complete ===

Processed 47 images in 15.2s (3.1 images/sec)

Format conversion:
- JPEG → WebP: 32 files
- PNG → WebP: 12 files
- WebP → WebP: 3 files

Size reduction:
- Input:  24.8 MB
- Output:  6.1 MB
- Saved: 18.7 MB (75.4% reduction)

WebP achieved superior compression compared to original formats.

Results saved to: ./photos/optimized/
```

### Example 4: No Resize, Just Compress

```bash
$ claude optimize-images ./screenshots --max-width 0 --quality 80
```

**Output:**
```
Discovering images in ./screenshots...
Found 12 PNG screenshots (8.4 MB total)

Processing images with settings:
- Quality: 80%
- Resizing: Disabled (max-width=0)

Processing images...
[========================================] 12/12 (100%)

=== Optimization Complete ===

Processed 12 images in 2.1s (5.7 images/sec)

Format breakdown:
- PNG: 12 files (100%)

Size reduction:
- Input:  8.4 MB
- Output:  5.2 MB
- Saved: 3.2 MB (38.1% reduction)

All images kept original dimensions.

Results saved to: ./screenshots/optimized/
```

## Implementation Notes

### Image Processing Library

Use Sharp for Node.js (fast, supports all formats):

```javascript
const sharp = require('sharp');

async function optimizeImage(inputPath, outputPath, options) {
  const { quality, maxWidth, format } = options;

  let pipeline = sharp(inputPath);

  // Get metadata for resize decision
  const metadata = await pipeline.metadata();

  // Resize if needed
  if (maxWidth > 0 && metadata.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, {
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true
    });
  }

  // Format conversion and compression
  switch (format === 'preserve' ? metadata.format : format) {
    case 'jpeg':
    case 'jpg':
      pipeline = pipeline.jpeg({
        quality,
        mozjpeg: true  // Use mozjpeg for better compression
      });
      break;
    case 'png':
      pipeline = pipeline.png({
        quality,
        compressionLevel: 9,
        adaptiveFiltering: true
      });
      break;
    case 'webp':
      pipeline = pipeline.webp({
        quality,
        effort: 6  // 0-6, higher = better compression but slower
      });
      break;
  }

  // Save
  await pipeline.toFile(outputPath);
}
```

### Directory Traversal

Use recursive file discovery:

```javascript
const fs = require('fs').promises;
const path = require('path');

async function findImages(directory, extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']) {
  const images = [];

  async function traverse(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        await traverse(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  }

  await traverse(directory);
  return images;
}
```

### Progress Bar

Display real-time progress:

```javascript
function updateProgress(current, total) {
  const percentage = Math.floor((current / total) * 100);
  const barLength = 40;
  const filled = Math.floor((current / total) * barLength);
  const bar = '='.repeat(filled) + ' '.repeat(barLength - filled);

  process.stdout.write(`\r[${bar}] ${current}/${total} (${percentage}%)`);

  if (current === total) {
    process.stdout.write('\n');
  }
}
```

### Size Formatting

Human-readable file sizes:

```javascript
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
```

### Exit Codes

- `0`: Successful optimization (all images processed)
- `1`: Fatal error (invalid directory, permissions, disk space)
- `2`: No images found in input directory
- `3`: Partial success (some images failed, but others succeeded)
