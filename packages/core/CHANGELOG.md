# @react-marking-menu/core

## 0.1.0

### Minor Changes

- 6e4ad70: Initial release of @react-marking-menu/core

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

### Patch Changes

- Bug fixes and UX improvements for touch and keyboard interactions

  **Touch Device Improvements:**
  - Fixed iOS/Android touch interactions by adding `preventDefault()` to pointer event handlers
  - Prevents text selection, scrolling, and callout menus during gestures
  - Added comprehensive CSS documentation for touch-action and user-select

  **Keyboard Interaction Improvements:**
  - Click-to-focus behavior: Quick clicks (<150ms) now focus the trigger without opening the menu
  - Instant keyboard response: Removed async delay for arrow key presses (0ms response time)
  - Fixed timing issues with rapid key presses by making keyboard gestures fully synchronous
  - Keyboard gestures now use `startImmediate()` instead of timer-based activation

  **UI State Management:**
  - Added data attributes to trigger element for state-based styling (`data-idle`, `data-pressed`, `data-active`, `data-selecting`)
  - Improved focus state styling support with `:focus-visible` compatibility

  **Documentation:**
  - Updated READMEs with touch device requirements and CSS examples
  - Documented click vs press-and-hold behavior
  - Added focus and interaction state styling guide
  - Cleaned up implementation plan to reflect current status
