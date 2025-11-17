import { useCallback, useRef, useEffect } from 'react'
import { useMarkingMenuStateMachine } from './useMarkingMenuStateMachine'
import { getDirectionFromPosition, getDistance } from '../utils/directions'
import {
  createKeyboardState,
  handleKeyDown as processKeyDown,
  handleKeyUp as processKeyUp,
  isArrowKey,
  type KeyboardState,
} from '../utils/keyboard'
import type { Direction, Direction4, GestureConfig, MenuItem, Position } from '../types'

/**
 * Props for the unified gesture hook
 */
export interface UseMarkingMenuGestureProps {
  /**
   * Configuration for gesture recognition
   */
  config?: GestureConfig

  /**
   * Menu items to match selections against
   */
  items: MenuItem[]

  /**
   * Callback when an item is selected
   */
  onSelect?: (itemId: string) => void

  /**
   * Callback when the menu is cancelled (e.g., Escape key)
   */
  onCancel?: () => void

  /**
   * Whether the trigger is enabled
   * @default true
   */
  enabled?: boolean
}

/**
 * Return type for the unified gesture hook
 */
export interface UseMarkingMenuGestureReturn {
  /**
   * Current menu state
   */
  state: ReturnType<typeof useMarkingMenuStateMachine>['state']

  /**
   * Origin position where gesture started
   */
  origin: ReturnType<typeof useMarkingMenuStateMachine>['origin']

  /**
   * Current direction (from pointer movement or keyboard)
   */
  currentDirection: ReturnType<typeof useMarkingMenuStateMachine>['currentDirection']

  /**
   * Selected item ID (if any)
   */
  selectedItem: ReturnType<typeof useMarkingMenuStateMachine>['selectedItem']

  /**
   * Props to spread on the trigger element
   */
  getTriggerProps: () => {
    onPointerDown: (e: React.PointerEvent) => void
    onPointerMove: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
    onPointerCancel: (e: React.PointerEvent) => void
    onKeyDown: (e: React.KeyboardEvent) => void
    onKeyUp: (e: React.KeyboardEvent) => void
    onContextMenu?: (e: React.MouseEvent) => void
    tabIndex: number
  }

  /**
   * Keyboard state (for debugging/visual feedback)
   */
  keyboardState: KeyboardState
}

/**
 * Unified gesture hook for marking menus
 * Handles both pointer (mouse/touch) and keyboard (arrow keys) input
 * using the same state machine
 */
