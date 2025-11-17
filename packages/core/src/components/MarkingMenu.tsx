import React, { createContext, useState, useCallback, useMemo } from 'react'
import { useMarkingMenuGesture } from '../hooks/useMarkingMenuGesture'
import type { MenuItem, GestureConfig, MenuState, Position, Direction, Direction4 } from '../types'
import type { KeyboardState } from '../utils/keyboard'

/**
 * Extended context value with gesture handlers
 */
export interface MarkingMenuContextValue {
  state: MenuState
  origin: Position | null
  currentDirection: Direction | Direction4 | null
  selectedItem: string | null
  config: Required<GestureConfig>
  items: MenuItem[]
  registerItem: (item: MenuItem) => void
  unregisterItem: (id: string) => void
  getTriggerProps: () => ReturnType<ReturnType<typeof useMarkingMenuGesture>['getTriggerProps']>
  keyboardState: KeyboardState
}

/**
 * Context for marking menu state and actions
 */
export const MarkingMenuContext = createContext<MarkingMenuContextValue | null>(null)

/**
 * Props for MarkingMenu root component
 */
export interface MarkingMenuProps {
  /**
   * Child elements (typically MarkingMenuTrigger and MarkingMenuContent)
   */
  children: React.ReactNode

  /**
   * Configuration for gesture recognition
   */
  config?: GestureConfig

  /**
   * Callback when an item is selected
   */
  onSelect?: (itemId: string) => void

  /**
   * Callback when the menu is cancelled
   */
  onCancel?: () => void

  /**
   * Whether the menu is disabled
   * @default false
   */
  disabled?: boolean
}

/**
 * Root marking menu component that provides context to all child components
 * This is a headless component - it only manages state and behavior
 *
 * @example
 * ```tsx
 * <MarkingMenu onSelect={(id) => console.log(id)}>
 *   <MarkingMenuTrigger>
 *     <button>Press me</button>
 *   </MarkingMenuTrigger>
 *   <MarkingMenuContent>
 *     <MarkingMenuItem direction="N" id="copy">
 *       Copy
 *     </MarkingMenuItem>
 *   </MarkingMenuContent>
 * </MarkingMenu>
 * ```
 */
export function MarkingMenu({
  children,
  config,
  onSelect,
  onCancel,
  disabled = false,
}: MarkingMenuProps) {
  // Internal state for registered items
  const [items, setItems] = useState<MenuItem[]>([])

  // Default config
  const defaultConfig: Required<GestureConfig> = {
    pressThreshold: config?.pressThreshold ?? 150,
    minDistance: config?.minDistance ?? 30,
    directions: config?.directions ?? 8,
    preventContextMenu: config?.preventContextMenu ?? true,
  }

  // Register a menu item
  const registerItem = useCallback((item: MenuItem) => {
    setItems((prev) => {
      // Check if item already exists
      const existingIndex = prev.findIndex((i) => i.id === item.id)
      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...prev]
        newItems[existingIndex] = item
        return newItems
      }
      // Add new item
      return [...prev, item]
    })
  }, [])

  // Unregister a menu item
  const unregisterItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // Use the gesture hook
  const gesture = useMarkingMenuGesture({
    config: defaultConfig,
    items,
    onSelect,
    onCancel,
    enabled: !disabled,
  })

  // Context value
  const contextValue = useMemo<MarkingMenuContextValue>(
    () => ({
      state: gesture.state,
      origin: gesture.origin,
      currentDirection: gesture.currentDirection,
      selectedItem: gesture.selectedItem,
      config: defaultConfig,
      items,
      registerItem,
      unregisterItem,
      getTriggerProps: gesture.getTriggerProps,
      keyboardState: gesture.keyboardState,
    }),
    [
      gesture.state,
      gesture.origin,
      gesture.currentDirection,
      gesture.selectedItem,
      gesture.getTriggerProps,
      gesture.keyboardState,
      defaultConfig.pressThreshold,
      defaultConfig.minDistance,
      defaultConfig.directions,
      defaultConfig.preventContextMenu,
      items,
      registerItem,
      unregisterItem,
    ]
  )

  return (
    <MarkingMenuContext.Provider value={contextValue}>
      {!disabled && children}
    </MarkingMenuContext.Provider>
  )
}

MarkingMenu.displayName = 'MarkingMenu'
