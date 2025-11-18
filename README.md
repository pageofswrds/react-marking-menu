# React Marking Menu

A headless React library for building marking menus with true gestural interaction.

## What is a Marking Menu?

A marking menu is a radial context menu that enables fluid, gesture-based interaction through multiple input methods:

### 🖱️ Pointer/Touch Interaction

1. **Click to focus** - Quick click (< 150ms) focuses the element for keyboard use
2. **Press and hold** - User presses and holds (≥ 150ms) to start gesture
3. **Menu appears** - Options radiate outward in 8 directions (N, NE, E, SE, S, SW, W, NW)
4. **Drag to select** - While still holding, user drags toward their desired option
5. **Release to execute** - Releasing the press executes the selected action

### ⌨️ Keyboard Interaction (Accessible)

1. **Focus** - User tabs to the trigger element (or clicks to focus)
2. **Press arrow key(s)** - Single key for cardinal directions (N/E/S/W), two keys for diagonals (NE/SE/SW/NW)
3. **Menu appears instantly** - No delay for keyboard interaction, immediate visual feedback
4. **Multi-key sliding window** - Pressing additional keys uses the most recent 2 keys (e.g., holding Up+Right+Down uses Right+Down for SE)
5. **Direction latching** - When releasing a multi-key combo, the direction is locked even if keys release slightly apart
6. **Release to execute** - Releasing all keys executes the selected action

This interaction pattern is faster than traditional menus once learned, and is especially powerful for touch interfaces, creative applications, and **fully accessible for keyboard-only users**.

## Why This Library?

Existing radial/pie menu libraries for the web don't implement true marking menu gestures. They use **click-based interaction** rather than the **press-hold-drag-release** pattern that makes marking menus unique.

This library provides:

- ✅ **True gesture recognition** - Press-hold-drag-release for pointer AND keyboard
- ✅ **Unified input handling** - Same state machine for mouse, touch, and keyboard
- ✅ **Headless primitives** - Full control over styling and rendering
- ✅ **Framework philosophy** - Inspired by Radix UI's unstyled approach
- ✅ **TypeScript first** - Complete type safety
- ✅ **Fully accessible** - Keyboard navigation with arrow keys, ARIA support
- ✅ **Modern React** - Hooks, context, and concurrent mode safe

## Packages

This monorepo contains:

### `@react-marking-menu/core`

Headless primitives providing gesture recognition and state management without visual opinions.

```bash
npm install @react-marking-menu/core
```

**Status:** 🚧 In Development

### `@react-marking-menu/styled`

Opinionated styled components built on the core primitives (SVG-based radial menu).

```bash
npm install @react-marking-menu/styled
```

**Status:** 📋 Planned (after core is complete)

### `@react-marking-menu/examples`

Example implementations showing different visual approaches.

**Status:** 📋 Planned

---

## Status

### ✅ Implemented (v0.1.0-beta)

**Core Primitives:**
- ✅ Monorepo setup (pnpm + Turborepo)
- ✅ TypeScript configuration with full type safety
- ✅ Headless component architecture
- ✅ State machine for gesture management
- ✅ Direction calculation utilities (8 & 4 direction support)
- ✅ Keyboard utilities (multi-key sliding window, direction latching)
- ✅ Unified gesture recognition (pointer + keyboard)

**Components:**
- ✅ `MarkingMenu` - Root context provider
- ✅ `MarkingMenuTrigger` - Gesture trigger with asChild pattern
- ✅ `MarkingMenuContent` - Menu container primitive
- ✅ `MarkingMenuItem` - Individual item primitive
- ✅ `KeyboardIndicator` - Visual keyboard state feedback (optional)
- ✅ `LiveRegion` - Screen reader announcements

