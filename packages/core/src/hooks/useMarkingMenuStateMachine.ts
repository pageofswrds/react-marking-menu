import { useState, useCallback, useRef } from 'react'
import type { MenuState, Position, Direction, Direction4 } from '../types'

/**
 * State machine for managing marking menu interaction states
 */
export function useMarkingMenuStateMachine() {
  const [state, setState] = useState<MenuState>('idle')
  const [origin, setOrigin] = useState<Position | null>(null)
  const [currentDirection, setCurrentDirection] = useState<Direction | Direction4 | null>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null)

  const startPress = useCallback((position: Position, delay: number) => {
    setState('pressed')
    setOrigin(position)
    setCurrentDirection(null)
    setSelectedItem(null)

    // Set timer to transition to 'active' state after delay
    pressTimerRef.current = setTimeout(() => {
      setState('active')
    }, delay)
  }, [])

  const startImmediate = useCallback((position: Position) => {
    setState('active') // Immediately active, no timer
    setOrigin(position)
    setCurrentDirection(null)
    setSelectedItem(null)
  }, [])

  const updatePosition = useCallback((direction: Direction | Direction4 | null) => {
    // Update state and check if we should update direction
    setState((currentState) => {
      // Only update if we're in active or selecting state
      if (currentState === 'active' || currentState === 'selecting') {
        // Update direction immediately when in valid state
        setCurrentDirection(direction)

        // Transition to selecting if we have a direction and aren't already selecting
        if (direction !== null && currentState === 'active') {
          return 'selecting'
        }
      }

      return currentState
    })
  }, [])

  const endPress = useCallback((itemId: string | null) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }

    setSelectedItem(itemId)
    setState('idle')
    setOrigin(null)
    setCurrentDirection(null)

    return itemId
  }, [])

  const cancel = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }

    setState('idle')
    setOrigin(null)
    setCurrentDirection(null)
    setSelectedItem(null)
  }, [])

  return {
    state,
    origin,
    currentDirection,
    selectedItem,
    startPress,
    startImmediate,
    updatePosition,
    endPress,
    cancel,
  }
}
