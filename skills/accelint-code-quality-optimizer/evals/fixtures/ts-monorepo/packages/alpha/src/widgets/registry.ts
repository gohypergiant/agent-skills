// Every widget module is loaded by Vite's import.meta.glob, never imported by name.
export const widgets = import.meta.glob("./*.widget.tsx");
