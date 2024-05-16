const numberButtons = document.querySelectorAll(".btn-number");
const operatorButtons = document.querySelectorAll(".btn-operator");
const equalsButton = document.querySelector(".btn-equals");

const clearAllButton = document.querySelector(".clear-all");
const clearOneButton = document.querySelector(".clear-one");

const mainLine = document.querySelector(".main-line");
const previousLine = document.querySelector(".previous-line");

let operator = null;
let nextOperator = null;
let isAnyOperatorBtnPressed = false;
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
  let isOperatorEncountered = false;
  // begin from 1 to skip potential unary minus
  for (let i = 1; i < str.length; ++i) {
    if (str[i] === operator) return i;
  }
  return -1;
}

function equalsBtnHandler(e) {
  const [firstOperand, secondOperand] = getOperands(mainLine.textContent);
  if (!firstOperand || !secondOperand || !operator) return;
  previousLine.textContent = mainLine.textContent + "=";
  const result = operate(+firstOperand, +secondOperand, operator);
  if (typeof result === "string") changeStyleToError();
  mainLine.textContent = result;
  if (nextOperator) {
    mainLine.textContent += nextOperator;
    operator = nextOperator;
    nextOperator = null;
    isAnyOperatorBtnPressed = true;
  } else isAnyOperatorBtnPressed = false;
}

function changeStyleToError() {
  mainLine.style.fontSize = "52px";
  mainLine.style.color = "red";
  isError = true;
}

function changeStyleToNormal() {
  mainLine.style.fontSize = "72px";
  mainLine.style.color = "black";
  isError = false;
}

function operatorButtonHandler(e) {
  const buttonValue = e.target.textContent;
  if (isUnaryMinus(buttonValue)) {
    if (operator === "-" && buttonValue === "-") return;
    mainLine.textContent += buttonValue;
  } else if (!isAnyOperatorBtnPressed) {
    operator = buttonValue;
    mainLine.textContent += buttonValue;
    isAnyOperatorBtnPressed = true;
  } else if (isAnyOperatorBtnPressed && !nextOperator) {
    nextOperator = buttonValue;
    equalsBtnHandler();
  }
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
  if (mainLine.textContent === "0" || isError) {
    if (isError) changeStyleToNormal();
    mainLine.textContent = "";
  }
  mainLine.textContent += buttonValue;
}

function clearAllLines() {
  mainLine.textContent = "0";
  previousLine.textContent = "";
  isAnyOperatorBtnPressed = false;
  changeStyleToNormal();
}

function clearOneCharacter() {
  const charArray = mainLine.textContent.split("");
  charArray.pop();
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
