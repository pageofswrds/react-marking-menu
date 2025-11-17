import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import {
  MarkingMenu,
  MarkingMenuTrigger,
  MarkingMenuContent,
  MarkingMenuItem,
} from '../index'

describe('Component Integration', () => {
  describe('MarkingMenu', () => {
    it('should render trigger and content', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent>
            <MarkingMenuItem id="test" direction="N" label="Test" />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      expect(screen.getByText('Press me')).toBeInTheDocument()
    })

    it('should not render when disabled', () => {
      render(
        <MarkingMenu disabled>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
        </MarkingMenu>
      )

      expect(screen.queryByText('Press me')).not.toBeInTheDocument()
    })

    it('should call onSelect when item is selected', async () => {
      const handleSelect = vi.fn()

      const { container } = render(
        <MarkingMenu onSelect={handleSelect}>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <MarkingMenuItem id="copy" direction="N" label="Copy" />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      const trigger = screen.getByText('Press me')

      // Simulate press and hold
      fireEvent.pointerDown(trigger, { clientX: 100, clientY: 100, button: 0, pointerId: 1 })

      // Wait for active state
      await waitFor(() => {
        const content = container.querySelector('[role="menu"]')
        expect(content).toBeInTheDocument()
      })

      // Move pointer
      fireEvent.pointerMove(trigger, { clientX: 100, clientY: 50, pointerId: 1 })

      // Release
      fireEvent.pointerUp(trigger, { pointerId: 1 })

      expect(handleSelect).toHaveBeenCalledWith('copy')
    })
  })

  describe('MarkingMenuTrigger', () => {
    it('should have correct ARIA attributes', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent />
        </MarkingMenu>
      )

      const trigger = screen.getByText('Press me')
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('should support asChild prop', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger asChild>
            <div data-testid="custom-trigger">Custom trigger</div>
          </MarkingMenuTrigger>
          <MarkingMenuContent />
        </MarkingMenu>
      )

      const trigger = screen.getByTestId('custom-trigger')
      expect(trigger.tagName).toBe('DIV')
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    })

    it('should handle keyboard events', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <MarkingMenuItem id="test" direction="N" label="Test" />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      const trigger = screen.getByText('Press me')

      // Press arrow key
      fireEvent.keyDown(trigger, { key: 'ArrowUp' })

      // Content should be visible
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('should cancel on Escape key', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent>
            <MarkingMenuItem id="test" direction="N" label="Test" />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      const trigger = screen.getByText('Press me')

      // Press arrow key
      fireEvent.keyDown(trigger, { key: 'ArrowUp' })

      // Press Escape
      fireEvent.keyDown(trigger, { key: 'Escape' })

      // Content should not be visible
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  describe('MarkingMenuContent', () => {
    it('should not render when menu is idle', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent>
            <div data-testid="content">Content</div>
          </MarkingMenuContent>
        </MarkingMenu>
      )

      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('should render when forceMount is true', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <div data-testid="content">Content</div>
          </MarkingMenuContent>
        </MarkingMenu>
      )

      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('should have role="menu"', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount />
        </MarkingMenu>
      )

      const menu = screen.getByRole('menu')
      expect(menu).toBeInTheDocument()
    })

    it('should support render prop', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent
            forceMount
            render={({ state }) => <div data-testid="state">{state}</div>}
          />
        </MarkingMenu>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('idle')
    })
  })

  describe('MarkingMenuItem', () => {
    it('should register with context on mount', () => {
      const { unmount } = render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <MarkingMenuItem id="copy" direction="N" label="Copy" />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      const item = screen.getByText('Copy')
      expect(item).toBeInTheDocument()

      unmount()
    })

    it('should have role="menuitem"', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <MarkingMenuItem id="copy" direction="N" label="Copy" />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      const item = screen.getByRole('menuitem')
      expect(item).toBeInTheDocument()
      expect(item).toHaveAttribute('aria-label', 'Copy')
    })

    it('should support render prop', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <MarkingMenuItem id="copy" direction="N" label="Copy">
              {({ isHighlighted }) => (
                <div data-testid="item">{isHighlighted ? 'Highlighted' : 'Normal'}</div>
              )}
            </MarkingMenuItem>
          </MarkingMenuContent>
        </MarkingMenu>
      )

      expect(screen.getByTestId('item')).toHaveTextContent('Normal')
    })

    it('should mark disabled items', () => {
      render(
        <MarkingMenu>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <MarkingMenuItem id="copy" direction="N" label="Copy" disabled />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      const item = screen.getByRole('menuitem')
      expect(item).toHaveAttribute('aria-disabled', 'true')
      expect(item).toHaveAttribute('data-disabled', 'true')
    })
  })

  describe('Accessibility', () => {
    it('should announce menu state changes', () => {
      const { container } = render(
        <MarkingMenu
          a11y={{
            announcements: true,
            label: 'Test menu',
          }}
        >
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <MarkingMenuItem id="test" direction="N" label="Test" />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      // Live region should exist
      const liveRegion = container.querySelector('[role="status"]')
      expect(liveRegion).toBeInTheDocument()
    })

    it('should support custom accessibility config', () => {
      render(
        <MarkingMenu
          a11y={{
            label: 'Custom menu',
            description: 'Custom description',
          }}
        >
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount />
        </MarkingMenu>
      )

      const trigger = screen.getByText('Press me')
      expect(trigger).toHaveAttribute('aria-label', 'Custom menu')

      const menu = screen.getByRole('menu')
      expect(menu).toHaveAttribute('aria-label', 'Custom menu')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should handle arrow key navigation', () => {
      const handleSelect = vi.fn()

      render(
        <MarkingMenu onSelect={handleSelect}>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <MarkingMenuItem id="north" direction="N" label="North" />
            <MarkingMenuItem id="east" direction="E" label="East" />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      const trigger = screen.getByText('Press me')

      // Press and hold Up arrow
      fireEvent.keyDown(trigger, { key: 'ArrowUp' })

      // Release
      fireEvent.keyUp(trigger, { key: 'ArrowUp' })

      expect(handleSelect).toHaveBeenCalledWith('north')
    })

    it('should handle multi-key combinations', () => {
      const handleSelect = vi.fn()

      render(
        <MarkingMenu onSelect={handleSelect}>
          <MarkingMenuTrigger>Press me</MarkingMenuTrigger>
          <MarkingMenuContent forceMount>
            <MarkingMenuItem id="northeast" direction="NE" label="Northeast" />
          </MarkingMenuContent>
        </MarkingMenu>
      )

      const trigger = screen.getByText('Press me')

      // Press Up
      fireEvent.keyDown(trigger, { key: 'ArrowUp' })

      // Press Right (while holding Up)
      fireEvent.keyDown(trigger, { key: 'ArrowRight' })

      // Release both
      fireEvent.keyUp(trigger, { key: 'ArrowRight' })
      fireEvent.keyUp(trigger, { key: 'ArrowUp' })

      expect(handleSelect).toHaveBeenCalledWith('northeast')
    })
  })
})
