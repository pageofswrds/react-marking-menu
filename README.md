# React Marking Menu

A headless React library for building marking menus with true gestural interaction.

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
3. **Menu appears** - Same visual feedback as pointer interaction (after 150ms threshold)
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

## Implementation Plan

### Phase 1: Core Headless Primitives (MVP)

**Goal:** Ship the behavior layer with zero visual opinions

#### 1.1 Foundation (Week 1)

- [x] Monorepo setup (pnpm + Turborepo)
- [x] TypeScript configuration
- [x] Core types definition
- [x] Direction calculation utilities
- [x] State machine hook
- [ ] Keyboard utilities (arrow key mapping, multi-key state management, direction latching)
- [ ] Unified gesture recognition hook (pointer + keyboard)
- [ ] Distance/angle utilities with tests

#### 1.2 Primitive Components (Week 2)

- [ ] `MarkingMenu` - Root context provider
- [ ] `MarkingMenuTrigger` - Gesture trigger with Slot pattern
- [ ] `MarkingMenuContent` - Menu container primitive
- [ ] `MarkingMenuItem` - Individual item primitive
- [ ] `useMarkingMenuContext` - Context consumer hook

**Component API Design:**

```tsx
<MarkingMenu>
  <MarkingMenuTrigger asChild>
    <button>Right-click or press</button>
  </MarkingMenuTrigger>

  <MarkingMenuContent>
    <MarkingMenuItem direction="N" onSelect={() => console.log('Copy')}>
      {({ isHighlighted }) => (
        <YourCustomSlice highlighted={isHighlighted}>Copy</YourCustomSlice>
      )}
    </MarkingMenuItem>
    {/* More items... */}
  </MarkingMenuContent>
</MarkingMenu>
```

#### 1.3 Accessibility (Week 3)

**Keyboard Navigation:**
- [ ] Arrow key press-and-hold gesture (integrated in unified gesture hook)
- [ ] Multi-key diagonal selection (Up+Right = NE, etc.)
- [ ] Direction latching on key release (prevents timing issues)
- [ ] Escape key to cancel/close menu
- [ ] Focus trap when menu is open (optional)
- [ ] Visual indicator of pressed keys (optional, for learning)

**Screen Reader Support:**
- [ ] ARIA attributes (role="menu", aria-label, aria-activedescendant)
- [ ] Live region announcements for direction changes
- [ ] Accessible menu item labels

**Other:**
- [ ] Focus management and restoration
- [ ] Reduced motion support (prefers-reduced-motion)
- [ ] High contrast mode support

#### 1.4 Testing & Documentation (Week 4)

- [ ] Unit tests for utilities (directions, distance, angles, keyboard mapping)
- [ ] Keyboard state manager tests (multi-key behavior, latching, sliding window)
- [ ] Hook tests (state machine, unified gesture recognition)
- [ ] Component integration tests (pointer and keyboard flows)
- [ ] Accessibility tests (keyboard navigation, screen reader, focus management)
- [ ] Cross-browser keyboard event tests
- [ ] API documentation with keyboard examples
- [ ] Storybook setup with interactive keyboard demos

### Phase 2: Reference Implementations (Examples)

**Goal:** Show flexibility of the primitives through multiple visual approaches

#### 2.1 SVG Radial Menu (Week 5)

- [ ] SVG path generation for arc segments
- [ ] Hover/highlight states with CSS transitions
- [ ] Radial layout with configurable radius
- [ ] Icon support
- [ ] Theme system with CSS variables

#### 2.2 Additional Examples (Week 6)

- [ ] Canvas-based implementation (high performance)
- [ ] DOM-based with CSS transforms
- [ ] Framer Motion animated version
- [ ] Accessible text-only version
- [ ] Mobile-optimized version

### Phase 3: Styled Package (Optional)

**Goal:** Provide opinionated styled version for quick adoption

#### 3.1 Styled Components (Week 7-8)

- [ ] `StyledMarkingMenuContent` - Pre-built SVG radial menu
- [ ] `StyledMarkingMenuItem` - Styled menu slice
- [ ] Default theme with CSS variables
- [ ] Dark mode support
- [ ] Animation presets
- [ ] Icon integration

### Phase 4: Polish & Release (Week 9-10)

