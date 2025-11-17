# Keyboard Interaction Design

Detailed specification for keyboard-based marking menu interaction.

## Overview

The marking menu supports full keyboard interaction using arrow keys, providing an accessible alternative to pointer/touch input that uses the same gesture-based interaction pattern.

## Interaction Flow

1. **Focus** - User tabs to the trigger element
2. **Press and hold arrow key(s)** - Start the gesture
3. **Menu appears** - After 150ms threshold (same as pointer)
4. **Change direction** - Press additional keys or release keys
5. **Release all keys** - Execute the selected action

## Key Mapping

### Cardinal Directions (Single Keys)

- `ArrowUp` → North (N)
- `ArrowRight` → East (E)
- `ArrowDown` → South (S)
- `ArrowLeft` → West (W)

### Diagonal Directions (Two Keys)

- `ArrowUp` + `ArrowRight` → Northeast (NE)
- `ArrowDown` + `ArrowRight` → Southeast (SE)
- `ArrowDown` + `ArrowLeft` → Southwest (SW)
- `ArrowUp` + `ArrowLeft` → Northwest (NW)

### Invalid Combinations

- `ArrowUp` + `ArrowDown` → Invalid (opposite keys)
- `ArrowLeft` + `ArrowRight` → Invalid (opposite keys)

**Fallback:** If invalid combination is detected, use the most recently pressed key.

## Multi-Key Behavior: Sliding Window

The system tracks pressed keys in order and uses the **most recent 2 keys** (or 1 if only 1 is pressed) to determine direction.

### Example Flow

```
Press Up
  → pressedKeys = [Up]
  → direction = N

Press Right (while holding Up)
  → pressedKeys = [Up, Right]
  → direction = NE (keys #1 and #2)

Press Down (3rd key, while holding Up+Right)
  → pressedKeys = [Up, Right, Down]
  → direction = SE (keys #2 and #3: Right+Down)

Press Left (4th key, while holding Up+Right+Down)
  → pressedKeys = [Up, Right, Down, Left]
  → direction = SW (keys #3 and #4: Down+Left)

Release Down
  → pressedKeys = [Up, Right, Left]
  → direction = NW (last 2 keys: Right+Left)
  → Note: Right+Left is invalid, fallback to Left (most recent)

Release Right
  → pressedKeys = [Up, Left]
  → direction = NW (keys #1 and #2: Up+Left)

Release Left
  → pressedKeys = [Up]
  → direction = N (single key)
  → Enter RELEASE PHASE, latch direction N

Release Up
  → pressedKeys = []
  → EXECUTE action for latched direction N
```

## Direction Latching

### Problem

Users cannot release two keys at exactly the same millisecond. Without latching, releasing a two-key combo (e.g., Up+Right for NE) might briefly show single-key direction (e.g., N or E) before executing, causing confusion.

### Solution

When the user begins releasing keys from a multi-key combination, the system **latches** the current direction and maintains it until all keys are released.

### Implementation

```typescript
State: Holding Up+Right (NE selected)

User releases Right (Up still held)
→ LATCH direction: NE
→ Visual feedback: Keep NE highlighted (don't switch to N)
→ State: isReleasing = true

User releases Up (~50ms later)
→ EXECUTE: NE (the latched direction)
→ Reset state
```

### Rules

- **Latching trigger:** When going from 2+ keys to fewer keys
- **Latched state persists:** Until all keys are released
- **Visual feedback:** Highlight remains on latched direction
- **Execution:** Uses latched direction, not final key state

## State Management

### Keyboard State Object

```typescript
{
  pressedKeys: ArrowKey[]           // Stack of pressed keys in order
  isReleasing: boolean               // In release/latch phase?
  latchedDirection: Direction | null // Direction when latching started
}
```

### State Transitions

#### Key Down Event

