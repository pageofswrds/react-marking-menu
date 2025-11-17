import { useEffect, useRef } from 'react'

/**
 * Props for focus management hook
 */
export interface UseFocusManagementProps {
  /**
   * Whether the focus trap is active
   */
  isActive: boolean

  /**
   * Whether to restore focus when deactivated
   * @default true
   */
  restoreFocus?: boolean

  /**
   * Container element to trap focus within
   */
  containerRef?: React.RefObject<HTMLElement>
}

/**
 * Hook for managing focus and focus restoration
 * Stores the previously focused element and restores focus when deactivated
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null)
 * useFocusManagement({
 *   isActive: menuState === 'active',
 *   containerRef,
 *   restoreFocus: true,
 * })
 * ```
 */
export function useFocusManagement({
  isActive,
  restoreFocus = true,
  containerRef,
}: UseFocusManagementProps) {
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Store the currently focused element when activating
    if (isActive && restoreFocus) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
    }

    // Restore focus when deactivating
    return () => {
      if (
        !isActive &&
        restoreFocus &&
        previousActiveElementRef.current &&
        document.body.contains(previousActiveElementRef.current)
      ) {
        // Small delay to ensure UI has updated
        setTimeout(() => {
          previousActiveElementRef.current?.focus()
        }, 0)
      }
    }
  }, [isActive, restoreFocus])

  // Focus trap effect
  useEffect(() => {
    if (!isActive || !containerRef?.current) return

    const container = containerRef.current

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trap Tab key
      if (e.key !== 'Tab') return

      const focusableElements = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, containerRef])
}
