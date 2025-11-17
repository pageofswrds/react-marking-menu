# Quick Start Guide

Get up and running with the React Marking Menu monorepo.

## Initial Setup

1. **Install dependencies**

```bash
cd /Users/david/Documents/GitHub/react-marking-menu
pnpm install
```

This will install all dependencies for the monorepo and link the workspace packages together.

2. **Build all packages**

```bash
pnpm build
```

This builds all packages in the correct order using Turborepo.

3. **Run tests**

```bash
pnpm test
```

## Development Commands

### Working on the core package

```bash
cd packages/core

# Start development mode (watches for changes)
pnpm dev

# Run tests in watch mode
pnpm test:watch

# Type check
pnpm typecheck

# Lint
pnpm lint
```

### Working on the styled package

```bash
cd packages/styled

# Same commands as core
pnpm dev
pnpm test:watch
```

### Running commands from root

You can also run commands across all packages from the root:

```bash
# Build all packages
pnpm build

# Test all packages
pnpm test

# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Format all files
pnpm format
```

## Making Changes

### 1. Create a branch

```bash
git checkout -b feature/my-feature
```

### 2. Make your changes

Edit files in `packages/core/src/` or other packages.

### 3. Run tests and linting

```bash
pnpm test
pnpm lint
pnpm typecheck
```

### 4. Add a changeset

```bash
pnpm changeset
```

Select the packages that changed and describe your changes.

### 5. Commit and push

```bash
git add .
git commit -m "feat(core): add my feature"
git push origin feature/my-feature
```

## Next Steps

1. **Implement gesture recognition hook** (`packages/core/src/hooks/useMarkingMenuGesture.ts`)
2. **Build primitive components** (`packages/core/src/components/`)
3. **Add comprehensive tests**
4. **Create example implementations** (`packages/examples/`)

See the main README.md for the full implementation plan.

## Useful Resources

- [pnpm workspace documentation](https://pnpm.io/workspaces)
- [Turborepo documentation](https://turbo.build/repo/docs)
- [Changesets documentation](https://github.com/changesets/changesets)
- [Radix UI documentation](https://www.radix-ui.com/) (for API inspiration)

## Troubleshooting

### "Cannot find module" errors

Run `pnpm install` again to ensure workspace links are set up.

### Build errors

Try cleaning and rebuilding:

```bash
pnpm clean
pnpm build
```

### Type errors in IDE

Make sure your IDE is using the workspace TypeScript version:
- In VS Code: Open command palette → "TypeScript: Select TypeScript Version" → "Use Workspace Version"
