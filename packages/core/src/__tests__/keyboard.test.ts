import { describe, it, expect } from 'vitest'
import {
  isArrowKey,
  getDirectionFromSingleKey,
  getDirectionFromTwoKeys,
  getDirectionFromKeys,
  createKeyboardState,
  handleKeyDown,
  handleKeyUp,
  resetKeyboardState,
} from '../utils/keyboard'

describe('Keyboard Utilities', () => {
  describe('isArrowKey', () => {
    it('should return true for valid arrow keys', () => {
      expect(isArrowKey('ArrowUp')).toBe(true)
      expect(isArrowKey('ArrowRight')).toBe(true)
      expect(isArrowKey('ArrowDown')).toBe(true)
      expect(isArrowKey('ArrowLeft')).toBe(true)
    })

    it('should return false for non-arrow keys', () => {
      expect(isArrowKey('a')).toBe(false)
      expect(isArrowKey('Enter')).toBe(false)
      expect(isArrowKey('Space')).toBe(false)
      expect(isArrowKey('Escape')).toBe(false)
    })
  })

  describe('getDirectionFromSingleKey', () => {
    it('should map arrow keys to cardinal directions', () => {
      expect(getDirectionFromSingleKey('ArrowUp')).toBe('N')
      expect(getDirectionFromSingleKey('ArrowRight')).toBe('E')
      expect(getDirectionFromSingleKey('ArrowDown')).toBe('S')
      expect(getDirectionFromSingleKey('ArrowLeft')).toBe('W')
    })
  })

  describe('getDirectionFromTwoKeys', () => {
    it('should map two keys to diagonal directions', () => {
      expect(getDirectionFromTwoKeys('ArrowUp', 'ArrowRight')).toBe('NE')
      expect(getDirectionFromTwoKeys('ArrowRight', 'ArrowUp')).toBe('NE')
      expect(getDirectionFromTwoKeys('ArrowDown', 'ArrowRight')).toBe('SE')
      expect(getDirectionFromTwoKeys('ArrowRight', 'ArrowDown')).toBe('SE')
      expect(getDirectionFromTwoKeys('ArrowDown', 'ArrowLeft')).toBe('SW')
      expect(getDirectionFromTwoKeys('ArrowLeft', 'ArrowDown')).toBe('SW')
      expect(getDirectionFromTwoKeys('ArrowUp', 'ArrowLeft')).toBe('NW')
      expect(getDirectionFromTwoKeys('ArrowLeft', 'ArrowUp')).toBe('NW')
    })

    it('should handle same key pressed twice', () => {
      expect(getDirectionFromTwoKeys('ArrowUp', 'ArrowUp')).toBe('N')
      expect(getDirectionFromTwoKeys('ArrowRight', 'ArrowRight')).toBe('E')
    })

    it('should fallback to most recent key for opposite directions', () => {
      expect(getDirectionFromTwoKeys('ArrowUp', 'ArrowDown')).toBe('S')
      expect(getDirectionFromTwoKeys('ArrowDown', 'ArrowUp')).toBe('N')
      expect(getDirectionFromTwoKeys('ArrowLeft', 'ArrowRight')).toBe('E')
      expect(getDirectionFromTwoKeys('ArrowRight', 'ArrowLeft')).toBe('W')
    })
  })

  describe('getDirectionFromKeys', () => {
    it('should return null for empty array', () => {
      expect(getDirectionFromKeys([])).toBe(null)
    })

    it('should use single key for array of length 1', () => {
      expect(getDirectionFromKeys(['ArrowUp'])).toBe('N')
      expect(getDirectionFromKeys(['ArrowRight'])).toBe('E')
    })

    it('should use last 2 keys for array of length 2+', () => {
      expect(getDirectionFromKeys(['ArrowUp', 'ArrowRight'])).toBe('NE')
      expect(getDirectionFromKeys(['ArrowUp', 'ArrowRight', 'ArrowDown'])).toBe('SE')
    })

    it('should implement sliding window correctly', () => {
      // Simulates: Press Up, then Right, then Down
      const keys = ['ArrowUp', 'ArrowRight', 'ArrowDown']
      // Should use last 2: Right + Down = SE
      expect(getDirectionFromKeys(keys)).toBe('SE')
    })
  })

  describe('createKeyboardState', () => {
    it('should create initial state', () => {
      const state = createKeyboardState()
      expect(state.pressedKeys).toEqual([])
      expect(state.isReleasing).toBe(false)
      expect(state.latchedDirection).toBe(null)
    })
  })

  describe('handleKeyDown', () => {
    it('should add arrow key to pressed keys', () => {
      const state = createKeyboardState()
      const result = handleKeyDown(state, 'ArrowUp')

      expect(result.state.pressedKeys).toEqual(['ArrowUp'])
      expect(result.direction).toBe('N')
    })

    it('should ignore non-arrow keys', () => {
      const state = createKeyboardState()
      const result = handleKeyDown(state, 'a')

      expect(result.state.pressedKeys).toEqual([])
      expect(result.direction).toBe(null)
    })

    it('should ignore already pressed keys (key repeat)', () => {
      const state = { pressedKeys: ['ArrowUp'], isReleasing: false, latchedDirection: null }
      const result = handleKeyDown(state, 'ArrowUp')

      expect(result.state.pressedKeys).toEqual(['ArrowUp'])
    })

    it('should handle multiple keys', () => {
      let state = createKeyboardState()

      // Press Up
      let result = handleKeyDown(state, 'ArrowUp')
      expect(result.direction).toBe('N')

      // Press Right (while holding Up)
      result = handleKeyDown(result.state, 'ArrowRight')
      expect(result.direction).toBe('NE')
      expect(result.state.pressedKeys).toEqual(['ArrowUp', 'ArrowRight'])
    })
  })

  describe('handleKeyUp', () => {
    it('should remove key from pressed keys', () => {
      const state = { pressedKeys: ['ArrowUp', 'ArrowRight'], isReleasing: false, latchedDirection: null }
      const result = handleKeyUp(state, 'ArrowRight')

      expect(result.state.pressedKeys).toEqual(['ArrowUp'])
      expect(result.allKeysReleased).toBe(false)
    })

    it('should trigger latching when going from 2+ keys to <2 keys', () => {
      const state = {
        pressedKeys: ['ArrowUp', 'ArrowRight'],
        isReleasing: false,
        latchedDirection: null
      }
      const result = handleKeyUp(state, 'ArrowRight')

      expect(result.state.isReleasing).toBe(true)
      expect(result.state.latchedDirection).toBe('NE')
    })

    it('should maintain latched direction during release', () => {
      // Start with Up+Right (NE)
      const state1 = {
        pressedKeys: ['ArrowUp', 'ArrowRight'],
        isReleasing: false,
        latchedDirection: null,
      }

      // Release Right - should latch NE
      const result1 = handleKeyUp(state1, 'ArrowRight')
      expect(result1.state.isReleasing).toBe(true)
      expect(result1.state.latchedDirection).toBe('NE')
      expect(result1.direction).toBe('NE')

      // Release Up - should execute with latched NE
      const result2 = handleKeyUp(result1.state, 'ArrowUp')
      expect(result2.allKeysReleased).toBe(true)
      expect(result2.direction).toBe('NE')
    })

    it('should reset state when all keys released', () => {
      const state = { pressedKeys: ['ArrowUp'], isReleasing: true, latchedDirection: 'N' }
      const result = handleKeyUp(state, 'ArrowUp')

      expect(result.allKeysReleased).toBe(true)
      expect(result.state.pressedKeys).toEqual([])
      expect(result.state.isReleasing).toBe(false)
      expect(result.state.latchedDirection).toBe(null)
    })

    it('should ignore non-arrow keys', () => {
      const state = { pressedKeys: ['ArrowUp'], isReleasing: false, latchedDirection: null }
      const result = handleKeyUp(state, 'a')

      expect(result.state.pressedKeys).toEqual(['ArrowUp'])
      expect(result.allKeysReleased).toBe(false)
    })
  })

  describe('resetKeyboardState', () => {
    it('should return fresh initial state', () => {
      const state = resetKeyboardState()
      expect(state.pressedKeys).toEqual([])
      expect(state.isReleasing).toBe(false)
      expect(state.latchedDirection).toBe(null)
    })
  })

  describe('Integration: Multi-key sliding window', () => {
    it('should handle complex key sequence correctly', () => {
      let state = createKeyboardState()

      // Press Up -> N
      let result = handleKeyDown(state, 'ArrowUp')
      expect(result.direction).toBe('N')
      state = result.state

      // Press Right (Up+Right) -> NE
      result = handleKeyDown(state, 'ArrowRight')
      expect(result.direction).toBe('NE')
      state = result.state

      // Press Down (Right+Down, last 2) -> SE
      result = handleKeyDown(state, 'ArrowDown')
      expect(result.direction).toBe('SE')
      state = result.state

      // Press Left (Down+Left, last 2) -> SW
      result = handleKeyDown(state, 'ArrowLeft')
      expect(result.direction).toBe('SW')
      state = result.state

      expect(state.pressedKeys).toEqual(['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'])
    })
  })

  describe('Integration: Direction latching', () => {
    it('should prevent direction flicker on multi-key release', () => {
      let state = createKeyboardState()

      // Build up to Up+Right (NE)
      state = handleKeyDown(state, 'ArrowUp').state
      state = handleKeyDown(state, 'ArrowRight').state
      expect(state.pressedKeys).toEqual(['ArrowUp', 'ArrowRight'])

      // Start releasing - should latch NE
      let result = handleKeyUp(state, 'ArrowRight')
      expect(result.state.isReleasing).toBe(true)
      expect(result.state.latchedDirection).toBe('NE')
      expect(result.direction).toBe('NE') // Still shows NE

      // Complete release - should execute NE
      result = handleKeyUp(result.state, 'ArrowUp')
      expect(result.allKeysReleased).toBe(true)
      expect(result.direction).toBe('NE') // Executes latched NE
    })
  })
})
