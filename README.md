# React Marking Menu

A headless React library for building marking menus with true gestural interaction.

[![npm version](https://img.shields.io/npm/v/@react-marking-menu/core/beta)](https://www.npmjs.com/package/@react-marking-menu/core)
[![npm downloads](https://img.shields.io/npm/dm/@react-marking-menu/core)](https://www.npmjs.com/package/@react-marking-menu/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## What is a Marking Menu?

A marking menu is a radial context menu that enables fluid, gesture-based interaction through multiple input methods:

### 🖱️ Pointer/Touch Interaction

1. **Press and hold** - User presses and holds a button or touch point
2. **Menu appears** - Options radiate outward in 8 directions (N, NE, E, SE, S, SW, W, NW)
3. **Drag to select** - While still holding, user drags toward their desired option
4. **Release to execute** - Releasing the press executes the selected action

### ⌨️ Keyboard Interaction (Accessible)

1. **Focus** - User tabs to the trigger element
2. **Press and hold arrow key(s)** - Single key for cardinal directions (N/E/S/W), two keys for diagonals (NE/SE/SW/NW)
3. **Menu appears** - Same visual feedback as pointer interaction
4. **Release to execute** - Releasing all keys executes the selected action

This interaction pattern is faster than traditional menus once learned, and is especially powerful for touch interfaces, creative applications, and **fully accessible for keyboard-only users**.

## Why This Library?

Existing radial/pie menu libraries for the web don't implement true marking menu gestures. They use **click-based interaction** rather than the **press-hold-drag-release** pattern that makes marking menus unique.

This library provides:

- ✅ **True gesture recognition** - Press-hold-drag-release for pointer AND keyboard
- ✅ **Unified input handling** - Same state machine for mouse, touch, and keyboard
- ✅ **Headless primitives** - Full control over styling and rendering
- ✅ **TypeScript first** - Complete type safety and IntelliSense
- ✅ **Fully accessible** - Keyboard navigation, ARIA attributes, screen reader support
- ✅ **Tree-shakeable** - Only bundle what you use
- ✅ **Modern React** - Hooks, context, and concurrent mode safe

## Quick Start

### Installation

```bash
npm install @react-marking-menu/core@beta
# or
pnpm add @react-marking-menu/core@beta
# or
yarn add @react-marking-menu/core@beta
```

### Basic Usage

```tsx
import {
  MarkingMenu,
  MarkingMenuTrigger,
  MarkingMenuContent,
  MarkingMenuItem,
} from '@react-marking-menu/core'

function App() {
  const handleSelect = (value: string) => {
    console.log('Selected:', value)
  }

  return (
    <MarkingMenu onSelect={handleSelect}>
      <MarkingMenuTrigger>
        <button>Right Click or Long Press Me</button>
      </MarkingMenuTrigger>

      <MarkingMenuContent>
        <MarkingMenuItem id="copy" direction="N" label="Copy" />
        <MarkingMenuItem id="paste" direction="S" label="Paste" />
        <MarkingMenuItem id="cut" direction="E" label="Cut" />
        <MarkingMenuItem id="delete" direction="W" label="Delete" />
      </MarkingMenuContent>
    </MarkingMenu>
  )
}
```

## Packages

This monorepo contains:

### `@react-marking-menu/core` (Published Beta)

Headless primitives providing gesture recognition and state management without visual opinions.

```bash
npm install @react-marking-menu/core@beta
```

**Status:** 🚀 **v0.1.0-beta.0 Published** - Ready for testing and feedback!

[📦 View on npm](https://www.npmjs.com/package/@react-marking-menu/core) | [📖 Documentation](./packages/core/README.md)

### `@react-marking-menu/cli` (Planned)

CLI tool for adding styled marking menu components to your project (shadcn/ui style).

**Status:** 📋 Planned - See [CLI_ARCHITECTURE.md](./CLI_ARCHITECTURE.md) for the spec

### `@react-marking-menu/styled` (Planned)

Pre-styled components built on the core primitives.

**Status:** 📋 Planned (after CLI is complete)

## Features

### Current (v0.1.0-beta.0)

- ✅ Headless component primitives
- ✅ Pointer gesture recognition (mouse/touch)
- ✅ Keyboard gesture recognition (arrow keys with multi-key support)
- ✅ Unified state machine for all input types
- ✅ 8-directional and 4-directional support
- ✅ Direction calculation utilities
- ✅ TypeScript definitions
- ✅ Accessibility features (ARIA, keyboard navigation, screen readers)
- ✅ Configurable gesture thresholds
- ✅ Origin positioning modes (cursor, element, viewport)
- ✅ Render props pattern for full control

### Roadmap

- [ ] CLI tool for styled components (see CLI_ARCHITECTURE.md)
- [ ] Pre-built styled templates (SVG radial, Canvas, DOM-based)
- [ ] Animation presets
- [ ] Theme system
- [ ] Additional examples and demos
- [ ] Comprehensive documentation site
- [ ] Video tutorials

## Architecture

### Core Philosophy: Headless & Accessible

**Behavior Layer** → `@react-marking-menu/core`
- Unified gesture recognition (pointer + keyboard)
- State machine (idle → pressed → active → selecting)
- Direction calculation
- Accessibility logic

**Presentation Layer** → You decide!
- Visual rendering (SVG/Canvas/DOM)
- Styling and theming
- Animations

### State Machine

```
IDLE
  ↓ (pointerDown OR arrow key pressed)
PRESSED [150ms threshold]
  ↓ (threshold reached)
ACTIVE [menu visible]
  ↓ (movement > minDistance OR direction detected)
SELECTING [item highlighted]
  ↓ (pointerUp OR all keys released)
IDLE [onSelect called]
```

### Direction System

8-direction support (45° each):

```
        N (270°)
   NW ╱     ╲ NE
     ╱       ╲
W ──╳─────────╳── E (0°/360°)
     ╲       ╱
   SW ╲     ╱ SE
        S (90°)
```

Also supports 4-direction mode: N, E, S, W

## API Reference

Full API documentation is available in the [core package README](./packages/core/README.md).

### Quick Reference

```tsx
// Root component
<MarkingMenu
  onSelect={(id) => void}
  onCancel={() => void}
  config={{ pressThreshold: 150, minDistance: 50, directions: 8 }}
  a11y={{ announcements: true }}
/>

// Trigger
<MarkingMenuTrigger asChild>
  <button>Your trigger</button>
</MarkingMenuTrigger>

// Content container
<MarkingMenuContent forceMount={false} />

// Menu items
<MarkingMenuItem
  id="unique-id"
  direction="N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"
  label="Label"
  disabled={false}
  onSelect={() => void}
>
  {({ isHighlighted, isSelected }) => <YourContent />}
</MarkingMenuItem>
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

### Working on the core package

```bash
cd packages/core

# Development mode
pnpm dev

# Run tests in watch mode
pnpm test:watch

# Build
pnpm build
```

### Versioning

We use [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# Add a changeset
pnpm changeset

# Version packages
pnpm version-packages

# Publish (from root)
pnpm release
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- React 18+

## Contributing

Contributions are welcome! This is an early-stage project. Areas that need help:

- Testing in different frameworks (Next.js, Vite, CRA, Remix)
- Accessibility testing with screen readers
- Cross-browser testing
- Documentation improvements
- Example implementations
- CLI development

Please open an issue before starting major work.

## Inspiration

- **Radix UI** - Headless component philosophy
- **shadcn/ui** - CLI-based component distribution
- **React Aria** - Accessibility patterns
- **Original marking menus research** - Kurtenbach & Buxton (1993)
- **Autodesk Maya** - Industry-standard marking menu implementation

## License

MIT © 2025 David Zhang

## Links

- [npm Package](https://www.npmjs.com/package/@react-marking-menu/core)
- [GitHub Repository](https://github.com/pageofswrds/react-marking-menu)
- [Issue Tracker](https://github.com/pageofswrds/react-marking-menu/issues)
- [Discussions](https://github.com/pageofswrds/react-marking-menu/discussions)

## Support

If you find this library useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📖 Improving documentation
- 🤝 Contributing code

---

**Status:** Beta - Ready for testing! Please report any issues you encounter.
