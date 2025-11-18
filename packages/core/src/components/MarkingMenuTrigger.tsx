import React from 'react'
import { useMarkingMenuContext } from '../hooks/useMarkingMenuContext'

/**
 * Props for MarkingMenuTrigger component
 */
export interface MarkingMenuTriggerProps {
  /**
   * Child element or render function
   */
  children: React.ReactNode

  /**
   * Merge props with the child element instead of wrapping
   * When true, children must be a single element that accepts ref
   * @default false
   */
  asChild?: boolean

  /**
   * Additional class name
   */
  className?: string

  /**
   * Additional styles
   */
  style?: React.CSSProperties
}

/**
 * Trigger component for marking menu
 * Handles the gesture interaction (pointer and keyboard)
 *
 * @example
 * ```tsx
 * // Default button
 * <MarkingMenuTrigger>
 *   Press me
 * </MarkingMenuTrigger>
 *
 * // Custom element with asChild
 * <MarkingMenuTrigger asChild>
 *   <button className="my-button">Press me</button>
 * </MarkingMenuTrigger>
 * ```
 */
export function MarkingMenuTrigger({
  children,
  asChild = false,
  className,
  style,
}: MarkingMenuTriggerProps) {
  const { getTriggerProps, a11y, state } = useMarkingMenuContext()
  const triggerProps = getTriggerProps()

  // ARIA attributes
  const ariaProps = {
    'aria-label': a11y.label,
    'aria-expanded': state === 'active' || state === 'selecting',
    'aria-haspopup': 'menu' as const,
    'aria-describedby': a11y.description ? 'marking-menu-description' : undefined,
  }

  // Data attributes for styling based on state
  const dataProps = {
    'data-state': state,
    'data-idle': state === 'idle' ? '' : undefined,
    'data-pressed': state === 'pressed' ? '' : undefined,
    'data-active': state === 'active' ? '' : undefined,
    'data-selecting': state === 'selecting' ? '' : undefined,
  }

  if (asChild) {
    // Clone the child element and merge props
    const child = React.Children.only(children) as React.ReactElement

    return React.cloneElement(child, {
      ...triggerProps,
      ...ariaProps,
      ...dataProps,
      ...child.props,
      className: className
        ? `${child.props.className || ''} ${className}`.trim()
        : child.props.className,
      style: style ? { ...child.props.style, ...style } : child.props.style,
    })
  }

  // Render default button
  return (
    <>
      <button
        {...triggerProps}
        {...ariaProps}
        {...dataProps}
        className={className}
        style={style}
        type="button"
      >
        {children}
      </button>
      {a11y.description && (
        <div
          id="marking-menu-description"
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
          {a11y.description}
        </div>
      )}
    </>
  )
}

MarkingMenuTrigger.displayName = 'MarkingMenuTrigger'
