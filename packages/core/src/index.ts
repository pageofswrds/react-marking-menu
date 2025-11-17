/**
 * @react-marking-menu/core
 * Headless React primitives for marking menus with gestural interaction
 */

// Types
export type {
  Direction,
  Direction4,
  MenuState,
  Position,
  GestureConfig,
  MenuItem,
} from './types'

export type { ArrowKey, KeyboardState } from './utils/keyboard'

export type {
  MarkingMenuContextValue,
  AccessibilityConfig,
} from './components/MarkingMenu'

// Hooks
export { useMarkingMenuStateMachine } from './hooks/useMarkingMenuStateMachine'
export {
  useMarkingMenuGesture,
  type UseMarkingMenuGestureProps,
  type UseMarkingMenuGestureReturn,
} from './hooks/useMarkingMenuGesture'
export { useMarkingMenuContext } from './hooks/useMarkingMenuContext'
export {
  useFocusManagement,
  type UseFocusManagementProps,
} from './hooks/useFocusManagement'
export { useReducedMotion } from './hooks/useReducedMotion'

// Utilities - Directions
export {
  getDirectionFromPosition,
  directionToAngle,
  getDistance,
  getAvailableDirections,
} from './utils/directions'

// Utilities - Keyboard
export {
  isArrowKey,
  getDirectionFromSingleKey,
  getDirectionFromTwoKeys,
  getDirectionFromKeys,
  createKeyboardState,
  handleKeyDown,
  handleKeyUp,
  resetKeyboardState,
} from './utils/keyboard'

// Components
export { MarkingMenu, type MarkingMenuProps } from './components/MarkingMenu'
export {
  MarkingMenuTrigger,
  type MarkingMenuTriggerProps,
} from './components/MarkingMenuTrigger'
export {
  MarkingMenuContent,
  type MarkingMenuContentProps,
} from './components/MarkingMenuContent'
export {
  MarkingMenuItem,
  type MarkingMenuItemProps,
  type MarkingMenuItemRenderProps,
} from './components/MarkingMenuItem'

// Accessibility Components
export { LiveRegion, type LiveRegionProps } from './components/LiveRegion'
export {
  KeyboardIndicator,
  type KeyboardIndicatorProps,
} from './components/KeyboardIndicator'
