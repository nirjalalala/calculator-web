# Calculator Web App

A browser-based calculator built with plain HTML, CSS, and JavaScript.
Built following the waterfall model as a learning project.

---

## Phase 1 — Requirements

### Purpose
A browser-based calculator that performs basic arithmetic operations.

### Display
- Show the current number being entered.
- Show the result after pressing `=`.
- Show the active operator so the user knows what operation is pending.
- Limit display to a reasonable number of digits (max 12) to avoid overflow.

### Buttons
| Button | Label | Behavior |
|--------|-------|----------|
| Digits | 0–9  | Append digit to the current number |
| Decimal | `.`  | Add a decimal point (only one allowed per number) |
| Add | `+` | Set operator, store first operand |
| Subtract | `-` | Set operator, store first operand |
| Multiply | `×` | Set operator, store first operand |
| Divide | `÷` | Set operator, store first operand |
| Equals | `=` | Compute and display result |
| Clear | `AC` | Reset everything to initial state |
| Backspace | `⌫` | Remove the last entered digit |

### Operations
- Addition: `a + b`
- Subtraction: `a - b`
- Multiplication: `a × b`
- Division: `a ÷ b`

### Edge Cases
| Scenario | Expected Behavior |
|----------|-------------------|
| Division by zero | Display "Error" |
| Pressing `=` with no operator | Do nothing (display current number) |
| Pressing an operator after `=` | Use result as the first operand |
| Multiple decimals in one number | Ignore the second `.` press |
| Result is a very long float | Round to a reasonable number of decimal places |
| Pressing operator repeatedly | Update the operator, do not calculate yet |

### Non-Functional Requirements
- Works in any modern browser (Chrome, Firefox, Safari).
- Responsive layout that fits on mobile screens.
- No external libraries or frameworks — plain HTML, CSS, and JavaScript only.
- Code must be readable and each part must have a clear single responsibility.

### Out of Scope
- History / memory buttons (M+, MR, MC)
- Scientific functions (sin, cos, sqrt, etc.)
- Keyboard input (nice to have, but not required)

---

## Phase 2 — Design

_Coming next._

---

## Phase 3 — Implementation

_Coming after design._

---

## Phase 4 — Testing

_Coming after implementation._

---

## Phase 5 — Deployment

_Coming after testing._
