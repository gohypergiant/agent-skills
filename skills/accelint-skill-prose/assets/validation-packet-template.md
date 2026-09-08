# Validation packet template

Create this per invocation after Step 6. It is an immutable Step 7 input, not a mandatory rubric reference for isolated reviewers.

```md
## Validation packet
- Packet ID: [stable identifier]
- Original baseline: [snapshot identifier or checksum]
- Rewritten artifact set: [snapshot identifier or checksum]

### Changed sections
- Path: [exact path]
  - Location: [heading or Step]
  - Original excerpt: [verbatim]
  - Original identifier: [checksum or stable identifier]
  - Rewritten excerpt: [verbatim]
  - Rewritten identifier: [checksum or stable identifier]

### Unchanged artifacts
- Path: [exact path]
  - Identifier: [checksum or stable identifier]
```

A validator claim must identify the packet, artifact version (`original` or `rewritten`), path, heading or Step, verbatim quote, and the claim supported. Verify every claim against this packet before accepting the validation record.
