// The four basic operations can also be called directly in the browser console.
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  switch (operator) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "×": return multiply(a, b);
    case "÷": return divide(a, b);
    default: return null;
  }
}

const display = document.querySelector("#display");
const keys = document.querySelector("#keys");
const decimalButton = document.querySelector('[data-action="decimal"]');

// These are the three values that describe a pending operation.
let firstNumber = null;
let operator = null;
let secondNumber = null;

// Extra state makes input behavior predictable around results and operators.
let waitingForSecondNumber = false;
let justCalculated = false;
let hasError = false;

function updateDisplay(value) {
  const text = String(value);
  // Keep results readable on a narrow display and avoid floating point noise.
  display.textContent = text.length > 12
    ? Number(value).toPrecision(8).replace(/\.?0+$/, "")
    : text;
  decimalButton.disabled = display.textContent.includes(".") || hasError;
}

function clearCalculator() {
  firstNumber = null;
  operator = null;
  secondNumber = null;
  waitingForSecondNumber = false;
  justCalculated = false;
  hasError = false;
  updateDisplay("0");
}

function enterDigit(digit) {
  if (hasError || justCalculated) {
    clearCalculator();
  }

  if (waitingForSecondNumber) {
    secondNumber = digit;
    waitingForSecondNumber = false;
    updateDisplay(digit);
    return;
  }

  if (operator !== null) {
    secondNumber = (secondNumber ?? "") + digit;
    updateDisplay(secondNumber);
  } else {
    firstNumber = (firstNumber ?? "") + digit;
    updateDisplay(firstNumber);
  }
}

function enterDecimal() {
  if (hasError || justCalculated) clearCalculator();

  if (waitingForSecondNumber) {
    secondNumber = "0.";
    waitingForSecondNumber = false;
    updateDisplay(secondNumber);
    return;
  }

  if (display.textContent.includes(".")) return;
  if (operator !== null) {
    secondNumber = (secondNumber ?? "0") + ".";
    updateDisplay(secondNumber);
  } else {
    firstNumber = (firstNumber ?? "0") + ".";
    updateDisplay(firstNumber);
  }
  decimalButton.disabled = true;
}

function chooseOperator(nextOperator) {
  if (hasError) return;

  // An operator can be changed while waiting for the second number.
  if (operator !== null && waitingForSecondNumber) {
    operator = nextOperator;
    return;
  }

  if (firstNumber === null || firstNumber === "") return;

  // If both sides exist, finish this pair before starting the next one.
  if (operator !== null && secondNumber !== null && secondNumber !== "") {
    calculate();
    if (hasError) return;
  }

  operator = nextOperator;
  secondNumber = null;
  waitingForSecondNumber = true;
  justCalculated = false;
}

function calculate() {
  if (firstNumber === null || operator === null || secondNumber === null || secondNumber === "") {
    return;
  }

  const a = Number(firstNumber);
  const b = Number(secondNumber);
  if (operator === "÷" && b === 0) {
    hasError = true;
    display.textContent = "Nice try! 😏";
    decimalButton.disabled = true;
    return;
  }

  let result = operate(operator, a, b);
  if (!Number.isFinite(result)) {
    hasError = true;
    display.textContent = "Math error";
    decimalButton.disabled = true;
    return;
  }

  // Round to eight decimal places; trim zeros for a clean display.
  result = Number(result.toFixed(8));
  firstNumber = String(result);
  secondNumber = null;
  operator = null;
  waitingForSecondNumber = false;
  justCalculated = true;
  updateDisplay(firstNumber);
}

function backspace() {
  if (hasError || justCalculated) {
    clearCalculator();
    return;
  }
  if (waitingForSecondNumber) return;

  if (operator !== null) {
    secondNumber = (secondNumber ?? "").slice(0, -1);
    updateDisplay(secondNumber || "0");
  } else {
    firstNumber = (firstNumber ?? "").slice(0, -1);
    updateDisplay(firstNumber || "0");
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.digit !== undefined) enterDigit(button.dataset.digit);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);
  if (button.dataset.action === "equals") calculate();
  if (button.dataset.action === "clear") clearCalculator();
  if (button.dataset.action === "decimal") enterDecimal();
  if (button.dataset.action === "backspace") backspace();
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) enterDigit(event.key);
  else if (event.key === ".") enterDecimal();
  else if (["+", "-"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "*") chooseOperator("×");
  else if (event.key === "/") {
    event.preventDefault();
    chooseOperator("÷");
  } else if (event.key === "Enter" || event.key === "=") calculate();
  else if (event.key === "Backspace") backspace();
  else if (event.key === "Escape") clearCalculator();
});

// Start with an actual value so the display layout can be checked immediately.
updateDisplay("0");