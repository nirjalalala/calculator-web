// ── State ────────────────────────────────────────────────────────────────────
//
// tokens holds the full expression as the user builds it, e.g. [3, '+', 5, '×'].
// Numbers are stored as JavaScript numbers; operators as strings.
// When = is pressed, evaluate() processes the whole array at once.
//
// This replaces the old firstOperand + operator pair, which could only
// remember one operation at a time and was forced to compute left-to-right.

let tokens = [];              // e.g. [3, '+', 5, '×'] — grows as user types
let currentInput = '0';       // the number currently being typed on screen
let waitingForSecond = false; // true after an operator is pressed

// ── DOM references ────────────────────────────────────────────────────────────

const expressionEl = document.getElementById('expression');
const currentEl    = document.getElementById('current');

// ── updateDisplay ─────────────────────────────────────────────────────────────
//
// expression line: shows the committed tokens so far, e.g. "3 + 5 ×"
// current line:    shows the number being typed, or the result

function updateDisplay() {
  currentEl.textContent = currentInput;
  expressionEl.textContent = tokens.length > 0 ? tokens.join(' ') : '';
}

// ── handleDigit ───────────────────────────────────────────────────────────────

function handleDigit(digit) {
  if (waitingForSecond) {
    currentInput = digit;
    waitingForSecond = false;
  } else if (currentInput === '0') {
    currentInput = digit;
  } else {
    if (currentInput.length >= 12) return;
    currentInput = currentInput + digit;
  }

  updateDisplay();
}

// ── handleDecimal ─────────────────────────────────────────────────────────────

function handleDecimal() {
  if (waitingForSecond) {
    currentInput = '0.';
    waitingForSecond = false;
    updateDisplay();
    return;
  }

  if (currentInput.includes('.')) return;

  currentInput = currentInput + '.';
  updateDisplay();
}

// ── handleOperator ────────────────────────────────────────────────────────────
//
// Two cases:
// 1. waitingForSecond is true and tokens already has an operator at the end
//    → user pressed an operator twice; just replace the last one.
// 2. Normal case → commit currentInput as a number and push the operator.

function handleOperator(op) {
  if (waitingForSecond && tokens.length > 0) {
    tokens[tokens.length - 1] = op;
  } else {
    tokens.push(parseFloat(currentInput));
    tokens.push(op);
    waitingForSecond = true;
  }

  updateDisplay();
}

// ── handleEquals ──────────────────────────────────────────────────────────────

function handleEquals() {
  // Nothing to evaluate if no operator has been pressed, or if
  // an operator was pressed but no second number was typed yet.
  if (tokens.length === 0 || waitingForSecond) return;

  // Commit the final number to form a complete expression
  tokens.push(parseFloat(currentInput));

  // Show the full expression, e.g. "3 + 5 × 2 ="
  expressionEl.textContent = tokens.join(' ') + ' =';

  const result = evaluate(tokens);

  if (result === null) {
    currentInput = 'Error';
  } else {
    currentInput = String(parseFloat(result.toFixed(10)));
  }

  currentEl.textContent = currentInput;

  // Clear tokens so the next key starts fresh.
  // waitingForSecond = true means: a digit press will start a new calculation,
  // but an operator press will chain from the result.
  tokens = [];
  waitingForSecond = true;
}

// ── evaluate ──────────────────────────────────────────────────────────────────
//
// Implements operator precedence (BODMAS) in two passes:
//   Pass 1 — scan left to right, resolve × and ÷ immediately.
//   Pass 2 — what remains is only + and -, resolve left to right.
//
// Example: [3, '+', 5, '×', 2]
//   Pass 1: finds '×' at index 3 → applyOp(5, '×', 2) = 10 → [3, '+', 10]
//   Pass 2: applyOp(3, '+', 10) = 13
//
// Returns null if division by zero is encountered.

function evaluate(inputTokens) {
  const arr = [...inputTokens]; // work on a copy — never mutate the original

  // Pass 1: × and ÷
  let i = 1;
  while (i < arr.length) {
    if (arr[i] === '×' || arr[i] === '÷') {
      const result = applyOp(arr[i - 1], arr[i], arr[i + 1]);
      if (result === null) return null;
      // Replace the three elements (left, op, right) with the single result.
      // After splice, i-1 holds the result, so i still points to the next operator.
      arr.splice(i - 1, 3, result);
    } else {
      i += 2; // skip over the number that follows a + or -
    }
  }

  // Pass 2: + and −
  let result = arr[0];
  for (let j = 1; j < arr.length; j += 2) {
    result = applyOp(result, arr[j], arr[j + 1]);
    if (result === null) return null;
  }

  return result;
}

// ── applyOp ───────────────────────────────────────────────────────────────────
//
// Pure function: applies a single operation to two numbers.
// Returns null for division by zero so callers can show "Error".

function applyOp(a, op, b) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '×') return a * b;
  if (op === '÷') {
    if (b === 0) return null;
    return a / b;
  }
}

// ── handleClear ───────────────────────────────────────────────────────────────

function handleClear() {
  tokens        = [];
  currentInput  = '0';
  waitingForSecond = false;
  updateDisplay();
}

// ── handleBackspace ───────────────────────────────────────────────────────────

function handleBackspace() {
  if (currentInput === 'Error') {
    handleClear();
    return;
  }

  if (waitingForSecond) return;

  if (currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  updateDisplay();
}

// ── Event listener ────────────────────────────────────────────────────────────

document.querySelector('.buttons').addEventListener('click', function (event) {
  const button = event.target;

  if (!button.matches('.btn')) return;

  const digit  = button.dataset.digit;
  const op     = button.dataset.operator;
  const action = button.dataset.action;

  if (digit !== undefined)         handleDigit(digit);
  else if (op !== undefined)       handleOperator(op);
  else if (action === 'decimal')   handleDecimal();
  else if (action === 'equals')    handleEquals();
  else if (action === 'clear')     handleClear();
  else if (action === 'backspace') handleBackspace();
});

// ── Keyboard support ──────────────────────────────────────────────────────────

const KEY_TO_OPERATOR = { '+': '+', '-': '-', '*': '×', '/': '÷' };

document.addEventListener('keydown', function (event) {
  const key = event.key;

  if (key >= '0' && key <= '9') {
    flashButton(`[data-digit="${key}"]`);
    handleDigit(key);
  } else if (key === '.') {
    flashButton('[data-action="decimal"]');
    handleDecimal();
  } else if (KEY_TO_OPERATOR[key] !== undefined) {
    const op = KEY_TO_OPERATOR[key];
    flashButton(`[data-operator="${op}"]`);
    handleOperator(op);
  } else if (key === 'Enter' || key === '=') {
    flashButton('[data-action="equals"]');
    handleEquals();
  } else if (key === 'Escape') {
    flashButton('[data-action="clear"]');
    handleClear();
  } else if (key === 'Backspace') {
    flashButton('[data-action="backspace"]');
    handleBackspace();
  }

  if (key === '/') event.preventDefault();
});

function flashButton(selector) {
  const button = document.querySelector(selector);
  button?.classList.add('btn--pressed');
  setTimeout(() => button?.classList.remove('btn--pressed'), 100);
}

// ── Theme toggle ──────────────────────────────────────────────────────────────

const toggleBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  toggleBtn.textContent = theme === 'dark' ? 'Light' : 'Dark';
}

toggleBtn.addEventListener('click', function () {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

applyTheme(localStorage.getItem('theme') || 'light');

// ── Init ──────────────────────────────────────────────────────────────────────

updateDisplay();
