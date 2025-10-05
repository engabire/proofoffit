# Changelog

All notable changes to this repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project will follow **Semantic Versioning** once a stable release cadence begins.

## [Unreleased]
### Added
- Initial Storybook integration with Button variants
- Storybook CI workflow (build + a11y test runner)
- UI package Jest + a11y (jest-axe) tests

### Changed
- Replaced scaffolded example Storybook Button story with real UI `Button` component usage

### Planned
- Introduce semantic release automation
- Add visual regression (Chromatic or Loki)
- Expand component stories & interaction tests

## [0.1.0] - Bootstrap
- Project scaffolding and initial monorepo structure

<!--
Release process (planned):
1. Update Unreleased -> version heading
2. Tag release
3. Regenerate Unreleased section
-->
