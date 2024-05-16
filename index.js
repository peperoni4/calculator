const numberButtons = document.querySelectorAll(".btn-number");
const operatorButtons = document.querySelectorAll(".btn-operator");
const equalsButton = document.querySelector(".btn-equals");

const clearAllButton = document.querySelector(".clear-all");
const clearOneButton = document.querySelector(".clear-one");

const mainLine = document.querySelector(".main-line");
const previousLine = document.querySelector(".previous-line");

let operator = null;
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

function equalsBtnHandler(e) {
  const [firstOperand, secondOperand] = mainLine.textContent.split(operator);
  if (!firstOperand || !secondOperand || !operator) return;
  previousLine.textContent = mainLine.textContent + "=";
  const result = operate(+firstOperand, +secondOperand, operator);
  if (typeof result === "string") changeStyleToError();
  mainLine.textContent = result;
  isAnyOperatorBtnPressed = false;
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
  // if operator pressed but not minus that means we can still add unary minus to the second operand
  if (!isAnyOperatorBtnPressed || (operator !== "-" && buttonValue === "-")) {
    mainLine.textContent += buttonValue;
    operator = buttonValue;
    isAnyOperatorBtnPressed = true;
  }
}

function numberButtonHandler(e) {
  const buttonValue = e.target.textContent;
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
