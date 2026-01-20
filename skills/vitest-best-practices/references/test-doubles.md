# 1.6 Test Doubles

Prefer in this order:
1. **Fakes**: Lightweight in-memory implementations
2. **Stubs**: Pre-configured responses
3. **Spies/Mocks**: Interaction verification (last resort)

Avoid over-mocking:
- Only mock what you don't control (third-party libraries, networks, file systems)
- Don't mock pure functions or internal helpers
- Don't mock our own code
- Prefer record/replay frameworks over manual mocking