**Gesture Features:**
- ✅ Pointer gestures (mouse/touch) with press-and-hold
- ✅ Click-to-focus behavior (150ms threshold to distinguish from hold)
- ✅ Keyboard gestures with instant feedback (0ms delay)
- ✅ Multi-key diagonal selection (e.g., Up+Right = NE)
- ✅ Direction latching on key release
- ✅ Escape key to cancel
- ✅ Touch device support (preventDefault on pointer events)
- ✅ Context menu prevention

**Accessibility:**
- ✅ ARIA attributes (role, aria-expanded, aria-haspopup)
- ✅ Keyboard navigation (arrow keys)
- ✅ Focus management with data attributes for styling
- ✅ Reduced motion support hook
- ✅ Screen reader support via live regions

**Testing:**
- ✅ Unit tests for utilities (directions, keyboard)
- ✅ Hook tests (state machine, gesture recognition)
- ✅ Component integration tests
- ✅ Accessibility tests

### 🚧 Future Plans

**Examples & Documentation:**
- 📋 Reference implementations (SVG radial, Canvas, etc.)
- 📋 Storybook with interactive demos
- 📋 Comprehensive documentation site
- 📋 Tutorial videos/GIFs

**Styled Package:**
- 📋 `@react-marking-menu/styled` - Pre-built styled components
- 📋 Default themes with CSS variables
- 📋 Dark mode support
- 📋 Animation presets

**Polish:**
- 📋 Performance optimizations
- 📋 Bundle size optimization
- 📋 Cross-browser testing
- 📋 v1.0.0 stable release

---

## Architecture

### Core Philosophy: Separation of Concerns

**Behavior Layer** (Philosophy 1) → `@react-marking-menu/core`
- Unified gesture recognition (pointer + keyboard press-hold-drag-release)
- State machine (idle → pressed → active → selecting)
- Direction calculation (angle-based for pointer, key-based for keyboard)
- Event handling (pointer, touch, keyboard)
- Keyboard state management (multi-key sliding window, direction latching)
- Accessibility logic

**Presentation Layer** (Philosophy 3) → `@react-marking-menu/styled` + examples
- Visual rendering (SVG/Canvas/DOM)
- Styling and theming
- Animations
- Layout

### State Machine

**Unified for both pointer and keyboard input:**

```
IDLE
  ↓ (pointerDown OR first arrow key pressed)
PRESSED [timer starts for pointer only]
  ↓ (threshold reached: 150ms for pointer, 0ms for keyboard)
ACTIVE [menu visible]
  ↓ (movement > minDistance OR direction from keys)
SELECTING [item highlighted]
  ↓ (pointerUp OR all keys released)
IDLE [onSelect called]
```

**Key insight:** Same state machine handles both input methods with different timing:
- **Pointer gestures**: 150ms delay to distinguish clicks from press-and-hold
- **Keyboard gestures**: 0ms delay for instant response

### Direction Mapping

8-direction system (45° each):

```
        N (270°)
   NW ╱     ╲ NE
     ╱       ╲
W ──╳─────────╳── E (0°/360°)
     ╲       ╱
   SW ╲     ╱ SE
        S (90°)
```

Alternatively supports 4-direction system (90° each): N, E, S, W

---

## Technical Stack

- **Language:** TypeScript 5.3+
- **Framework:** React 18+
- **Build:** tsup (fast TypeScript bundler)
- **Test:** Vitest + React Testing Library
- **Monorepo:** pnpm workspaces + Turborepo
- **Versioning:** Changesets
- **Linting:** ESLint + Prettier
- **CI/CD:** GitHub Actions (planned)

---

## Key Design Decisions

### 1. Headless-First Approach

**Why:** Maximum flexibility for users to implement any visual design while we handle complex gesture logic.

**Inspired by:** Radix UI, React Aria, Headless UI

### 2. Gesture Configuration

```typescript
interface GestureConfig {
  pressThreshold?: number    // Default: 150ms
  minDistance?: number       // Default: 30px
  directions?: 4 | 8         // Default: 8
  preventContextMenu?: boolean  // Default: true
}
```

These defaults are tuned for optimal UX but fully configurable.

