# Edge Cases: Portfolio to Core Migration

This document catalogs known patterns for handling portfolio-specific dependencies during Core migration. Add entries as you encounter new patterns.

## How to Use This File

**During Phase 2 (Research)**: Load this file to identify known portfolio → Core equivalents
**During Phase 3 (Design)**: Reference these patterns when adapting portfolio features
**When adding entries**: Use the template structure shown in the commented examples below

---

## Known Dependency Patterns

<!-- TEMPLATE EXAMPLE - UI Component Libraries
### UI Component Libraries

#### Pattern: Portfolio Custom Button
- **Portfolio uses**: Custom Button from `@portfolio/components`
- **Core equivalent**: `@core/design-system/Button`
- **Migration steps**:
  1. Replace import: `import { Button } from '@portfolio/components'` → `import { Button } from '@core/design-system'`
  2. Check prop compatibility - Core Button uses `variant` instead of `theme`
  3. Update prop mappings: `theme="primary"` → `variant="primary"`
- **Why this matters**: Portfolio Button has different prop API than Core
- **Test**: Import in a portfolio project and verify visual consistency

#### Pattern: Portfolio Dialog Component
- **Portfolio uses**: `@portfolio/components/Dialog` with `isOpen` prop
- **Core equivalent**: `@core/design-system/Modal` with `open` prop
- **Migration steps**:
  1. Replace Dialog with Modal component
  2. Rename `isOpen` → `open`
  3. Update close handler prop name if different
- **Why this matters**: Different component names and prop APIs
- **Test**: Open/close behavior works in portfolio integration
-->

<!-- TEMPLATE EXAMPLE - Routing Libraries
### Routing Libraries

#### Pattern: React Router Version Mismatch
- **Portfolio uses**: react-router v5
- **Core uses**: react-router v6
- **Migration steps**:
  1. Replace `<Switch>` with `<Routes>`
  2. Replace `<Route>` children prop with `element` prop
  3. Update `useHistory` → `useNavigate`
  4. Remove exact prop (default in v6)
- **Why this matters**: Breaking changes between v5 and v6
- **Test**: All routes navigate correctly, nested routes work

#### Pattern: Custom Router Wrapper
- **Portfolio uses**: Custom `PortfolioRouter` wrapper with auth checks
- **Core equivalent**: None - implement as middleware or route guard pattern
- **Migration steps**:
  1. Extract auth logic from PortfolioRouter
  2. Implement using Core's standard route guard pattern
  3. Apply to protected routes in Core
- **Why this matters**: Portfolio-specific abstraction doesn't belong in Core
- **Test**: Auth redirects work, unauthorized access blocked
-->

<!-- TEMPLATE EXAMPLE - State Management
### State Management

#### Pattern: Portfolio-Specific Redux Slice
- **Portfolio uses**: Custom Redux slice with portfolio business logic
- **Core equivalent**: None - need to extract reusable pieces only
- **Migration steps**:
  1. Identify truly generic state (e.g., UI state, feature flags)
  2. Create new Core slice with ONLY generic state
  3. Leave portfolio-specific business logic in portfolio
  4. Document what portfolios need to implement themselves
- **Why this matters**: Core shouldn't contain portfolio business logic
- **Test**: Portfolio can compose Core slice with their own state

#### Pattern: Context API Usage
- **Portfolio uses**: `PortfolioSettingsContext` for app-wide config
- **Core equivalent**: `@core/context/SettingsContext` with different shape
- **Migration steps**:
  1. Map portfolio settings shape to Core settings shape
  2. Update consumer components to use Core context API
  3. Provide migration guide for portfolio developers
- **Why this matters**: Different context shapes require careful mapping
- **Test**: Settings propagate correctly to components
-->

<!-- TEMPLATE EXAMPLE - Map/Geospatial Libraries
### Map/Geospatial Libraries

#### Pattern: Custom Deck.gl Layer
- **Portfolio uses**: `PortfolioCustomLayer` extending Deck.gl Layer class
- **Core equivalent**: Extract generic parts to `@core/map-layers/CustomLayer`
- **Migration steps**:
  1. Identify portfolio-specific rendering logic vs. generic layer behavior
  2. Extract generic layer orchestration to Core
  3. Keep portfolio-specific shaders/rendering in portfolio
  4. Create props API for portfolios to inject custom behavior
- **Why this matters**: Layer implementation is often portfolio-specific
- **Test**: Portfolio can use Core layer with custom rendering injected

#### Pattern: Map Data Source
- **Portfolio uses**: Hardcoded API endpoint in map component
- **Core equivalent**: Accept data source as prop/config
- **Migration steps**:
  1. Replace hardcoded URL with prop: `dataSource: string | DataSourceConfig`
  2. Update component to accept external data source
  3. Document required data shape for portfolios
- **Why this matters**: Core components must not hardcode portfolio URLs
- **Test**: Multiple portfolios can use with different data sources
-->

<!-- TEMPLATE EXAMPLE - Build/Tooling
### Build/Tooling

#### Pattern: Custom Webpack Config
- **Portfolio uses**: Portfolio-specific webpack plugins
- **Core uses**: Standard Core build configuration
- **Migration steps**:
  1. Identify which webpack customizations are truly needed
  2. If needed for Core feature, add to Core's webpack config
  3. If portfolio-specific, document as portfolio build requirement
  4. Ensure Core feature works with standard Core build
- **Why this matters**: Core features shouldn't require custom builds
- **Test**: Core feature builds successfully with standard Core webpack

#### Pattern: Package.json Dependencies
- **Portfolio uses**: Specific library version (e.g., lodash@4.17.15)
- **Core uses**: Different version or alternative library
- **Migration steps**:
  1. Check if Core already has the library (use Core's version)
  2. If missing, evaluate if Core should add it or use alternative
  3. Update imports to use Core's preferred library
  4. Test for breaking changes if version differs
- **Why this matters**: Avoid dependency conflicts and duplication
- **Test**: Feature works with Core's dependency versions
-->

---

## Adding New Patterns

When you encounter a new portfolio → Core migration pattern:

1. **Identify the pattern**: What portfolio-specific thing are you replacing?
2. **Find Core equivalent**: What does Core have? Nothing? Different version?
3. **Document migration steps**: Concrete steps to adapt portfolio → Core
4. **Explain why**: Why can't we use portfolio version directly?
5. **Define test**: How to verify the migration worked?

Use the commented template examples above as a guide for structure.