export function useMarkingMenuGesture({
  config = {},
  items,
  onSelect,
  onCancel,
  enabled = true,
}: UseMarkingMenuGestureProps): UseMarkingMenuGestureReturn {
  const {
    pressThreshold = 150,
    minDistance = 30,
    directions = 8,
    preventContextMenu = true,
    originMode = 'element',
  } = config

  const stateMachine = useMarkingMenuStateMachine()
  const {
    state,
    origin,
    currentDirection,
    selectedItem,
    startPress,
    updatePosition,
    endPress,
    cancel,
  } = stateMachine

  // Keyboard state
  const keyboardStateRef = useRef<KeyboardState>(createKeyboardState())
  const pointerIdRef = useRef<number | null>(null)
  const triggerElementRef = useRef<HTMLElement | null>(null)

  // Calculate origin based on mode
  const calculateOrigin = useCallback(
    (
      event?: React.PointerEvent | React.KeyboardEvent,
      element?: HTMLElement | null
    ): Position => {
      switch (originMode) {
        case 'cursor':
          // Use cursor position (pointer events only)
          if (event && 'clientX' in event) {
            return { x: event.clientX, y: event.clientY }
          }
          // Fallback to element center for keyboard
          return calculateElementCenter(element)

        case 'viewport':
          // Center of viewport
          return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          }

        case 'element':
        default:
          // Center of trigger element
          return calculateElementCenter(element)
      }
    },
    [originMode]
  )

  // Helper to calculate element center
  const calculateElementCenter = (element?: HTMLElement | null): Position => {
    if (element) {
      const rect = element.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
    }
    // Fallback to viewport center
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
  }

  // Find item by direction
  const findItemByDirection = useCallback(
    (direction: Direction | Direction4): MenuItem | null => {
      return items.find((item) => item.direction === direction && !item.disabled) || null
    },
    [items]
  )

  // Execute selection
  const executeSelection = useCallback(
    (direction: Direction | Direction4 | null) => {
      if (!direction) {
        endPress(null)
        return
      }

      const item = findItemByDirection(direction)
      if (item) {
        endPress(item.id)
        onSelect?.(item.id)
        item.onSelect?.()
      } else {
        endPress(null)
      }
    },
    [endPress, findItemByDirection, onSelect]
  )

  // Pointer event handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return

      // Only handle primary button (left mouse button or touch)
      if (e.button !== 0) return

      // Ignore if we're already tracking a pointer
      if (pointerIdRef.current !== null) return

      // Store trigger element reference
      triggerElementRef.current = e.currentTarget as HTMLElement

      // Capture the pointer
      pointerIdRef.current = e.pointerId
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)

      // Calculate origin based on mode
      const originPos = calculateOrigin(e, triggerElementRef.current)

      // Start the gesture
      startPress(originPos, pressThreshold)

      // Reset keyboard state when starting pointer gesture
      keyboardStateRef.current = createKeyboardState()
    },
    [enabled, startPress, pressThreshold, calculateOrigin]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return

      // Only track the captured pointer
      if (pointerIdRef.current !== e.pointerId) return

      // Only process movement if menu is active or selecting
      if (state !== 'active' && state !== 'selecting') return

      if (!origin) return

      const distance = getDistance(origin.x, origin.y, e.clientX, e.clientY)

      if (distance < minDistance) {
        // In dead zone
        updatePosition(null)
      } else {
        // Calculate direction
        const direction = getDirectionFromPosition(
          e.clientX,
          e.clientY,
          origin.x,
          origin.y,
          directions
        )
        updatePosition(direction)
      }
    },
    [enabled, state, origin, minDistance, directions, updatePosition]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return

      // Only handle the captured pointer
      if (pointerIdRef.current !== e.pointerId) return

      // Release pointer capture
      ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
      pointerIdRef.current = null

      // Execute selection
      executeSelection(currentDirection)
    },
    [enabled, executeSelection, currentDirection]
  )

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return

      // Only handle the captured pointer
      if (pointerIdRef.current !== e.pointerId) return

      // Release pointer capture
      ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
      pointerIdRef.current = null

      cancel()
      onCancel?.()
    },
    [enabled, cancel, onCancel]
  )

  // Keyboard event handlers
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return

      // Store trigger element reference
      if (!triggerElementRef.current) {
        triggerElementRef.current = e.currentTarget as HTMLElement
      }

      // Cancel on Escape
      if (e.key === 'Escape') {
        e.preventDefault()
        cancel()
        keyboardStateRef.current = createKeyboardState()
        onCancel?.()
        return
      }

      // Ignore if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return
      }

      // Only process arrow keys
      if (!isArrowKey(e.key)) return

      // Prevent default (stop scrolling)
      e.preventDefault()

      // Process key down
      const result = processKeyDown(keyboardStateRef.current, e.key)
      keyboardStateRef.current = result.state

      // Update state machine
      if (result.direction) {
        if (state === 'idle') {
          // First key pressed - start gesture
          // Calculate origin based on mode (element or viewport for keyboard)
          const originPos = calculateOrigin(e, triggerElementRef.current)
          startPress(originPos, pressThreshold)
        }

        // Update direction
        updatePosition(result.direction)
      }
    },
    [enabled, state, cancel, startPress, updatePosition, pressThreshold, calculateOrigin]
  )

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return

      // Ignore if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return
      }

      // Only process arrow keys
      if (!isArrowKey(e.key)) return

      // Prevent default
      e.preventDefault()

      // Process key up
      const result = processKeyUp(keyboardStateRef.current, e.key)
      keyboardStateRef.current = result.state

      if (result.allKeysReleased) {
        // Execute selection with latched direction
        executeSelection(result.direction)
      } else if (result.direction) {
        // Update direction (if not in release phase, this will be the new direction)
        updatePosition(result.direction)
      }
    },
    [enabled, updatePosition, executeSelection]
  )

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (preventContextMenu) {
        e.preventDefault()
      }
    },
    [preventContextMenu]
  )

  // Get trigger props
  const getTriggerProps = useCallback(() => {
    const baseProps = {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      tabIndex: 0,
    }

    if (preventContextMenu) {
      return {
        ...baseProps,
        onContextMenu: handleContextMenu,
      }
    }

    return baseProps
  }, [
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleKeyDown,
    handleKeyUp,
    handleContextMenu,
    preventContextMenu,
  ])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Reset keyboard state on unmount
      keyboardStateRef.current = createKeyboardState()
    }
  }, [])

  return {
    state,
    origin,
    currentDirection,
    selectedItem,
    getTriggerProps,
    keyboardState: keyboardStateRef.current,
  }
}
