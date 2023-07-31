// Declare the stack Proxy array
const stack = new Proxy([0, 0, 0, 0], {
  set(target, property, value) {
    target[property] = value;
    updateDisplay();
    return true;
  }
});

let enterActive = false;
let operationActive = false;
let decimals = false;
let begin = true;

function addDigit(event) {
  let digit = event.target.innerHTML;
  begin = false;

  if (stack[0] === 0) {
    stack[0] = digit != 0 ? digit : 0;
    return;
  }

  if (operationActive) {
    stack[1] = stack[0];
    stack[0] = digit;
    enterActive = false;
    operationActive = false;
    return;
  }

  if (enterActive) {
    stack[0] = digit;
    enterActive = false;
    operationActive = false;
    return;
  }

  if (stack[0] == 0 && digit == 0) {
    stack[0] = 0;
    return;
  }

  stack[0] += digit;
};

function addThousandsSeparator() {
  if (enterActive || operationActive || begin) {
    enterActive = operationActive = begin = false;
    stack[1] = stack[0];
    stack[0] = '0.';
    return;
  }
  if (!stack[0].toString().includes('.')) {
    stack[0] = stack[0] + '.';
    return;
  }
};

function calculate(e) {
  switch (e.target.innerHTML) {
    case '+':
      stack[0] = parseFloat(stack[1]) + parseFloat(stack[0]);
      break;
    case '-':
      stack[0] = parseFloat(stack[1]) - parseFloat(stack[0]);
      break;
    case '*':
      stack[0] = parseFloat(stack[1]) * parseFloat(stack[0]);
      break;
    case '/':
      stack[0] = parseFloat(stack[1]) / parseFloat(stack[0]);
      break;
  }
  stack[1] = stack[2];
  stack[2] = stack[3];
  operationActive = true;
};

function clearDisplay() {
  stack.fill(0);
  begin = true;
}

function enter() {
  stack.unshift(stack[0]);
  stack.pop();
  enterActive = true;
};

function formatDisplayNumber(number) {
  let strings = number.toString().split('.');
  strings[0] = strings[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (typeof strings[1] !== 'undefined') {
    strings = strings[0] + '.' + strings[1];
  } else if (decimals) {
    strings = strings[0] + '.00';
  }
  return strings;
}

function updateDisplay() {
  for (index in stack) {
    if (index <= 3)
      document.getElementById(`display-${index}`).innerHTML = formatDisplayNumber(stack[index]);
  }
}


// Add event listeners
const digits = document.getElementsByClassName('digit');
for (elemt of digits) {
  elemt.addEventListener('click', addDigit);
}

const operationButtons = document.getElementsByClassName('operation-button');
for (elemt of operationButtons) {
  elemt.addEventListener('click', calculate);
}

const clear = document.getElementsByClassName('clear-button')[0];
clear.addEventListener('click', clearDisplay);

const thousandSeparator = document.getElementsByClassName('thousand-separator-button')[0];
thousandSeparator.addEventListener('click', addThousandsSeparator);

const enterBtn = document.getElementsByClassName('enter-button')[0];
enterBtn.addEventListener('click', enter);

updateDisplay();
