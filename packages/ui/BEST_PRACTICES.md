# UI Package Best Practices Checklist

This checklist ensures high quality, maintainable, and scalable UI components for the ProofOfFit monorepo.

## Testing & Coverage
- [ ] Write unit tests for every UI component and utility
- [ ] Use @testing-library/react for all component tests
- [ ] Keep coverage thresholds low at first, then raise as coverage increases
- [ ] Run lint, type-check, and tests in CI for every PR

## Type Safety
- [ ] Use TypeScript everywhere
- [ ] Export all component types and props for consumers
- [ ] Prefer explicit types for public APIs

## Component Design
- [ ] Keep components pure and stateless when possible
- [ ] Use forwardRef for all components that render DOM elements
- [ ] Document all props with JSDoc or TypeScript comments

## Exports & Structure
- [ ] Export only public components from your package entrypoint
- [ ] Keep internal utilities and helpers out of the public API
- [ ] Organize components in a flat or feature-based structure

## Styling
- [ ] Use utility-first CSS (e.g., Tailwind)
- [ ] Allow className overrides for all components
- [ ] Document any required CSS or theme dependencies

## Accessibility
- [ ] Use semantic HTML and ARIA roles
- [ ] Test components with screen readers and keyboard navigation
- [ ] Add automated accessibility tests (e.g., jest-axe)

## Documentation
- [ ] Maintain a Storybook or similar for live component docs
- [ ] Keep README and usage examples up to date
- [ ] Document any breaking changes in a CHANGELOG

## Performance
- [ ] Avoid unnecessary re-renders (use React.memo where needed)
- [ ] Minimize bundle size by tree-shaking and avoiding large dependencies
- [ ] Profile components for slow renders

## CI/CD
- [ ] Run lint, type-check, and tests on every push/PR
- [ ] Use Dependabot for dependency updates
- [ ] Upload coverage reports to a service like Codecov

## Versioning & Releases
- [ ] Use semantic versioning for your packages
- [ ] Automate releases with changelogs and tags
- [ ] Communicate breaking changes clearly
