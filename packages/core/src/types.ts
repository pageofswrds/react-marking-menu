/**
 * Core types for the marking menu library
 */

/**
 * Represents one of the 8 cardinal/intercardinal directions
 */
export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'

/**
 * Represents one of the 4 cardinal directions (for simplified menus)
 */
export type Direction4 = 'N' | 'E' | 'S' | 'W'

/**
 * Menu state machine states
 */
export type MenuState = 'idle' | 'pressed' | 'active' | 'selecting'

/**
 * Position in 2D space
 */
export interface Position {
  x: number
  y: number
}

/**
 * Origin positioning mode for the marking menu
 */
export type OriginMode = 'cursor' | 'element' | 'viewport'

/**
 * Configuration for gesture recognition
 */
export interface GestureConfig {
  /**
   * Time in milliseconds to hold before menu appears
   * @default 150
   */
  pressThreshold?: number

  /**
   * Minimum distance in pixels to move before selecting
   * @default 30
   */
  minDistance?: number

  /**
   * Number of directions (4 or 8)
   * @default 8
   */
  directions?: 4 | 8

  /**
   * Prevent default context menu on right-click
   * @default true
   */
  preventContextMenu?: boolean

  /**
   * Origin positioning mode
   * - 'cursor': Center at cursor/pointer position (pointer gestures only)
   * - 'element': Center at the trigger element
   * - 'viewport': Center at viewport center (useful for keyboard)
   * @default 'element'
   */
  originMode?: OriginMode
}

/**
 * Menu item definition
 */
export interface MenuItem {
  /**
   * Unique identifier for this menu item
   */
  id: string

  /**
   * Direction slot for this item
   */
  direction: Direction | Direction4

  /**
   * Label for the menu item
   */
  label: string

  /**
   * Optional icon component or element
   */
  icon?: React.ReactNode

  /**
   * Callback when item is selected
   */
  onSelect?: () => void

  /**
   * Whether this item is disabled
   */
  disabled?: boolean
}

/**
 * Context value for marking menu
 */
export interface MarkingMenuContextValue {
  state: MenuState
  origin: Position | null
  currentDirection: Direction | Direction4 | null
  selectedItem: string | null
  config: Required<GestureConfig>
  items: MenuItem[]
  registerItem: (item: MenuItem) => void
  unregisterItem: (id: string) => void
}
