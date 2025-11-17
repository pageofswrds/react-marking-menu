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
  MarkingMenuContextValue,
} from './types'

export type { ArrowKey, KeyboardState } from './utils/keyboard'

// Hooks
export { useMarkingMenuStateMachine } from './hooks/useMarkingMenuStateMachine'
export {
  useMarkingMenuGesture,
  type UseMarkingMenuGestureProps,
  type UseMarkingMenuGestureReturn,
} from './hooks/useMarkingMenuGesture'

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

// Components (to be implemented)
// export { MarkingMenu } from './components/MarkingMenu'
// export { MarkingMenuTrigger } from './components/MarkingMenuTrigger'
// export { MarkingMenuContent } from './components/MarkingMenuContent'
// export { MarkingMenuItem } from './components/MarkingMenuItem'
// export { useMarkingMenuContext } from './hooks/useMarkingMenuContext'
