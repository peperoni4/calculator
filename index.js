const numberButtons = document.querySelectorAll(".btn-number");
const operatorButtons = document.querySelectorAll(".btn-operator");

const mainLine = document.querySelector(".main-line");
const previousLine = document.querySelector(".previous-line");

let firstOperand = null;
let secondOperand = null;
let operator = null;

numberButtons.forEach((numberBtn) => {
  numberBtn.addEventListener("click", numberButtonHandler);
});

operatorButtons.forEach((operatorBtn) => {
  operatorBtn.addEventListener("click", operatorButtonHandler);
});

function operatorButtonHandler(e) {
  const buttonValue = e.target.textContent;
  mainLine.textContent += buttonValue;
}

function numberButtonHandler(e) {
  const buttonValue = e.target.textContent;
  mainLine.textContent += buttonValue;
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
