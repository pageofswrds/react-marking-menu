import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMarkingMenuStateMachine } from '../hooks/useMarkingMenuStateMachine'

describe('useMarkingMenuStateMachine', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useMarkingMenuStateMachine())

    expect(result.current.state).toBe('idle')
    expect(result.current.origin).toBe(null)
    expect(result.current.currentDirection).toBe(null)
    expect(result.current.selectedItem).toBe(null)
  })

  describe('startPress', () => {
    it('should transition to pressed state', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
      })

      expect(result.current.state).toBe('pressed')
      expect(result.current.origin).toEqual({ x: 100, y: 100 })
    })

    it('should transition to active state after delay', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
      })

      expect(result.current.state).toBe('pressed')

      act(() => {
        vi.advanceTimersByTime(150)
      })

      expect(result.current.state).toBe('active')
    })

    it('should not transition to active if cancelled before delay', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
      })

      act(() => {
        result.current.cancel()
      })

      act(() => {
        vi.advanceTimersByTime(150)
      })

      expect(result.current.state).toBe('idle')
    })
  })

  describe('updatePosition', () => {
    it('should update direction when in active state', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
        vi.advanceTimersByTime(150)
      })

      expect(result.current.state).toBe('active')

      act(() => {
        result.current.updatePosition('N')
      })

      expect(result.current.currentDirection).toBe('N')
      expect(result.current.state).toBe('selecting')
    })

    it('should not update direction when in idle state', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.updatePosition('N')
      })

      expect(result.current.currentDirection).toBe(null)
      expect(result.current.state).toBe('idle')
    })

    it('should transition to selecting state when direction is set', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
        vi.advanceTimersByTime(150)
        result.current.updatePosition('E')
      })

      expect(result.current.state).toBe('selecting')
      expect(result.current.currentDirection).toBe('E')
    })

    it('should allow null direction (dead zone)', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
        vi.advanceTimersByTime(150)
        result.current.updatePosition('E')
        result.current.updatePosition(null)
      })

      expect(result.current.currentDirection).toBe(null)
    })
  })

  describe('endPress', () => {
    it('should return to idle state and clear timer', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
        result.current.endPress('item-1')
      })

      expect(result.current.state).toBe('idle')
      expect(result.current.origin).toBe(null)
      expect(result.current.currentDirection).toBe(null)

      // Timer should be cleared, so advancing time shouldn't change state
      act(() => {
        vi.advanceTimersByTime(150)
      })

      expect(result.current.state).toBe('idle')
    })

    it('should return the selected item id', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
      })

      let selectedId: string | null = null
      act(() => {
        selectedId = result.current.endPress('item-1')
      })

      expect(selectedId).toBe('item-1')
    })
  })

  describe('cancel', () => {
    it('should return to idle state from pressed', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
        result.current.cancel()
      })

      expect(result.current.state).toBe('idle')
      expect(result.current.origin).toBe(null)
    })

    it('should return to idle state from active', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
        vi.advanceTimersByTime(150)
        result.current.cancel()
      })

      expect(result.current.state).toBe('idle')
    })

    it('should clear the timer', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
        result.current.cancel()
      })

      act(() => {
        vi.advanceTimersByTime(150)
      })

      expect(result.current.state).toBe('idle')
    })
  })

  describe('Integration: Full gesture flow', () => {
    it('should handle complete gesture sequence', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      // Start press
      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
      })
      expect(result.current.state).toBe('pressed')

      // Wait for active
      act(() => {
        vi.advanceTimersByTime(150)
      })
      expect(result.current.state).toBe('active')

      // Move to select
      act(() => {
        result.current.updatePosition('N')
      })
      expect(result.current.state).toBe('selecting')
      expect(result.current.currentDirection).toBe('N')

      // End press
      act(() => {
        result.current.endPress('copy')
      })
      expect(result.current.state).toBe('idle')
    })

    it('should handle quick press without reaching active state', () => {
      const { result } = renderHook(() => useMarkingMenuStateMachine())

      act(() => {
        result.current.startPress({ x: 100, y: 100 }, 150)
        vi.advanceTimersByTime(50)
        result.current.endPress(null)
      })

      expect(result.current.state).toBe('idle')
    })
  })
})
