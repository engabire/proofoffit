# Contributing to ProofOfFit

Thank you for your interest in contributing to ProofOfFit! This document outlines our development standards, processes, and best practices.

## Development Standards

### Code Quality

#### Linting and Formatting
- **ESLint**: All code must pass ESLint checks with zero warnings
- **Prettier**: Code formatting is enforced automatically
- **TypeScript**: Strict type checking is required
- **Import Organization**: Use consistent import ordering (React, Next.js, third-party, local)

#### Console Statements Policy
- **Production Code**: Avoid `console.log` statements in production code
- **Allowed**: `console.error` and `console.warn` for error handling
- **Development**: Use `console.info` for development debugging
- **Disable Pattern**: Use `// eslint-disable-next-line no-console` for intentional console statements
- **Environment Gating**: Wrap development logs with `if (process.env.NODE_ENV !== 'production')`

#### HTML Entities and JSX
- **Escaping**: Always escape HTML entities in JSX (`&apos;`, `&ldquo;`, `&rdquo;`)
- **Navigation**: Use `next/link` for internal navigation, not `<a>` tags
- **Accessibility**: Include proper ARIA labels and semantic HTML

### React Best Practices

#### Hooks and Dependencies
- **Exhaustive Dependencies**: Include all dependencies in useEffect/useCallback dependency arrays
- **Stable References**: Use useCallback/useMemo for expensive operations
- **Custom Hooks**: Extract reusable logic into custom hooks
- **State Management**: Prefer local state over global state when possible

#### Component Design
- **Single Responsibility**: Each component should have one clear purpose
- **Props Interface**: Define clear TypeScript interfaces for component props
- **Error Boundaries**: Implement error boundaries for robust error handling
- **Loading States**: Always handle loading and error states

### Performance

#### Image Optimization
- **Next.js Image**: Use `next/image` instead of `<img>` tags
- **Lazy Loading**: Implement lazy loading for non-critical images
- **Responsive Images**: Provide appropriate image sizes for different viewports

#### Bundle Optimization
- **Code Splitting**: Use dynamic imports for large components
- **Tree Shaking**: Import only necessary functions from libraries
- **Bundle Analysis**: Regularly analyze bundle size and optimize

## Development Workflow

### Git Workflow
1. **Branch Naming**: Use descriptive branch names (`feature/`, `fix/`, `docs/`)
2. **Commit Messages**: Use conventional commit format
3. **Pull Requests**: All changes must go through PR review
4. **Testing**: Ensure all tests pass before submitting PR

### Code Review Process
1. **Self Review**: Review your own code before requesting review
2. **Automated Checks**: All CI/CD checks must pass
3. **Peer Review**: At least one team member must approve
4. **Security Review**: Security-sensitive changes require additional review

### Testing Standards
- **Unit Tests**: Write tests for utility functions and hooks
- **Integration Tests**: Test component interactions
- **E2E Tests**: Critical user flows must have E2E coverage
- **Accessibility**: Ensure WCAG compliance

## Environment Setup

### Prerequisites
- Node.js 22+
- npm or yarn
- Git

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

### Environment Variables
- Copy `.env.example` to `.env.local`
- Configure required environment variables
- Never commit sensitive credentials

## Security Guidelines

### Credential Management
- **Environment Variables**: Store all secrets in environment variables
- **No Hardcoding**: Never hardcode API keys or secrets
- **Credential Manager**: Use the centralized credential manager for runtime access
- **Build-time Safety**: Avoid accessing credentials during build phase

### Data Handling
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Prevention**: Sanitize user-generated content
- **CSRF Protection**: Implement CSRF tokens for state-changing operations

## Documentation

### Code Documentation
- **JSDoc**: Document complex functions and components
- **README**: Keep README files up to date
- **API Documentation**: Document all API endpoints
- **Architecture**: Document system architecture and design decisions

### Commit Documentation
- **Conventional Commits**: Use standardized commit message format
- **Change Log**: Update CHANGELOG.md for significant changes
- **Migration Guides**: Provide migration guides for breaking changes

## Performance Monitoring

### Metrics
- **Core Web Vitals**: Monitor LCP, FID, CLS
- **Bundle Size**: Track bundle size changes
- **Runtime Performance**: Monitor component render times
- **Error Rates**: Track and alert on error rates

### Optimization
- **Lazy Loading**: Implement lazy loading for non-critical components
- **Caching**: Use appropriate caching strategies
- **CDN**: Serve static assets from CDN
- **Compression**: Enable gzip/brotli compression

## Troubleshooting

### Common Issues
- **Build Failures**: Check TypeScript errors and missing dependencies
- **Runtime Errors**: Check browser console and server logs
- **Performance Issues**: Use React DevTools and Lighthouse
- **Security Issues**: Run security scans and dependency audits

### Getting Help
- **Documentation**: Check existing documentation first
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Team Chat**: Reach out to team members for urgent issues

## Release Process

### Versioning
- **Semantic Versioning**: Use semantic versioning (MAJOR.MINOR.PATCH)
- **Changelog**: Update CHANGELOG.md for each release
- **Tagging**: Tag releases in Git

### Deployment
- **Staging**: Deploy to staging environment first
- **Production**: Deploy to production after staging validation
- **Rollback**: Have rollback plan ready
- **Monitoring**: Monitor deployment health

---

## Quick Reference

### Linting Commands
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Check specific files
npm run lint -- apps/web/src/components/Button.tsx
```

### Common ESLint Rules
- `react/no-unescaped-entities`: Escape HTML entities in JSX
- `@next/next/no-html-link-for-pages`: Use next/link for internal navigation
- `no-console`: Avoid console statements in production
- `react-hooks/exhaustive-deps`: Include all dependencies in hooks

### Performance Checklist
- [ ] Images use `next/image`
- [ ] Components are lazy loaded when appropriate
- [ ] Bundle size is optimized
- [ ] Core Web Vitals are within targets
- [ ] Error boundaries are implemented

---

*This document is living and should be updated as our practices evolve.*
