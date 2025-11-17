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
  const { getTriggerProps } = useMarkingMenuContext()
  const triggerProps = getTriggerProps()

  if (asChild) {
    // Clone the child element and merge props
    const child = React.Children.only(children) as React.ReactElement

    return React.cloneElement(child, {
      ...triggerProps,
      ...child.props,
      className: className
        ? `${child.props.className || ''} ${className}`.trim()
        : child.props.className,
      style: style ? { ...child.props.style, ...style } : child.props.style,
    })
  }

  // Render default button
  return (
    <button {...triggerProps} className={className} style={style} type="button">
      {children}
    </button>
  )
}

MarkingMenuTrigger.displayName = 'MarkingMenuTrigger'
