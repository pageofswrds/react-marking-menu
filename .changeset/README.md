# Changesets

This folder contains changeset files that describe changes to be released.

## Adding a changeset

When you make changes to the packages, run:

```bash
pnpm changeset
```

Follow the prompts to:
1. Select which packages changed
2. Specify if it's a major, minor, or patch change
3. Write a summary of the changes

## Versioning packages

To update package versions based on changesets:

```bash
pnpm version-packages
```

## Publishing

To publish changed packages to npm:

```bash
pnpm release
```

This will build all packages and publish them with the updated versions.