### 3. Render Props Pattern

Allow full rendering control:

```tsx
<MarkingMenuItem direction="N" onSelect={handleCopy}>
  {({ isHighlighted, isActive, direction }) => (
    <CustomSlice highlighted={isHighlighted} direction={direction}>
      Copy
    </CustomSlice>
  )}
</MarkingMenuItem>
```

### 4. TypeScript-First

All APIs designed with TypeScript in mind. No `any` types, full inference.

---

## Comparison to Existing Solutions

| Feature | This Library | victorqribeiro/radialMenu | react-pie-menu | spaceymonk/react-radial-menu |
|---------|-------------|---------------------------|----------------|------------------------------|
| **True marking menu gestures** | ✅ Pointer + Keyboard | ❌ (click-based) | ❌ (click-based) | ❌ (click-based) |
| **Keyboard navigation** | ✅ Arrow keys with hold | ❌ | ❌ | ❌ |
| **Headless primitives** | ✅ | ❌ (opinionated canvas) | ❌ (styled-components) | ❌ (opinionated SVG) |
| **TypeScript** | ✅ | ❌ | ✅ | ✅ |
| **Full accessibility** | ✅ (planned) | ❌ | ❌ | ❌ |
| **React 18+** | ✅ | N/A (vanilla) | ✅ | ✅ |
| **Modern build** | ✅ (tsup) | ❌ | ⚠️ | ⚠️ |

---

## Touch Device Support

For optimal touch interaction on mobile devices (iOS, Android), you **must** apply the following CSS to your trigger element:

```css
.marking-menu-trigger {
  /* Prevents default touch behaviors (scrolling, callouts) */
  touch-action: none;

  /* Prevents text selection during gestures */
  user-select: none;
  -webkit-user-select: none;

  /* Prevents iOS callout menu on long press */
  -webkit-touch-callout: none;
}
```

**Why this is needed:**

The library handles gesture recognition via JavaScript (`preventDefault()` on pointer events), but CSS `touch-action` provides better performance and prevents certain browser behaviors that can't be fully controlled by JavaScript alone.

**Without these styles**, users may experience:
- ❌ Page scrolling during drag gestures
- ❌ Text selection when pressing and holding
- ❌ iOS callout menus appearing on long press

---

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Run all package builds
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Type check
pnpm typecheck
```

### Working on packages

```bash
# Core package development
cd packages/core
pnpm dev

# Run tests in watch mode
pnpm test:watch
```

### Adding a changeset

When making changes:

```bash
pnpm changeset
```

Follow the prompts to describe your changes. This will be used for automatic versioning and changelog generation.

---

## Contributing

Contributions welcome! This is an early-stage project. Areas that need help:

- Gesture recognition refinement
- Accessibility testing
- Cross-browser testing
- Documentation
- Example implementations

Please open an issue before starting major work.

---

## Roadmap

- [x] **v0.1.0-beta** - Core headless primitives with full gesture support
  - Monorepo setup, types, utilities
  - Complete component library (MarkingMenu, Trigger, Content, Item)
  - Unified gesture recognition (pointer + keyboard)
  - Keyboard navigation with multi-key support
  - Touch device support
  - Accessibility features (ARIA, focus management, screen readers)
  - Comprehensive test suite
- [ ] **v0.2.0** - Polish and documentation
  - Example implementations
  - Interactive documentation site
  - Performance optimizations
- [ ] **v0.3.0** - Styled package
  - Pre-built styled components
  - Theme system
  - Animation presets
- [ ] **v1.0.0** - Stable release

---

## Inspiration

- **Radix UI** - Headless component philosophy
- **React Aria** - Accessibility patterns
- **Original marking menus research** - Kurtenbach & Buxton (1993)
- **Autodesk Maya** - Industry-standard marking menu implementation

---

## License

MIT © 2025

---

## Questions?

Open an issue or discussion on GitHub. This is an active project and feedback is valuable!