- [ ] Performance optimization
- [ ] Bundle size optimization
- [ ] Comprehensive documentation site
- [ ] Tutorial videos/GIFs
- [ ] Migration guides
- [ ] v1.0.0 release

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
PRESSED [timer starts]
  ↓ (threshold reached: 150ms)
ACTIVE [menu visible]
  ↓ (movement > minDistance OR direction from keys)
SELECTING [item highlighted]
  ↓ (pointerUp OR all keys released)
IDLE [onSelect called]
```

**Key insight:** Same state machine handles both input methods, just different triggers and direction calculations.

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

### Gesture Recognition Algorithms

#### Pointer/Touch Gesture

```typescript
function handlePointerDown(e) {
  origin = { x: e.clientX, y: e.clientY }
  state = 'pressed'

  timer = setTimeout(() => {
    state = 'active'  // Show menu
  }, 150)
}

function handlePointerMove(e) {
  if (state !== 'active' && state !== 'selecting') return

  distance = getDistance(origin, { x: e.clientX, y: e.clientY })

  if (distance < minDistance) {
    currentDirection = null  // In dead zone
  } else {
    currentDirection = getDirectionFromPosition(
      e.clientX, e.clientY,
      origin.x, origin.y
    )
    state = 'selecting'
  }
}

function handlePointerUp() {
  clearTimeout(timer)

  if (currentDirection && state === 'selecting') {
    const item = findItemByDirection(currentDirection)
    item?.onSelect()
  }

  state = 'idle'
}
```

#### Keyboard Gesture (Arrow Keys)

**Multi-key sliding window with direction latching:**

```typescript
// State
pressedKeys: ArrowKey[] = []  // Stack of pressed keys in order
isReleasing = false
latchedDirection: Direction | null = null

function handleKeyDown(key: ArrowKey) {
  if (!pressedKeys.includes(key)) {
    pressedKeys.push(key)
  }

  // Use last 2 keys (sliding window)
  const direction = getDirectionFromKeys(pressedKeys.slice(-2))
  currentDirection = direction

  if (pressedKeys.length === 1) {
    state = 'pressed'
    timer = setTimeout(() => state = 'active', 150)
  } else if (state === 'active') {
    state = 'selecting'
  }
}

function handleKeyUp(key: ArrowKey) {
  pressedKeys = pressedKeys.filter(k => k !== key)

  // Entering release phase - latch the direction
  if (!isReleasing && pressedKeys.length < 2) {
    isReleasing = true
    latchedDirection = currentDirection
  }

  // All keys released - execute
  if (pressedKeys.length === 0) {
    clearTimeout(timer)
    if (latchedDirection) {
      const item = findItemByDirection(latchedDirection)
      item?.onSelect()
    }
    state = 'idle'
    isReleasing = false
    latchedDirection = null
  } else if (!isReleasing) {
    // Still pressing - recalculate direction
    currentDirection = getDirectionFromKeys(pressedKeys.slice(-2))
  }
}

function getDirectionFromKeys(keys: ArrowKey[]): Direction {
  const keySet = new Set(keys)

  // Single key
  if (keySet.has('ArrowUp') && keySet.size === 1) return 'N'
  if (keySet.has('ArrowRight') && keySet.size === 1) return 'E'
  if (keySet.has('ArrowDown') && keySet.size === 1) return 'S'
  if (keySet.has('ArrowLeft') && keySet.size === 1) return 'W'

  // Two keys (diagonals)
  if (keySet.has('ArrowUp') && keySet.has('ArrowRight')) return 'NE'
  if (keySet.has('ArrowDown') && keySet.has('ArrowRight')) return 'SE'
  if (keySet.has('ArrowDown') && keySet.has('ArrowLeft')) return 'SW'
  if (keySet.has('ArrowUp') && keySet.has('ArrowLeft')) return 'NW'

  return null
}
```

**Key behaviors:**
- **Sliding window:** Pressing Up+Right+Down uses Right+Down (last 2 keys) for SE direction
- **Direction latching:** When releasing multi-key combo, direction locks to prevent timing issues
- **Same timing:** 150ms threshold and same state machine as pointer input

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

- [x] **v0.1.0** - Monorepo setup, core types, basic utilities
- [ ] **v0.2.0** - Complete headless primitives
- [ ] **v0.3.0** - Accessibility implementation
- [ ] **v0.4.0** - Comprehensive tests
- [ ] **v0.5.0** - Example implementations
- [ ] **v0.6.0** - Styled package
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
