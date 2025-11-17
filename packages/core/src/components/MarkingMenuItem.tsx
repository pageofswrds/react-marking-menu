import React, { useEffect, useMemo } from 'react'
import { useMarkingMenuContext } from '../hooks/useMarkingMenuContext'
import type { Direction, Direction4 } from '../types'

/**
 * Render props for MarkingMenuItem
 */
export interface MarkingMenuItemRenderProps {
  /**
   * Whether this item is currently highlighted (cursor/keys pointing at it)
   */
  isHighlighted: boolean

  /**
   * Whether this item is the selected item
   */
  isSelected: boolean

  /**
   * Whether the item is disabled
   */
  isDisabled: boolean

  /**
   * The direction slot for this item
   */
  direction: Direction | Direction4

  /**
   * The menu state
   */
  state: 'idle' | 'pressed' | 'active' | 'selecting'
}

/**
 * Props for MarkingMenuItem component
 */
export interface MarkingMenuItemProps {
  /**
   * Unique identifier for this menu item
   */
  id: string

  /**
   * Direction slot for this item
   */
  direction: Direction | Direction4

  /**
   * Label for the menu item
   */
  label?: string

  /**
   * Optional icon component or element
   */
  icon?: React.ReactNode

  /**
   * Callback when item is selected
   */
  onSelect?: () => void

  /**
   * Whether this item is disabled
   */
  disabled?: boolean

  /**
   * Children (can be render function or React node)
   */
  children?:
    | React.ReactNode
    | ((props: MarkingMenuItemRenderProps) => React.ReactNode)

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
 * Individual menu item component
 * Automatically registers/unregisters with the parent menu
 * Supports render props for custom styling based on state
 *
 * @example
 * ```tsx
 * // Simple usage
 * <MarkingMenuItem id="copy" direction="N" label="Copy" onSelect={handleCopy} />
 *
 * // With render prop
 * <MarkingMenuItem id="copy" direction="N" onSelect={handleCopy}>
 *   {({ isHighlighted, isSelected }) => (
 *     <div className={isHighlighted ? 'highlighted' : ''}>
 *       Copy
 *     </div>
 *   )}
 * </MarkingMenuItem>
 *
 * // With icon
 * <MarkingMenuItem
 *   id="copy"
 *   direction="N"
 *   label="Copy"
 *   icon={<CopyIcon />}
 *   onSelect={handleCopy}
 * />
 * ```
 */
export function MarkingMenuItem({
  id,
  direction,
  label,
  icon,
  onSelect,
  disabled = false,
  children,
  className,
  style,
}: MarkingMenuItemProps) {
  const { registerItem, unregisterItem, currentDirection, selectedItem, state } =
    useMarkingMenuContext()

  // Register/unregister on mount/unmount
  useEffect(() => {
    registerItem({
      id,
      direction,
      label: label || '',
      icon,
      onSelect,
      disabled,
    })

    return () => {
      unregisterItem(id)
    }
  }, [id, direction, label, icon, onSelect, disabled, registerItem, unregisterItem])

  // Check if this item is highlighted
  const isHighlighted = currentDirection === direction
  const isSelected = selectedItem === id

  // Render props
  const renderProps: MarkingMenuItemRenderProps = useMemo(
    () => ({
      isHighlighted,
      isSelected,
      isDisabled: disabled,
      direction,
      state,
    }),
    [isHighlighted, isSelected, disabled, direction, state]
  )

  // Handle children as render function
  const content =
    typeof children === 'function' ? (
      children(renderProps)
    ) : children ? (
      children
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon && <span>{icon}</span>}
        {label && <span>{label}</span>}
      </div>
    )

  // Apply default styling for highlighted/selected states if no custom children
  const mergedClassName = className
    ? `${className} ${isHighlighted ? 'marking-menu-item-highlighted' : ''} ${isSelected ? 'marking-menu-item-selected' : ''} ${disabled ? 'marking-menu-item-disabled' : ''}`
    : `${isHighlighted ? 'marking-menu-item-highlighted' : ''} ${isSelected ? 'marking-menu-item-selected' : ''} ${disabled ? 'marking-menu-item-disabled' : ''}`

  return (
    <div
      className={mergedClassName.trim()}
      style={style}
      data-direction={direction}
      data-item-id={id}
      data-highlighted={isHighlighted}
      data-selected={isSelected}
      data-disabled={disabled}
    >
      {content}
    </div>
  )
}

MarkingMenuItem.displayName = 'MarkingMenuItem'
