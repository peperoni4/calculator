const numberButtons = document.querySelectorAll(".btn-number");
const operatorButtons = document.querySelectorAll(".btn-operator");

const clearAllButton = document.querySelector(".clear-all");
const clearOneButton = document.querySelector(".clear-one");

const mainLine = document.querySelector(".main-line");
const previousLine = document.querySelector(".previous-line");

let firstOperand = null;
let secondOperand = null;
let operator = null;
let isAnyOperatorBtnPressed = false;

clearAllButton.addEventListener("click", clearAllLines);
clearOneButton.addEventListener("click", clearOneCharacter);

numberButtons.forEach((numberBtn) => {
  numberBtn.addEventListener("click", numberButtonHandler);
});

operatorButtons.forEach((operatorBtn) => {
  operatorBtn.addEventListener("click", operatorButtonHandler);
});

function operatorButtonHandler(e) {
  const buttonValue = e.target.textContent;
  // if operator pressed but not minus that means we can still add unary minus to the operand
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

function operate(a, b, operator) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      if (b === 0) return "ERROR: Division by zero!";
      return divide(a, b);

    default:
      return `Unsupported operation - ${operator}!`;
  }
}
