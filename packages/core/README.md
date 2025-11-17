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
1. Focus the trigger element
2. Press and hold arrow key(s) for direction
3. Menu appears with same visual feedback
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

## Status

🚧 **Work in Progress** - This library is under active development.

## Features (Planned)

- ✅ Pointer gesture recognition (press-hold-drag-release)
- ✅ State machine for menu interaction
- ✅ Direction calculation utilities (angle-based)
- ⏳ Keyboard gesture recognition (arrow key press-hold with multi-key support)
- ⏳ Unified gesture hook (handles both pointer and keyboard)
- ⏳ Direction latching (prevents two-key release timing issues)
- ⏳ Headless React components
- ⏳ Full TypeScript support
- ⏳ Full accessibility (keyboard navigation, ARIA, screen readers)
- ⏳ Comprehensive test coverage

## Documentation

Coming soon. See the main repository README for the full implementation plan.

## License

MIT
