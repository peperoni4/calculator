const numberButtons = document.querySelectorAll(".btn-number");
const operatorButtons = document.querySelectorAll(".btn-operator");
const equalsButton = document.querySelector(".btn-equals");

const clearAllButton = document.querySelector(".clear-all");
const clearOneButton = document.querySelector(".clear-one");

const mainLine = document.querySelector(".main-line");
const previousLine = document.querySelector(".previous-line");

const DECIMAL_POINT_PRECISION = 6;
const EXPONENTIAL_PRECISION = 5;
const MAX_CHARACTERS_ON_LINE = 11;

let operator = null;
let nextOperator = null;
let isError = false;

clearAllButton.addEventListener("click", clearAllLines);
clearOneButton.addEventListener("click", clearOneCharacter);
equalsButton.addEventListener("click", equalsBtnHandler);

numberButtons.forEach((numberBtn) => {
  numberBtn.addEventListener("click", numberButtonHandler);
});

operatorButtons.forEach((operatorBtn) => {
  operatorBtn.addEventListener("click", operatorButtonHandler);
});

function getOperands(str) {
  const operatorIndex = getOperatorIndex(str);
  if (operatorIndex === -1) return [null, null];
  return [str.slice(0, operatorIndex), str.slice(operatorIndex + 1)];
}

function getOperatorIndex(str) {
  // begin from 1 to skip potential unary minus
  for (let i = 1; i < str.length; ++i) {
    // !== "e" for 1e+5+123 edge case
    if (str[i] === operator && str[i - 1] !== "e") return i;
  }
  return -1;
}

function equalsBtnHandler(e) {
  const [firstOperand, secondOperand] = getOperands(mainLine.textContent);
  if (!firstOperand || !secondOperand || !operator) return;
  previousLine.textContent = mainLine.textContent + "=";
  const result = operate(+firstOperand, +secondOperand, operator);
  if (typeof result === "string") {
    changeStyleToError();
    mainLine.textContent = result;
    operator = null;
    return;
  }
  mainLine.textContent = trimNumberPrecisionIfExceedsLength(result);
  if (nextOperator) {
    mainLine.textContent += nextOperator;
    operator = nextOperator;
    nextOperator = null;
    return;
  }
  operator = null;
}

function trimNumberPrecisionIfExceedsLength(number) {
  let [integerPart, decimalPointPart] = number.toString().split(".");
  decimalPointPart ??= "";
  if (integerPart.length + decimalPointPart.length >= MAX_CHARACTERS_ON_LINE) {
    number =
      integerPart.length + DECIMAL_POINT_PRECISION < MAX_CHARACTERS_ON_LINE
        ? number.toFixed(DECIMAL_POINT_PRECISION)
        : number.toExponential(EXPONENTIAL_PRECISION);
  }
  return number;
}

function changeStyleToError() {
  mainLine.style.fontSize = "52px";
  mainLine.style.color = "red";
  isError = true;
}

function changeStyleToNormal() {
  mainLine.style.fontSize = "84px";
  mainLine.style.color = "black";
  isError = false;
}

function operatorButtonHandler(e) {
  const buttonValue = e.target.textContent;
  if (isError) {
    mainLine.textContent = buttonValue === "-" ? "" : "0";
    changeStyleToNormal();
  }
  if (isUnaryMinus(buttonValue)) {
    if (operator === "-" && buttonValue === "-") return;
    mainLine.textContent += buttonValue;
  } else if (!operator && hasFistOperand()) {
    operator = buttonValue;
    mainLine.textContent += buttonValue;
  } else if (operator && !nextOperator && hasSecondOperand()) {
    nextOperator = buttonValue;
    equalsBtnHandler();
  }
}

function hasFistOperand() {
  return (
    mainLine.textContent.length >=
    (mainLine.textContent.startsWith("-") ? 2 : 1)
  );
}

function hasSecondOperand() {
  const numbers = "0123456789";
  return numbers.includes(mainLine.textContent.at(-1));
}

function isUnaryMinus(currentOperator) {
  return (
    currentOperator === "-" &&
    (mainLine.textContent.length === 0 ||
      (operator && mainLine.textContent.at(-1) === operator))
  );
}

function numberButtonHandler(e) {
  const buttonValue = e.target.textContent;
  // prevent leading zeros for second operand
  // and second decimals for both operands
  if (
    isNextNumberAlsoLeadingZero(buttonValue) ||
    isSecondDecimalPoint(buttonValue)
  )
    return;
  if (isDotUsedWithEmptyOperand(buttonValue)) mainLine.textContent += "0";
  else if (buttonValue !== "." && (mainLine.textContent === "0" || isError)) {
    if (isError) changeStyleToNormal();
    mainLine.textContent = "";
  }
  mainLine.textContent += buttonValue;
}

function isDotUsedWithEmptyOperand(buttonValue) {
  const previousChar = mainLine.textContent.at(-1);
  return (
    buttonValue === "." &&
    // empty line or unary minus in front of the operand
    (mainLine.textContent.length === 0 || // ". case"
      previousChar === "-" || // "-. or 12-. case"
      previousChar === operator) // "12-. case"
  );
}

function isSecondDecimalPoint(decimalPointChar) {
  if (decimalPointChar !== ".") return false;
  if (!operator) {
    // no operator means that we are working with first operand
    const firstOperand = mainLine.textContent;
    return isSecondDecimalPointInOperand(firstOperand, decimalPointChar);
  } else {
    const secondOperand = getOperands(mainLine.textContent)[1];
    return isSecondDecimalPointInOperand(secondOperand, decimalPointChar);
  }
}

function isSecondDecimalPointInOperand(operand, decimalPointChar) {
  if (!operand) return false;
  if (operand.includes(decimalPointChar)) return true;
  return false;
}

function isNextNumberAlsoLeadingZero(number) {
  return (
    number === "0" &&
    mainLine.textContent.at(-1) === "0" &&
    mainLine.textContent.at(-2) === operator
  );
}

function clearAllLines() {
  mainLine.textContent = "0";
  previousLine.textContent = "";
  operator = null;
  changeStyleToNormal();
}

function clearOneCharacter() {
  if (isError) {
    mainLine.textContent = "";
    isError = false;
    changeStyleToNormal();
    return;
  }
  const charArray = mainLine.textContent.split("");
  const deletedChar = charArray.pop();
  if (operator && deletedChar === operator) {
    operator = null;
  }
  mainLine.textContent = charArray.join("");
}

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

function modularDivision(a, b) {
  return a % b;
}

function operate(a, b, operator) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      if (b === 0) return "Division by zero!";
      return divide(a, b);
    case "%":
      if (b === 0) return "Division by zero!";
      return modularDivision(a, b);

    default:
      return `Unsupported operation - ${operator}!`;
  }
}
