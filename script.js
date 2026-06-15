// ── State ────────────────────────────────────────────────────────────────────
//
// These four variables are the entire "memory" of the calculator.
// Every function reads from and writes to these — nothing else.

let firstOperand = null;   // the number stored before an operator is pressed
let operator     = null;   // the pending operation: "+", "-", "×", or "÷"
let currentInput = '0';    // what is shown in the large display right now
let waitingForSecond = false; // true = the next digit press should start a fresh number

// ── DOM references ────────────────────────────────────────────────────────────
//
// We grab these once at startup and reuse them.
// Querying the DOM on every keystroke is wasteful and slower.

const expressionEl = document.getElementById('expression');
const currentEl    = document.getElementById('current');

// ── updateDisplay ─────────────────────────────────────────────────────────────
//
// The ONLY function allowed to touch the DOM.
// All other functions update state, then call this to reflect that state.
// This keeps the logic and the UI strictly separated.

function updateDisplay() {
  currentEl.textContent = currentInput;

  if (firstOperand !== null && operator !== null) {
    expressionEl.textContent = firstOperand + ' ' + operator;
  } else {
    expressionEl.textContent = '';
  }
}

// ── handleDigit ───────────────────────────────────────────────────────────────

function handleDigit(digit) {
  if (waitingForSecond) {
    // Start a brand new number instead of appending to the previous result
    currentInput = digit;
    waitingForSecond = false;
  } else if (currentInput === '0') {
    // Replace the leading zero: typing "5" turns "0" into "5", not "05"
    currentInput = digit;
  } else {
    if (currentInput.length >= 12) return; // prevent display overflow
    currentInput = currentInput + digit;
  }

  updateDisplay();
}

// ── handleDecimal ─────────────────────────────────────────────────────────────

function handleDecimal() {
  if (waitingForSecond) {
    // User pressed "." as the first key after an operator — start with "0."
    currentInput = '0.';
    waitingForSecond = false;
    updateDisplay();
    return;
  }

  if (currentInput.includes('.')) return; // only one decimal point allowed

  currentInput = currentInput + '.';
  updateDisplay();
}

// ── handleOperator ────────────────────────────────────────────────────────────

function handleOperator(op) {
  // Chain calculation: if the user types "3 + 5 ×", compute "3 + 5 = 8" first,
  // then use 8 as the starting point for the next operation.
  if (operator !== null && !waitingForSecond) {
    const result = calculate(parseFloat(firstOperand), operator, parseFloat(currentInput));

    if (result === null) {
      currentInput = 'Error';
      firstOperand = null;
      operator = null;
      updateDisplay();
      return;
    }

    currentInput = String(parseFloat(result.toFixed(10)));
  }

  firstOperand = currentInput;
  operator     = op;
  waitingForSecond = true;

  expressionEl.textContent = firstOperand + ' ' + operator;
}

// ── handleEquals ──────────────────────────────────────────────────────────────

function handleEquals() {
  // Nothing to compute if no operator has been pressed yet
  if (operator === null || waitingForSecond) return;

  const a = parseFloat(firstOperand);
  const b = parseFloat(currentInput);

  // Show the full expression before overwriting currentInput with the result
  expressionEl.textContent = firstOperand + ' ' + operator + ' ' + currentInput + ' =';

  const result = calculate(a, operator, b);

  if (result === null) {
    currentInput = 'Error';
  } else {
    // toFixed(10) limits floating-point noise (e.g. 0.1 + 0.2 = 0.30000000004)
    // parseFloat removes trailing zeros (e.g. "2.50000" becomes "2.5")
    currentInput = String(parseFloat(result.toFixed(10)));
  }

  currentEl.textContent = currentInput;

  // Reset state so the next key press starts cleanly.
  // waitingForSecond = true means: if user types a digit next, start fresh;
  // if user presses an operator next, the result becomes the new firstOperand.
  firstOperand     = null;
  operator         = null;
  waitingForSecond = true;
}

// ── calculate ─────────────────────────────────────────────────────────────────
//
// Pure function: takes two numbers and an operator, returns the result.
// It never reads or writes state. It never touches the DOM.
// This makes it easy to test and reason about in isolation.

function calculate(a, op, b) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '×') return a * b;
  if (op === '÷') {
    if (b === 0) return null; // signal division-by-zero to the caller
    return a / b;
  }
}

// ── handleClear ───────────────────────────────────────────────────────────────

function handleClear() {
  firstOperand     = null;
  operator         = null;
  currentInput     = '0';
  waitingForSecond = false;
  updateDisplay();
}

// ── handleBackspace ───────────────────────────────────────────────────────────

function handleBackspace() {
  if (currentInput === 'Error') {
    handleClear();
    return;
  }

  if (waitingForSecond) return; // nothing typed yet for the second number

  if (currentInput.length === 1) {
    currentInput = '0'; // last digit removed — fall back to zero
  } else {
    currentInput = currentInput.slice(0, -1); // drop the last character
  }

  updateDisplay();
}

// ── Event listener ────────────────────────────────────────────────────────────
//
// One listener on the parent .buttons div, not 19 separate listeners.
// This is called "event delegation": clicks bubble up from the button to the
// parent, and we inspect event.target to see which button was actually clicked.

document.querySelector('.buttons').addEventListener('click', function (event) {
  const button = event.target;

  if (!button.matches('.btn')) return; // ignore clicks on gaps between buttons

  const digit  = button.dataset.digit;
  const op     = button.dataset.operator;
  const action = button.dataset.action;

  if (digit !== undefined)       handleDigit(digit);
  else if (op !== undefined)     handleOperator(op);
  else if (action === 'decimal') handleDecimal();
  else if (action === 'equals')  handleEquals();
  else if (action === 'clear')   handleClear();
  else if (action === 'backspace') handleBackspace();
});

// ── Init ──────────────────────────────────────────────────────────────────────

updateDisplay();
