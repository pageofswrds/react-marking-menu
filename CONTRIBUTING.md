# Contributing to React Marking Menu

Thank you for your interest in contributing! This is an early-stage project and all contributions are welcome.

## Getting Started

1. **Fork and clone the repository**

```bash
git clone https://github.com/yourusername/react-marking-menu.git
cd react-marking-menu
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Build packages**

```bash
pnpm build
```

4. **Run tests**

```bash
pnpm test
```

## Development Workflow

### Making changes

1. Create a new branch for your changes
2. Make your changes in the appropriate package (`packages/core`, `packages/styled`, etc.)
3. Add tests for new functionality
4. Ensure all tests pass: `pnpm test`
5. Ensure linting passes: `pnpm lint`
6. Ensure type checking passes: `pnpm typecheck`

### Adding a changeset

When you make changes that should be released, add a changeset:

```bash
pnpm changeset
```

Follow the prompts to describe your changes. This helps with automatic versioning and changelog generation.

### Commit messages

Use clear, descriptive commit messages. Format:

```
type(scope): description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(core): add gesture recognition hook`
- `fix(styled): correct SVG arc path calculation`
- `docs: update README with examples`

## Project Structure

```
packages/
├── core/       - Headless primitives (gesture recognition, state management)
├── styled/     - Styled components built on core
└── examples/   - Example implementations
```

## Areas That Need Help

- **Gesture recognition** - Refinement of press-hold-drag-release detection
- **Accessibility** - Keyboard navigation, ARIA attributes, screen reader testing
- **Cross-browser testing** - Testing on different browsers and devices
- **Documentation** - Examples, tutorials, API docs
- **Examples** - Different visual implementations

## Code Standards

- **TypeScript** - All code must be written in TypeScript
- **Tests** - New features should include tests
- **Types** - No `any` types, prefer proper type inference
- **Accessibility** - Consider keyboard and screen reader users
- **Comments** - Public APIs should have JSDoc comments

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all CI checks pass
4. Add a changeset if appropriate
5. Request review from maintainers

## Questions?

Open an issue or start a discussion. We're happy to help!

## Code of Conduct

Be respectful and constructive. We're all here to build something useful together.
