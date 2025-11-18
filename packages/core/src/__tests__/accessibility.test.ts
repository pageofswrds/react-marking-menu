import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useReducedMotion } from '../hooks/useReducedMotion'

describe('Accessibility Hooks', () => {
  describe('useReducedMotion', () => {
    let matchMediaMock: any

    beforeEach(() => {
      // Mock window.matchMedia
      matchMediaMock = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }

      vi.stubGlobal('matchMedia', vi.fn(() => matchMediaMock))
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('should return false when prefers-reduced-motion is not set', () => {
      matchMediaMock.matches = false
      const { result } = renderHook(() => useReducedMotion())

      expect(result.current).toBe(false)
    })

    it('should return true when prefers-reduced-motion is set', () => {
      matchMediaMock.matches = true
      const { result } = renderHook(() => useReducedMotion())

      expect(result.current).toBe(true)
    })

    it('should register event listener on mount', () => {
      renderHook(() => useReducedMotion())

      expect(matchMediaMock.addEventListener || matchMediaMock.addListener).toHaveBeenCalled()
    })

    it('should clean up event listener on unmount', () => {
      const { unmount } = renderHook(() => useReducedMotion())

      unmount()

      expect(
        matchMediaMock.removeEventListener || matchMediaMock.removeListener
      ).toHaveBeenCalled()
    })

    it('should handle SSR (no window)', () => {
      // Test that the initial state returns false when window is undefined
      // Note: We can't use renderHook because React testing requires a DOM
      // Instead, we verify the hook's initialization logic handles SSR gracefully

      // Temporarily stub window.matchMedia to undefined
      const originalMatchMedia = window.matchMedia
      // @ts-ignore - testing SSR scenario
      delete window.matchMedia

      const { result } = renderHook(() => useReducedMotion())

      // Should default to false when matchMedia is unavailable
      expect(result.current).toBe(false)

      // Restore matchMedia
      window.matchMedia = originalMatchMedia
    })
  })
})
