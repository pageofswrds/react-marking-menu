---
"@react-marking-menu/core": minor
---

Initial release of @react-marking-menu/core

This is the first public release of the headless React marking menu library.

**Features:**
- Headless components for building marking menus
- 8-directional gesture support (N, NE, E, SE, S, SW, W, NW)
- Unified pointer and keyboard input handling
- Full TypeScript support
- Accessibility features (ARIA, keyboard navigation, screen reader support)
- Zero styling - complete control over appearance
- Tree-shakeable ES modules

**Components:**
- `MarkingMenu` - Root component with state management
- `MarkingMenuTrigger` - Trigger element for opening the menu
- `MarkingMenuContent` - Container for menu items
- `MarkingMenuItem` - Individual menu option

**Hooks:**
- `useMarkingMenuStateMachine` - State machine for menu interaction
- `useMarkingMenuGesture` - Unified gesture handling
- `useMarkingMenuContext` - Access menu context
- `useFocusManagement` - Focus management utilities
- `useReducedMotion` - Respect user motion preferences

**Utilities:**
- Direction calculation (angle-based)
- Keyboard input handling (arrow keys with multi-key support)
- Accessibility helpers
