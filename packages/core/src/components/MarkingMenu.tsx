import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react'
import { useMarkingMenuGesture } from '../hooks/useMarkingMenuGesture'
import { LiveRegion } from './LiveRegion'
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
  a11y: Required<AccessibilityConfig>
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
 * Accessibility configuration for marking menu
 */
export interface AccessibilityConfig {
  /**
   * Enable screen reader announcements
   * @default true
   */
  announcements?: boolean

  /**
   * Custom announcement messages
   */
  messages?: {
    menuOpened?: string
    directionChanged?: (direction: Direction | Direction4) => string
    itemSelected?: (label: string) => string
    menuCancelled?: string
  }

  /**
   * ARIA label for the menu
   */
  label?: string

  /**
   * ARIA description for the menu
   */
  description?: string
}

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
   * Accessibility configuration
   */
  a11y?: AccessibilityConfig

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
  a11y,
  onSelect,
  onCancel,
  disabled = false,
}: MarkingMenuProps) {
  // Internal state for registered items
  const [items, setItems] = useState<MenuItem[]>([])
  const [announcement, setAnnouncement] = useState<string>('')

  // Default config
  const defaultConfig: Required<GestureConfig> = {
    pressThreshold: config?.pressThreshold ?? 150,
    minDistance: config?.minDistance ?? 30,
    directions: config?.directions ?? 8,
    preventContextMenu: config?.preventContextMenu ?? true,
  }

  // Default accessibility config
  const defaultA11y: Required<AccessibilityConfig> = {
    announcements: a11y?.announcements ?? true,
    messages: {
      menuOpened: a11y?.messages?.menuOpened ?? 'Marking menu opened',
      directionChanged:
        a11y?.messages?.directionChanged ??
        ((direction) => `${direction} direction selected`),
      itemSelected:
        a11y?.messages?.itemSelected ?? ((label) => `${label} selected`),
      menuCancelled: a11y?.messages?.menuCancelled ?? 'Menu cancelled',
    },
    label: a11y?.label ?? 'Marking menu',
    description:
      a11y?.description ??
      'Press and hold, then drag or use arrow keys to select an action',
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
      a11y: defaultA11y,
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
      defaultA11y.announcements,
      defaultA11y.label,
      defaultA11y.description,
      items,
      registerItem,
      unregisterItem,
    ]
  )

  // Announcements for screen readers
  useEffect(() => {
    if (!defaultA11y.announcements) return

    // Announce when menu opens
    if (gesture.state === 'active') {
      setAnnouncement(defaultA11y.messages.menuOpened)
    }
  }, [gesture.state, defaultA11y])

  useEffect(() => {
    if (!defaultA11y.announcements) return

    // Announce direction changes
    if (gesture.currentDirection && gesture.state === 'selecting') {
      const item = items.find((i) => i.direction === gesture.currentDirection)
      if (item) {
        setAnnouncement(defaultA11y.messages.directionChanged(gesture.currentDirection))
      }
    }
  }, [gesture.currentDirection, gesture.state, items, defaultA11y])

  return (
    <MarkingMenuContext.Provider value={contextValue}>
      {!disabled && children}
      {defaultA11y.announcements && <LiveRegion message={announcement} />}
    </MarkingMenuContext.Provider>
  )
}

MarkingMenu.displayName = 'MarkingMenu'
