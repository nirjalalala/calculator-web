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

### File Structure
```
calculator-web/
├── index.html    ← structure (what exists on the page)
├── style.css     ← appearance (how it looks)
└── script.js     ← behaviour (how it works)
```
Three files, one responsibility each. HTML never controls style. CSS never controls logic. JS never builds HTML strings.

---

### HTML Structure

The page has a title above the calculator card, then a **display** and a **button grid** inside the card.

```
<body>
  <h1>SIMPLE CALCULATOR</h1>
  <div class="calculator">
    <div class="display">
      <div class="expression">  ← small text: shows "12.5/5 =" so user sees the pending operation
      <div class="current">    ← large text: shows the number being typed or the result
    </div>
    <div class="buttons">
      <!-- row 1: CLEAR (spans 2 cols)  |  DELETE (spans 2 cols) -->
      <!-- row 2: 7      8      9       |  ÷                     -->
      <!-- row 3: 4      5      6       |  ×                     -->
      <!-- row 4: 1      2      3       |  -                     -->
      <!-- row 5: .      0      =       |  +                     -->
    </div>
  </div>
</body>
```

Each button is a `<button>` element with a `data-*` attribute that tells JavaScript what it does:
- `data-digit="7"` — digit buttons (0–9)
- `data-action="decimal"` — the `.` button
- `data-operator="+"` — operator buttons (`+ - × ÷`)
- `data-action="equals"` — the `=` button
- `data-action="clear"` — the CLEAR button
- `data-action="backspace"` — the DELETE button

Using `data-*` attributes means the button's visible label and its machine role are separate. Renaming "DELETE" to "⌫" later won't break any JavaScript.

---

### CSS Layout Plan

- `body` uses flexbox (column direction) to center the title and calculator card on the page.
- The page background is warm beige.
- The `.calculator` card has an off-white background, rounded corners, and a subtle shadow.
- The `.display` is a dark panel inside the card. Text is right-aligned and green.
  - `.expression` — small font, muted green (shows the pending expression)
  - `.current` — large font, bright green (shows what's being typed or the result)
- The `.buttons` grid uses **CSS Grid** with 4 equal columns and a small gap between cells.
  - CLEAR spans columns 1–2 (`grid-column: span 2`)
  - DELETE spans columns 3–4 (`grid-column: span 2`)
  - All other buttons are exactly 1 column wide (including `0`)

Color plan:
| Element | Color |
|---------|-------|
| Page background | warm beige `#d6cfc4` |
| Calculator card | off-white `#f0ebe3` |
| Display background | near-black `#1e1e1e` |
| Expression text | muted green `#7aab8a` |
| Current number text | bright green `#5fcf80` |
| Digit buttons (0–9) | dark charcoal `#3d3d3d` |
| Operator buttons (`÷ × - + = .`) | orange `#e8922a` |
| CLEAR button | dark charcoal `#3d3d3d` |
| DELETE button | teal blue `#4a90a0` |
| Button text | white |

---

### JavaScript Architecture

#### State
The calculator needs to remember three things at any point in time:

```
firstOperand  — the number entered before the operator (e.g. 12)
operator      — the operation chosen (e.g. "+")
secondOperand — the number being entered after the operator (e.g. 5)
currentInput  — what is currently shown on the display
waitingForSecond — a flag: true means the next digit press starts a fresh number
```

#### Functions
| Function | What it does |
|----------|-------------|
| `handleDigit(digit)` | Appends a digit to `currentInput`, respects the `waitingForSecond` flag |
| `handleDecimal()` | Adds `.` to `currentInput` only if one doesn't already exist |
| `handleOperator(op)` | Stores `currentInput` as `firstOperand`, stores the operator, sets `waitingForSecond = true` |
| `handleEquals()` | Calls `calculate()`, shows the result, resets state for a new chain |
| `calculate()` | Takes `firstOperand`, `operator`, `secondOperand` and returns the result |
| `handleClear()` | Resets all state back to initial values |
| `handleBackspace()` | Removes the last character from `currentInput` |
| `updateDisplay()` | Reads current state and writes to the two display elements |

#### Flow Example
```
User presses: 1  2  +  5  =
               ↓  ↓  ↓  ↓  ↓
handleDigit    ✓  ✓
handleOperator          ✓
handleDigit              ✓
handleEquals                ✓  → calculate(12, "+", 5) → 17
```

This linear flow is why we separate state from display — `calculate()` never touches the DOM, it just does math and returns a number.

---

## Phase 3 — Implementation

Files built in this order — structure first, then appearance, then behaviour:

| File | Commit | Purpose |
|------|--------|---------|
| `index.html` | `bda53db` | HTML skeleton — display panel and button grid |
| `style.css` | `90628a0` | Visual design matching the reference screenshot |
| `script.js` | `6429990` | Calculator logic — state, handlers, event delegation |

---

## Phase 4 — Testing

Manual testing performed against all requirements from Phase 1.

### Functional tests

| Test | Steps | Expected | Result |
|------|-------|----------|--------|
| Basic addition | `7` `+` `3` `=` | `10` | PASS |
| Basic subtraction | `9` `-` `4` `=` | `5` | PASS |
| Basic multiplication | `6` `×` `7` `=` | `42` | PASS |
| Basic division | `8` `÷` `4` `=` | `2` | PASS |
| Decimal result | `1` `2` `.` `5` `÷` `5` `=` | `2.5` | PASS |
| Chained operations | `3` `+` `5` `×` `2` `=` | `16` | PASS |
| CLEAR resets all | Enter `9` `9` then `CLEAR` | Display shows `0` | PASS |
| DELETE removes digit | Enter `1` `2` `3` then `DELETE` | Shows `12` | PASS |
| Decimal button | `0` `.` `5` `+` `0` `.` `5` `=` | `1` | PASS |

### Edge case tests

| Scenario | Steps | Expected | Result |
|----------|-------|----------|--------|
| Division by zero | `5` `÷` `0` `=` | `Error` | PASS |
| Double decimal ignored | `1` `.` `.` `5` | `1.5` (second `.` ignored) | PASS |
| Operator after `=` chains | `6` `÷` `2` `=` `×` `4` `=` | `12` | PASS |
| Equals with no operator | `5` `=` | `5` (no crash) | PASS |
| Operator pressed twice | `4` `+` `×` `2` `=` | `8` (operator updated to `×`) | PASS |
| Float rounding | `0.1` `+` `0.2` `=` | `0.3` (not `0.30000000000000004`) | PASS |

### Visual checks

| Check | Result |
|-------|--------|
| Warm beige page background | PASS |
| Dark display with green text | PASS |
| Expression line shows pending operation | PASS |
| CLEAR and DELETE span full width | PASS |
| Operator buttons are orange | PASS |
| DELETE button is teal | PASS |
| Buttons darken on press | PASS |

---

## Phase 5 — Deployment

_Coming after testing._
