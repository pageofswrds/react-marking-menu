import React, { useEffect, useRef } from 'react'

/**
 * Props for LiveRegion component
 */
export interface LiveRegionProps {
  /**
   * Message to announce to screen readers
   */
  message: string

  /**
   * ARIA live region politeness level
   * - 'polite': Waits for user to pause before announcing
   * - 'assertive': Interrupts immediately
   * @default 'polite'
   */
  politeness?: 'polite' | 'assertive'

  /**
   * Whether to clear the message after announcing
   * @default true
   */
  clearOnAnnounce?: boolean

  /**
   * Delay in ms before clearing message
   * @default 1000
   */
  clearDelay?: number
}

/**
 * Live region component for screen reader announcements
 * Hidden visually but accessible to screen readers
 *
 * @example
 * ```tsx
 * <LiveRegion
 *   message="North direction selected"
 *   politeness="polite"
 * />
 * ```
 */
export function LiveRegion({
  message,
  politeness = 'polite',
  clearOnAnnounce = true,
  clearDelay = 1000,
}: LiveRegionProps) {
  const messageRef = useRef<string>('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [currentMessage, setCurrentMessage] = React.useState('')

  useEffect(() => {
    // Only update if message actually changed
    if (message && message !== messageRef.current) {
      messageRef.current = message
      setCurrentMessage(message)

      // Clear message after delay to allow re-announcement of same message
      if (clearOnAnnounce) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          setCurrentMessage('')
          messageRef.current = ''
        }, clearDelay)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [message, clearOnAnnounce, clearDelay])

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {currentMessage}
    </div>
  )
}

LiveRegion.displayName = 'LiveRegion'
