# Target conventions
The pattern `<area>.<component>.<intent>` is used for `target` values. 

- area (controlled list): see `target-vocabulary.ts` for the canonical list
- component (controlled list): see `target-vocabulary.ts` for the canonical list
- intent: noun, lowercase, multi‑word joined with dashes (no verbs)

Area and component selection rules:
- If an area/component keyword appears explicitly in the AC (e.g., "header" for area, "input" for component), use that keyword.
- If multiple keywords appear, choose the one that appears first in the corresponding controlled list.
- If no keyword appears, use the fallback keyword (last item) from the corresponding controlled list.

Intent selection rules:
- Use the semantic intent or destination implied by the AC.
- Prefer the shortest unique noun phrase that captures what the user is trying to reach/do.
- If the AC names a label and it matches the intent, use the label text (lowercased/dashed).
- If two elements in the same area/component would share the same intent, add the smallest clarifying noun (e.g., `settings-profile` vs `settings-security`).

Examples:
- `nav.link.settings`
- `form.input.email-address`
- `toast.text.success`
