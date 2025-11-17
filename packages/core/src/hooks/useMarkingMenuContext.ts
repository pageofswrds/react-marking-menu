import { useContext } from 'react'
import { MarkingMenuContext } from '../components/MarkingMenu'
import type { MarkingMenuContextValue } from '../components/MarkingMenu'

/**
 * Hook to access marking menu context
 * Must be used within a MarkingMenu component
 *
 * @throws Error if used outside of MarkingMenu context
 *
 * @example
 * ```tsx
 * function CustomTrigger() {
 *   const { state, getTriggerProps } = useMarkingMenuContext()
 *   return <button {...getTriggerProps()}>Open menu</button>
 * }
 * ```
 */
export function useMarkingMenuContext(): MarkingMenuContextValue {
  const context = useContext(MarkingMenuContext)

  if (!context) {
    throw new Error(
      'useMarkingMenuContext must be used within a MarkingMenu component. ' +
        'Make sure your component is wrapped in <MarkingMenu>...</MarkingMenu>.'
    )
  }

  return context
}
