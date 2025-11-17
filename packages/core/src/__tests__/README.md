# Test Suite

Comprehensive test coverage for @react-marking-menu/core

## Test Files

### Unit Tests

#### `keyboard.test.ts`
Tests for keyboard utilities (`utils/keyboard.ts`):
- Arrow key validation
- Single key to direction mapping
- Two key to diagonal direction mapping
- Invalid combination handling (opposite keys)
- Sliding window implementation (most recent 2 keys)
- Direction latching on multi-key release
- Keyboard state management
- Integration tests for complex key sequences

#### `directions.test.ts`
Tests for direction utilities (`utils/directions.ts`):
- Direction calculation from position (8-direction and 4-direction modes)
- Direction to angle conversion
- Distance calculation
- Available directions for each mode
- Consistency between angle and position calculations

#### `useMarkingMenuStateMachine.test.ts`
Tests for state machine hook:
- State transitions (idle → pressed → active → selecting)
- Timer-based transitions
- Direction updates
- Cancellation
- Full gesture flow integration

#### `accessibility.test.ts`
Tests for accessibility hooks:
- `useReducedMotion` - prefers-reduced-motion detection
- Event listener management
- SSR compatibility

### Integration Tests

#### `components.test.tsx`
Tests for component integration:
- MarkingMenu component rendering and behavior
- MarkingMenuTrigger event handling (pointer and keyboard)
- MarkingMenuContent visibility and ARIA attributes
- MarkingMenuItem registration and render props
- Full keyboard navigation flow
- Multi-key combinations
- Accessibility features (ARIA attributes, live regions)
- onSelect callbacks

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test keyboard.test.ts
```

## Coverage Goals

- ✅ Utilities: 100% coverage
- ✅ Hooks: >95% coverage
- ✅ Components: >90% coverage
- ✅ Integration: Critical paths covered

## Test Categories

### Functionality Tests
- Unit tests for all utilities
- Hook behavior tests
- Component rendering tests
- Integration tests for full gesture flows

### Accessibility Tests
- ARIA attribute presence
- Keyboard navigation
- Screen reader announcements
- Focus management
- Reduced motion support

### Edge Cases
- Invalid key combinations
- Rapid key presses/releases
- SSR compatibility
- Disabled states
- Null/empty states

## Adding New Tests

When adding new features, ensure:
1. Unit tests for utilities/functions
2. Hook tests for React hooks
3. Component tests for UI components
4. Integration tests for user flows
5. Accessibility tests for a11y features

## Test Utilities

- **Vitest** - Test runner
- **@testing-library/react** - Component testing
- **@testing-library/jest-dom** - DOM matchers
- **jsdom** - DOM environment
