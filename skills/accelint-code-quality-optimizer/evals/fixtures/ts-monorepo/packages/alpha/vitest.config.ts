import { defineConfig } from "vitest/config";

export default defineConfig({ test: { clearMocks: true, mockReset: true, restoreMocks: true } });
