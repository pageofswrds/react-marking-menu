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

// Hooks
export { useMarkingMenuStateMachine } from './hooks/useMarkingMenuStateMachine'

// Utilities
export {
  getDirectionFromPosition,
  directionToAngle,
  getDistance,
  getAvailableDirections,
} from './utils/directions'

// Components (to be implemented)
// export { MarkingMenu } from './components/MarkingMenu'
// export { MarkingMenuTrigger } from './components/MarkingMenuTrigger'
// export { MarkingMenuContent } from './components/MarkingMenuContent'
// export { MarkingMenuItem } from './components/MarkingMenuItem'
// export { useMarkingMenuContext } from './hooks/useMarkingMenuContext'
