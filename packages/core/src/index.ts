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

export type { MarkingMenuContextValue } from './components/MarkingMenu'

// Hooks
export { useMarkingMenuStateMachine } from './hooks/useMarkingMenuStateMachine'
export {
  useMarkingMenuGesture,
  type UseMarkingMenuGestureProps,
  type UseMarkingMenuGestureReturn,
} from './hooks/useMarkingMenuGesture'
export { useMarkingMenuContext } from './hooks/useMarkingMenuContext'

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
