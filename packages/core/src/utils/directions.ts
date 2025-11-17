import type { Direction, Direction4 } from '../types'

/**
 * Calculate the direction from an origin point to a target point
 * @param x Target X coordinate
 * @param y Target Y coordinate
 * @param originX Origin X coordinate
 * @param originY Origin Y coordinate
 * @param directions Number of directions (4 or 8)
 * @returns Direction enum value
 */
export function getDirectionFromPosition(
  x: number,
  y: number,
  originX: number,
  originY: number,
  directions: 4 | 8 = 8
): Direction | Direction4 {
  const dx = x - originX
  const dy = y - originY

  // Invert Y-axis because screen coordinates have Y increasing downward
  // but we want North to be up (negative Y direction)
  // Calculate angle in degrees (0° = East, counterclockwise)
  let angle = Math.atan2(-dy, dx) * (180 / Math.PI)

  // Normalize to 0-360 range
  angle = (angle + 360) % 360

  if (directions === 8) {
    return getDirection8(angle)
  } else {
    return getDirection4(angle)
  }
}

/**
 * Map angle to one of 8 directions
 */
function getDirection8(angle: number): Direction {
  // Each direction covers 45° (360° / 8)
  // Adjust so that E is centered at 0°
  const normalized = (angle + 22.5) % 360

  if (normalized < 45) return 'E'
  if (normalized < 90) return 'SE'
  if (normalized < 135) return 'S'
  if (normalized < 180) return 'SW'
  if (normalized < 225) return 'W'
  if (normalized < 270) return 'NW'
  if (normalized < 315) return 'N'
  return 'NE'
}

/**
 * Map angle to one of 4 directions
 */
function getDirection4(angle: number): Direction4 {
  // Each direction covers 90° (360° / 4)
  const normalized = (angle + 45) % 360

  if (normalized < 90) return 'E'
  if (normalized < 180) return 'S'
  if (normalized < 270) return 'W'
  return 'N'
}

/**
 * Convert direction to angle in degrees (for visual rendering)
 * @param direction Direction enum value
 * @returns Angle in degrees (0° = East)
 */
export function directionToAngle(direction: Direction | Direction4): number {
  const angles: Record<Direction, number> = {
    E: 0,
    SE: 45,
    S: 90,
    SW: 135,
    W: 180,
    NW: 225,
    N: 270,
    NE: 315,
  }

  return angles[direction as Direction] ?? 0
}

/**
 * Calculate distance between two points
 */
export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Get all available directions for a given direction count
 */
export function getAvailableDirections(directions: 4 | 8): Array<Direction | Direction4> {
  if (directions === 4) {
    return ['N', 'E', 'S', 'W']
  }
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
}
