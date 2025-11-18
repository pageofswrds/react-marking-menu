# @react-marking-menu/core

Headless React primitives for building marking menus with true gestural interaction.

## What is a Marking Menu?

A marking menu is a radial context menu where users:

**Pointer/Touch:**
1. Press and hold a button
2. Options appear in 8 directions (N, NE, E, SE, S, SW, W, NW)
3. While holding, drag the cursor to select an option
4. Release to execute the selection

**Keyboard (Accessible):**
1. Focus the trigger element (tab or click)
2. Press arrow key(s) for direction
3. Menu appears instantly (no delay)
4. Release to execute the selection

This library provides the **unified gesture recognition logic** for both pointer and keyboard input without any visual opinions, following the Radix UI philosophy.

## Installation

```bash
npm install @react-marking-menu/core
# or
pnpm add @react-marking-menu/core
# or
yarn add @react-marking-menu/core
```

## Features

- ✅ **Headless components** - Full control over styling and rendering
- ✅ **Gesture recognition** - Pointer (mouse/touch) and keyboard input
- ✅ **8-directional support** - N, NE, E, SE, S, SW, W, NW
- ✅ **State machine** - Predictable interaction states
- ✅ **TypeScript** - Full type safety and IntelliSense
- ✅ **Accessible** - Keyboard navigation, ARIA attributes, screen reader support
- ✅ **Framework agnostic** - Works with any React setup (Next.js, Vite, CRA, etc.)
- ✅ **Tree-shakeable** - Only bundle what you use

## Quick Start

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
        <MarkingMenuItem value="copy" direction="N">
          Copy
        </MarkingMenuItem>
        <MarkingMenuItem value="paste" direction="S">
          Paste
        </MarkingMenuItem>
        <MarkingMenuItem value="cut" direction="E">
          Cut
        </MarkingMenuItem>
        <MarkingMenuItem value="delete" direction="W">
          Delete
        </MarkingMenuItem>
      </MarkingMenuContent>
    </MarkingMenu>
  )
}
```

## Core Concepts

### Headless Philosophy

This library provides **zero styling** - you have complete control over the appearance. It handles:
- Gesture detection (pointer and keyboard)
- State management
- Direction calculation
- Accessibility
- Focus management

You provide the visuals using your preferred styling solution (CSS, Tailwind, CSS-in-JS, etc.).

### How It Works

1. **Press & Hold** - User presses and holds on the trigger
2. **Menu Appears** - Menu opens at the pointer/focus position
3. **Drag to Select** - User drags in a direction to highlight an option
4. **Release to Confirm** - Releasing executes the selected action

## API Reference

### `<MarkingMenu>`

Root component that manages state and context.

**Props:**
- `onSelect?: (value: string) => void` - Called when an item is selected
- `gestureDistance?: number` - Minimum distance to trigger selection (default: 40)
- `children: ReactNode`

### `<MarkingMenuTrigger>`

Element that opens the menu.

**Props:**
- `asChild?: boolean` - Merge props into child element
- `children: ReactNode`

### `<MarkingMenuContent>`

Container for menu items.

**Props:**
- `children: ReactNode`

### `<MarkingMenuItem>`

Individual menu option.

**Props:**
- `value: string` - Unique identifier for the item
- `direction: Direction` - One of: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"
- `disabled?: boolean` - Whether the item is disabled
- `children: ReactNode | ((props: RenderProps) => ReactNode)` - Content or render function

## Styling

Since this is a headless library, you need to add your own styles. Here's a simple CSS example:

```css
.marking-menu-content {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marking-menu-item {
  padding: 12px 24px;
  cursor: pointer;
}

.marking-menu-item[data-highlighted] {
  background: #0070f3;
  color: white;
}

.marking-menu-item[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Required CSS for Touch Devices

**IMPORTANT:** For touch interactions to work properly on iOS and Android, you **must** apply these CSS properties to your trigger element:

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

**Why this is required:**

While the library uses `preventDefault()` in JavaScript to handle gestures, CSS `touch-action` provides:
- Better performance (prevents default behaviors at the browser level)
- Prevention of certain browser behaviors that JavaScript can't fully control
- Consistent behavior across different mobile browsers

**Without these styles**, touch users will experience:
- ❌ Page scrolling during drag gestures
- ❌ Text selection when pressing and holding
- ❌ iOS callout menus appearing on long press
- ⚠️ Inconsistent gesture recognition

### Styling Focus and Interaction States

The trigger element provides both standard focus pseudo-classes and data attributes for styling:

```css
/* Standard focus styling (keyboard focus) */
.marking-menu-trigger:focus-visible {
  outline: 2px solid #0070f3;
  outline-offset: 2px;
}

/* Style based on gesture state using data attributes */
.marking-menu-trigger[data-idle] {
  /* Normal state - ready for interaction */
}

.marking-menu-trigger[data-pressed] {
  /* Press detected, waiting for threshold */
}

.marking-menu-trigger[data-active] {
  /* Menu is open, ready for selection */
  background: #f0f0f0;
}

.marking-menu-trigger[data-selecting] {
  /* User is currently selecting an item */
}
```

**Click vs Press-and-Hold:**

The library distinguishes between quick clicks and press-and-hold gestures:

- **Quick click** (< 150ms) → Just focuses the element, no menu opens
- **Press and hold** (≥ 150ms) → Opens the menu for pointer gesture

This allows users to:
1. Click to focus the trigger
2. Use arrow keys for keyboard navigation
3. OR press-and-hold for pointer/touch gestures

> **Tip:** For pre-styled components, check out `@react-marking-menu/styled` or use the CLI tool to copy styled variants into your project.

## Advanced Usage

### Custom Gesture Configuration

```tsx
<MarkingMenu
  gestureDistance={60}
  onSelect={handleSelect}
>
  {/* ... */}
</MarkingMenu>
```

### Using Hooks Directly

For advanced use cases, you can use the hooks directly:

```tsx
import { useMarkingMenuGesture } from '@react-marking-menu/core'

function CustomMenu() {
  const { state, direction, position } = useMarkingMenuGesture({
    gestureDistance: 40,
    onGestureStart: () => console.log('Started'),
    onGestureEnd: (dir) => console.log('Ended', dir),
  })

  // Build your own UI using the gesture state
}
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  Direction,
  MenuItem,
  MenuState,
  GestureConfig,
  MarkingMenuProps,
} from '@react-marking-menu/core'
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- React 18+

## Documentation

For full documentation, examples, and guides, visit:
- [GitHub Repository](https://github.com/yourusername/react-marking-menu)
- [API Documentation](https://github.com/yourusername/react-marking-menu/tree/main/packages/core)

## Related Packages

- `@react-marking-menu/styled` - Pre-styled components (coming soon)
- `@react-marking-menu/cli` - CLI tool for adding styled components to your project (coming soon)

## License

MIT