```typescript
function handleKeyDown(key: ArrowKey) {
  if (!isArrowKey(key)) return
  if (pressedKeys.includes(key)) return // Already pressed

  // Add to stack
  pressedKeys.push(key)

  // Calculate direction from last 2 keys
  const direction = getDirectionFromKeys(pressedKeys.slice(-2))

  // Update state machine
  if (pressedKeys.length === 1) {
    menuState = 'pressed'
    startTimer(150ms) // Show menu after threshold
  } else if (menuState === 'active') {
    menuState = 'selecting'
  }

  return direction
}
```

#### Key Up Event

```typescript
function handleKeyUp(key: ArrowKey) {
  if (!isArrowKey(key)) return

  // Remove from stack
  pressedKeys = pressedKeys.filter(k => k !== key)

  // Check if entering release phase
  if (!isReleasing && pressedKeys.length < 2) {
    isReleasing = true
    latchedDirection = currentDirection // Latch current direction
  }

  // All keys released - execute
  if (pressedKeys.length === 0) {
    clearTimer()
    executeAction(latchedDirection || currentDirection)
    reset()
  } else if (!isReleasing) {
    // Still holding keys, recalculate direction
    currentDirection = getDirectionFromKeys(pressedKeys.slice(-2))
  }
  // Else: in release phase, keep showing latched direction
}
```

## Integration with State Machine

The keyboard gesture uses the **same state machine** as pointer gestures:

```
IDLE
  ↓ (first arrow key pressed)
PRESSED [timer starts]
  ↓ (150ms threshold)
ACTIVE [menu visible]
  ↓ (direction determined)
SELECTING [item highlighted]
  ↓ (all keys released)
IDLE [onSelect called]
```

## Accessibility Considerations

### Visual Feedback

- **Pressed keys indicator:** Optional visual showing which keys are pressed (aids learning)
- **Direction highlight:** Clear indication of current/latched direction
- **Latched state:** Possibly subtle visual difference between active and latched

### Screen Reader

- **Live region:** Announce direction changes
- **Action announcement:** Announce when action is executed
- **Instructions:** Provide clear keyboard usage instructions

### Additional Keys

- **Escape:** Cancel menu and return to idle state
- **Enter:** Alternative to release? (TBD - may conflict with default button behavior)
- **Tab:** Close menu and move focus (standard behavior)

## Browser Compatibility

### Challenges

- **Key repeat:** Held keys trigger repeated keydown events
- **Key order:** Different browsers may fire events in different orders
- **Modifier keys:** Prevent accidental activation with Ctrl/Cmd/Alt

### Solutions

```typescript
function handleKeyDown(e: KeyboardEvent) {
  // Ignore if already pressed (key repeat)
  if (pressedKeys.includes(e.key)) return

  // Ignore if modifier keys are pressed
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return

  // Prevent default (stop scrolling)
  if (isArrowKey(e.key)) {
    e.preventDefault()
  }

  // Process key...
}
```

## Testing Requirements

### Unit Tests

- [ ] Single key direction mapping
- [ ] Two key direction mapping
- [ ] Invalid key combinations (fallback behavior)
- [ ] Sliding window with 3+ keys
- [ ] Direction latching on key release
- [ ] State reset after execution

### Integration Tests

- [ ] Full keyboard flow (press → hold → release → execute)
- [ ] Rapid key changes
- [ ] Modifier key filtering
- [ ] Escape key cancellation
- [ ] Focus management

### Manual Testing

- [ ] Test on Windows (Chrome, Firefox, Edge)
- [ ] Test on macOS (Safari, Chrome, Firefox)
- [ ] Test on Linux
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation testing

## Future Enhancements

- **Custom key mapping:** Allow users to configure which keys map to which directions
- **Alternative keys:** Support WASD or HJKL (vim) key configurations
- **Pressure/timing:** Different actions based on how long keys are held?
- **Chords:** Support complex key combinations for power users?

## Open Questions

1. Should Enter key be supported as an alternative to releasing all keys?
2. Should we show a visual indicator of pressed keys by default?
3. Should we prevent the menu from appearing if only one key is held briefly?
4. What should happen if user switches from keyboard to pointer mid-gesture?

---

**Status:** Documented, ready for implementation in Phase 1
