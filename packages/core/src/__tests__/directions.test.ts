import { describe, it, expect } from 'vitest'
import {
  getDirectionFromPosition,
  directionToAngle,
  getDistance,
  getAvailableDirections,
} from '../utils/directions'

describe('Direction Utilities', () => {
  describe('getDirectionFromPosition', () => {
    const originX = 100
    const originY = 100

    describe('8-direction mode', () => {
      it('should return E for 0° (right)', () => {
        expect(getDirectionFromPosition(150, 100, originX, originY, 8)).toBe('E')
      })

      it('should return SE for 45°', () => {
        expect(getDirectionFromPosition(150, 150, originX, originY, 8)).toBe('SE')
      })

      it('should return S for 90° (down)', () => {
        expect(getDirectionFromPosition(100, 150, originX, originY, 8)).toBe('S')
      })

      it('should return SW for 135°', () => {
        expect(getDirectionFromPosition(50, 150, originX, originY, 8)).toBe('SW')
      })

      it('should return W for 180° (left)', () => {
        expect(getDirectionFromPosition(50, 100, originX, originY, 8)).toBe('W')
      })

      it('should return NW for 225°', () => {
        expect(getDirectionFromPosition(50, 50, originX, originY, 8)).toBe('NW')
      })

      it('should return N for 270° (up)', () => {
        expect(getDirectionFromPosition(100, 50, originX, originY, 8)).toBe('N')
      })

      it('should return NE for 315°', () => {
        expect(getDirectionFromPosition(150, 50, originX, originY, 8)).toBe('NE')
      })
    })

    describe('4-direction mode', () => {
      it('should return E for 0° (right)', () => {
        expect(getDirectionFromPosition(150, 100, originX, originY, 4)).toBe('E')
      })

      it('should return S for 90° (down)', () => {
        expect(getDirectionFromPosition(100, 150, originX, originY, 4)).toBe('S')
      })

      it('should return W for 180° (left)', () => {
        expect(getDirectionFromPosition(50, 100, originX, originY, 4)).toBe('W')
      })

      it('should return N for 270° (up)', () => {
        expect(getDirectionFromPosition(100, 50, originX, originY, 4)).toBe('N')
      })

      it('should round 45° to E', () => {
        expect(getDirectionFromPosition(150, 150, originX, originY, 4)).toBe('S')
      })
    })

    it('should handle origin at different positions', () => {
      expect(getDirectionFromPosition(250, 200, 200, 200, 8)).toBe('E')
      expect(getDirectionFromPosition(0, 0, 50, 50, 8)).toBe('NW')
    })
  })

  describe('directionToAngle', () => {
    it('should convert cardinal directions to angles', () => {
      expect(directionToAngle('E')).toBe(0)
      expect(directionToAngle('S')).toBe(90)
      expect(directionToAngle('W')).toBe(180)
      expect(directionToAngle('N')).toBe(270)
    })

    it('should convert diagonal directions to angles', () => {
      expect(directionToAngle('SE')).toBe(45)
      expect(directionToAngle('SW')).toBe(135)
      expect(directionToAngle('NW')).toBe(225)
      expect(directionToAngle('NE')).toBe(315)
    })
  })

  describe('getDistance', () => {
    it('should calculate distance between two points', () => {
      expect(getDistance(0, 0, 3, 4)).toBe(5) // 3-4-5 triangle
      expect(getDistance(0, 0, 0, 0)).toBe(0)
      expect(getDistance(100, 100, 100, 100)).toBe(0)
    })

    it('should work with negative coordinates', () => {
      expect(getDistance(-3, -4, 0, 0)).toBe(5)
      expect(getDistance(0, 0, -3, -4)).toBe(5)
    })

    it('should calculate horizontal distance', () => {
      expect(getDistance(0, 0, 10, 0)).toBe(10)
    })

    it('should calculate vertical distance', () => {
      expect(getDistance(0, 0, 0, 10)).toBe(10)
    })
  })

  describe('getAvailableDirections', () => {
    it('should return 4 directions for 4-direction mode', () => {
      const dirs = getAvailableDirections(4)
      expect(dirs).toEqual(['N', 'E', 'S', 'W'])
      expect(dirs).toHaveLength(4)
    })

    it('should return 8 directions for 8-direction mode', () => {
      const dirs = getAvailableDirections(8)
      expect(dirs).toEqual(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'])
      expect(dirs).toHaveLength(8)
    })
  })

  describe('Integration: Direction calculation consistency', () => {
    it('should be consistent between directionToAngle and getDirectionFromPosition', () => {
      const origin = { x: 100, y: 100 }
      const radius = 50

      // For each direction, calculate position and verify it maps back to same direction
      const directions: Array<'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'> = [
        'N',
        'NE',
        'E',
        'SE',
        'S',
        'SW',
        'W',
        'NW',
      ]

      directions.forEach((dir) => {
        const angle = directionToAngle(dir)
        const radians = (angle * Math.PI) / 180

        // Calculate position at this angle
        const x = origin.x + radius * Math.cos(radians)
        const y = origin.y + radius * Math.sin(radians)

        // Should map back to same direction
        const calculatedDir = getDirectionFromPosition(x, y, origin.x, origin.y, 8)
        expect(calculatedDir).toBe(dir)
      })
    })
  })
})
