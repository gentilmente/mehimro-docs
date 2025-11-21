# Mehmiro Documentation Portal

This documentation portal is built using [Docusaurus](https://docusaurus.io/), a modern static website generator optimized for documentation sites.

## Overview

The Mehmiro Documentation Hub serves as the central repository for all project documentation, including:

- **Foundations**: Project overview, personas, glossary, and core guidelines
- **Architecture**: System architecture, data models, and performance/security considerations
- **Standards**: Coding standards, UI guidelines, and testing strategies
- **Processes**: Feature lifecycle and documentation governance
- **Features**: Detailed documentation for all implemented features

## Installation

```bash
pnpm install
```

## Local Development

```bash
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Validation

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Documentation validation
pnpm docs:lint
```

## Deployment

The documentation is automatically deployed via GitHub Actions when changes are pushed to the main branch. The deployment workflow:

1. Validates the documentation structure
2. Builds the static site
3. Deploys to GitHub Pages

For manual deployment using Docusaurus:

Using SSH:
```bash
USE_SSH=true pnpm deploy
```

Not using SSH:
```bash
GIT_USER=<Your GitHub username> pnpm deploy
```

## Contributing

When contributing to the documentation:

1. Follow the established structure in `docs/`
2. Update the sidebar configuration in `sidebars.ts` if adding new sections
3. Ensure all links are valid and properly formatted
4. Run validation scripts before committing

## CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- **docs-validation.yml**: Validates documentation structure and builds on PRs
- **deploy-docs.yml**: Deploys to GitHub Pages on main branch pushes
