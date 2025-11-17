import type { Direction } from '../types'

/**
 * Valid arrow key values
 */
export type ArrowKey = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft'

/**
 * Arrow key values as a constant array for validation
 */
const ARROW_KEYS: readonly ArrowKey[] = [
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
] as const

/**
 * Check if a key is a valid arrow key
 * @param key The key string to validate
 * @returns True if the key is an arrow key
 */
export function isArrowKey(key: string): key is ArrowKey {
  return ARROW_KEYS.includes(key as ArrowKey)
}

/**
 * Map a single arrow key to a cardinal direction
 * @param key The arrow key
 * @returns The corresponding cardinal direction
 */
export function getDirectionFromSingleKey(key: ArrowKey): Direction {
  const keyMap: Record<ArrowKey, Direction> = {
    ArrowUp: 'N',
    ArrowRight: 'E',
    ArrowDown: 'S',
    ArrowLeft: 'W',
  }
  return keyMap[key]
}

/**
 * Check if two arrow keys are opposite directions
 * @param key1 First arrow key
 * @param key2 Second arrow key
 * @returns True if the keys are opposite directions
 */
function areOppositeKeys(key1: ArrowKey, key2: ArrowKey): boolean {
  return (
    (key1 === 'ArrowUp' && key2 === 'ArrowDown') ||
    (key1 === 'ArrowDown' && key2 === 'ArrowUp') ||
    (key1 === 'ArrowLeft' && key2 === 'ArrowRight') ||
    (key1 === 'ArrowRight' && key2 === 'ArrowLeft')
  )
}

/**
 * Map two arrow keys to a direction (diagonal or cardinal)
 * Handles invalid combinations by falling back to the most recent key
 * @param key1 First arrow key (older)
 * @param key2 Second arrow key (more recent)
 * @returns The corresponding direction
 */
export function getDirectionFromTwoKeys(key1: ArrowKey, key2: ArrowKey): Direction {
  // If keys are the same, return single key direction
  if (key1 === key2) {
    return getDirectionFromSingleKey(key1)
  }

  // Check for invalid combinations (opposite keys)
  if (areOppositeKeys(key1, key2)) {
    // Fallback to most recent key
    return getDirectionFromSingleKey(key2)
  }

  // Valid diagonal combinations
  const diagonalMap: Record<string, Direction> = {
    'ArrowUp+ArrowRight': 'NE',
    'ArrowRight+ArrowUp': 'NE',
    'ArrowDown+ArrowRight': 'SE',
    'ArrowRight+ArrowDown': 'SE',
    'ArrowDown+ArrowLeft': 'SW',
    'ArrowLeft+ArrowDown': 'SW',
    'ArrowUp+ArrowLeft': 'NW',
    'ArrowLeft+ArrowUp': 'NW',
  }

  const combo = `${key1}+${key2}`
  const direction = diagonalMap[combo]

  // If we have a valid diagonal, return it
  if (direction) {
    return direction
  }

  // Otherwise fallback to most recent key
  return getDirectionFromSingleKey(key2)
}

/**
 * Get direction from an array of pressed keys using sliding window approach
 * Uses the most recent 2 keys (or 1 if only 1 is pressed) to determine direction
 * @param pressedKeys Array of currently pressed keys in chronological order
 * @returns The current direction, or null if no keys are pressed
 */
export function getDirectionFromKeys(pressedKeys: ArrowKey[]): Direction | null {
  if (pressedKeys.length === 0) {
    return null
  }

  if (pressedKeys.length === 1) {
    return getDirectionFromSingleKey(pressedKeys[0])
  }

  // Use the last 2 keys (sliding window)
  const last2Keys = pressedKeys.slice(-2)
  return getDirectionFromTwoKeys(last2Keys[0], last2Keys[1])
}

/**
 * Keyboard state for tracking pressed keys and direction latching
 */
export interface KeyboardState {
  /**
   * Stack of pressed arrow keys in chronological order
   */
  pressedKeys: ArrowKey[]

  /**
   * Whether we're in the release phase (direction is latched)
   */
  isReleasing: boolean

  /**
   * The latched direction when release phase starts
   */
  latchedDirection: Direction | null
}

/**
 * Create initial keyboard state
 */
export function createKeyboardState(): KeyboardState {
  return {
    pressedKeys: [],
    isReleasing: false,
    latchedDirection: null,
  }
}

/**
 * Handle keydown event and update keyboard state
 * @param state Current keyboard state
 * @param key The key that was pressed
 * @returns Updated keyboard state and the new direction
 */
export function handleKeyDown(
  state: KeyboardState,
  key: string
): { state: KeyboardState; direction: Direction | null } {
  // Validate arrow key
  if (!isArrowKey(key)) {
    return { state, direction: getDirectionFromKeys(state.pressedKeys) }
  }

  // Ignore if already pressed (key repeat)
  if (state.pressedKeys.includes(key)) {
    return { state, direction: getDirectionFromKeys(state.pressedKeys) }
  }

  // Add to stack
  const newPressedKeys = [...state.pressedKeys, key]
  const direction = getDirectionFromKeys(newPressedKeys)

  return {
    state: {
      ...state,
      pressedKeys: newPressedKeys,
    },
    direction,
  }
}

/**
 * Handle keyup event and update keyboard state
 * Implements direction latching when transitioning from 2+ keys to fewer keys
 * @param state Current keyboard state
 * @param key The key that was released
 * @returns Updated keyboard state, current direction, and whether all keys are released
 */
export function handleKeyUp(
  state: KeyboardState,
  key: string
): {
  state: KeyboardState
  direction: Direction | null
  allKeysReleased: boolean
} {
  // Validate arrow key
  if (!isArrowKey(key)) {
    return {
      state,
      direction: state.isReleasing
        ? state.latchedDirection
        : getDirectionFromKeys(state.pressedKeys),
      allKeysReleased: false,
    }
  }

  // Remove from stack
  const newPressedKeys = state.pressedKeys.filter((k) => k !== key)

  // Check if entering release phase
  // Trigger latching when going from 2+ keys to fewer keys
  let isReleasing = state.isReleasing
  let latchedDirection = state.latchedDirection

  if (!state.isReleasing && state.pressedKeys.length >= 2 && newPressedKeys.length < 2) {
    isReleasing = true
    // Latch the current direction before the key was released
    latchedDirection = getDirectionFromKeys(state.pressedKeys)
  }

  // All keys released
  if (newPressedKeys.length === 0) {
    return {
      state: createKeyboardState(), // Reset state
      direction: latchedDirection || getDirectionFromKeys(state.pressedKeys),
      allKeysReleased: true,
    }
  }

  // Calculate direction
  const direction = isReleasing ? latchedDirection : getDirectionFromKeys(newPressedKeys)

  return {
    state: {
      pressedKeys: newPressedKeys,
      isReleasing,
      latchedDirection,
    },
    direction,
    allKeysReleased: false,
  }
}

/**
 * Reset keyboard state to initial state
 */
export function resetKeyboardState(): KeyboardState {
  return createKeyboardState()
}
