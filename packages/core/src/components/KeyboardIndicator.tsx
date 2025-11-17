import React, { useMemo } from 'react'
import { useMarkingMenuContext } from '../hooks/useMarkingMenuContext'
import type { ArrowKey } from '../utils/keyboard'

/**
 * Props for KeyboardIndicator component
 */
export interface KeyboardIndicatorProps {
  /**
   * Render function for custom visualization
   */
  render?: (props: {
    pressedKeys: ArrowKey[]
    isReleasing: boolean
    latchedDirection: string | null
  }) => React.ReactNode

  /**
   * Additional class name
   */
  className?: string

  /**
   * Additional styles
   */
  style?: React.CSSProperties

  /**
   * Whether to show the indicator
   * @default true
   */
  show?: boolean
}

/**
 * Visual indicator showing which arrow keys are currently pressed
 * Helpful for learning keyboard navigation
 *
 * @example
 * ```tsx
 * <KeyboardIndicator />
 *
 * // Custom rendering
 * <KeyboardIndicator>
 *   {({ pressedKeys, isReleasing }) => (
 *     <div>
 *       Keys: {pressedKeys.join(' + ')}
 *       {isReleasing && ' (releasing)'}
 *     </div>
 *   )}
 * </KeyboardIndicator>
 * ```
 */
export function KeyboardIndicator({
  render,
  className,
  style,
  show = true,
}: KeyboardIndicatorProps) {
  const { keyboardState, currentDirection } = useMarkingMenuContext()

  // Format key names for display
  const formatKey = (key: ArrowKey): string => {
    return key.replace('Arrow', '')
  }

  // Default rendering
  const defaultRender = useMemo(() => {
    if (!keyboardState.pressedKeys.length) {
      return null
    }

    const keys = keyboardState.pressedKeys.map(formatKey).join(' + ')
    const status = keyboardState.isReleasing ? ' (releasing)' : ''

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          padding: '0.5rem',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          ...style,
        }}
        className={className}
      >
        <div>
          <strong>Keys:</strong> {keys}
          {status}
        </div>
        {currentDirection && (
          <div>
            <strong>Direction:</strong> {currentDirection}
          </div>
        )}
        {keyboardState.latchedDirection && (
          <div>
            <strong>Latched:</strong> {keyboardState.latchedDirection}
          </div>
        )}
      </div>
    )
  }, [keyboardState, currentDirection, className, style])

  if (!show || !keyboardState.pressedKeys.length) {
    return null
  }

  if (render) {
    return (
      <div className={className} style={style}>
        {render({
          pressedKeys: keyboardState.pressedKeys,
          isReleasing: keyboardState.isReleasing,
          latchedDirection: keyboardState.latchedDirection,
        })}
      </div>
    )
  }

  return defaultRender
}

KeyboardIndicator.displayName = 'KeyboardIndicator'
