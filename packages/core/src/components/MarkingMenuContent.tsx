import React, { useMemo } from 'react'
import { useMarkingMenuContext } from '../hooks/useMarkingMenuContext'

/**
 * Props for MarkingMenuContent component
 */
export interface MarkingMenuContentProps {
  /**
   * Child elements (typically MarkingMenuItem components)
   */
  children: React.ReactNode

  /**
   * Render function that receives menu state
   */
  render?: (props: {
    state: ReturnType<typeof useMarkingMenuContext>['state']
    origin: ReturnType<typeof useMarkingMenuContext>['origin']
    currentDirection: ReturnType<typeof useMarkingMenuContext>['currentDirection']
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
   * Whether to force show the menu (for testing/demo purposes)
   * @default false
   */
  forceMount?: boolean
}

/**
 * Content container for marking menu
 * Only renders when menu is active (after press threshold)
 * Provides positioning context for menu items
 *
 * @example
 * ```tsx
 * <MarkingMenuContent>
 *   <MarkingMenuItem direction="N" id="copy">Copy</MarkingMenuItem>
 *   <MarkingMenuItem direction="E" id="paste">Paste</MarkingMenuItem>
 * </MarkingMenuContent>
 *
 * // With render prop
 * <MarkingMenuContent>
 *   {({ state, origin, currentDirection }) => (
 *     <div style={{ left: origin?.x, top: origin?.y }}>
 *       <MarkingMenuItem direction="N" id="copy">Copy</MarkingMenuItem>
 *     </div>
 *   )}
 * </MarkingMenuContent>
 * ```
 */
export function MarkingMenuContent({
  children,
  render,
  className,
  style,
  forceMount = false,
}: MarkingMenuContentProps) {
  const { state, origin, currentDirection, a11y } = useMarkingMenuContext()

  // Only show when menu is active or selecting (or forced)
  const shouldRender = forceMount || state === 'active' || state === 'selecting'

  // Positioning styles based on origin
  const positionStyles = useMemo(() => {
    if (!origin) return {}

    return {
      position: 'fixed' as const,
      left: origin.x,
      top: origin.y,
      pointerEvents: 'none' as const, // Prevent interfering with pointer events
      zIndex: 9999, // Ensure menu appears above other content
    }
  }, [origin])

  if (!shouldRender) {
    return null
  }

  const mergedStyle = { ...positionStyles, ...style }

  // ARIA attributes
  const ariaProps = {
    role: 'menu' as const,
    'aria-label': a11y.label,
  }

  if (render) {
    return (
      <div {...ariaProps} className={className} style={mergedStyle}>
        {render({ state, origin, currentDirection })}
      </div>
    )
  }

  return (
    <div {...ariaProps} className={className} style={mergedStyle}>
      {children}
    </div>
  )
}

MarkingMenuContent.displayName = 'MarkingMenuContent'
