function add (x ,y) {
    return x+y;
}

function subtract (x, y) {
    return x-y;
}

function multiply (x, y) {
    return x*y;
}

function divide (x, y) {
    return x/y;
}

function operate (operator, x, y) {

    var result;

    switch (operator) {
        case "add":
            result = add(x, y);
            break;
        case "subtract":
            result = subtract(x, y);
            break;
        case "multiply":
            result = multiply(x, y);
            break;
        case "divide":
            result = divide(x, y);
            break;
        default:
            result = null;
    }

    return result;

}

var operatorStack = [];
var infixString = "";
var postfixString = "";
var existDecimal = false;


const operatorPrec = {"*":2, "/":2, "+":1, "-":1};
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const numId = {"one": "1", "two": "2", "three": "3", "four": "4", "five": "5", 
    "six": "6", "seven": "7", "eight": "8", "nine": "9", "zero": "0"};
const operatorId = {"add": "+", "subtract": "-", "multiply": "*", "divide": "/",
    "leftp": "(", "rightp": ")"};
                 

const hdisplay = document.querySelector('#historydisplay');
hdisplay.textContent = "";

const display = document.querySelector('#display');
display.textContent = "";

const buttons = document.querySelectorAll('button')
buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        buttonDisplay(button.id);
    })
    button.addEventListener('transitionend', removeTransition);
})

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('pressed');
}

window.addEventListener('keydown', kbdInput)

function kbdInput(e) {
    
    var keyNum;

    if (e.keyCode < 57 && e.keyCode > 48){
        keyNum = e.keyCode + 48;
        const key = document.querySelector(`button[data-key = "${keyNum}"]`);
        key.classList.add('pressed');
        buttonDisplay(key.id);
    } else if ((e.keyCode == 57 || e.keyCode == 48) && e.shiftKey) {
        if (e.keyCode == 57) {
            const key = document.querySelector(`button[data-key = "${e.keyCode}"]`);
            key.classList.add('pressed');
            buttonDisplay(key.id);     
        } else if (e.keyCode == 48) {
            const key = document.querySelector(`button[data-key = "${e.keyCode}"]`);
            key.classList.add('pressed');
            buttonDisplay(key.id);
        }
    } else {
        const key = document.querySelector(`button[data-key = "${e.keyCode}"]`);
        key.classList.add('pressed');
        buttonDisplay(key.id);
    }
}

function clearDisplay() {
    hdisplay.textContent = "";
    display.textContent = "";
    infixString = "";
    postfixString = "";
    operatorStack = [];
    existDecimal = false;
}

function buttonDisplay(id) {

    currentDisplay = display.textContent;
    currentHDisplay = hdisplay.textContent;

    if (id in numId) {
        infixString = infixString.concat(numId[id]);
        display.textContent = currentDisplay.concat(numId[id]);
    } else if (id in operatorId) {
        infixString = infixString.concat(operatorId[id]);
        if (currentHDisplay.length > 0) {
            hdisplay.textContent = currentHDisplay.concat(operatorId[id]);
        } else {
            hdisplay.textContent = currentDisplay.concat(operatorId[id]);
            display.textContent = "";
        }
    } else if (id == "equals") {
        display.textContent = (evalPostfix(infixToPostfix(infixString)));
        hdisplay.textContent = "";
        existDecimal = false;
    } else if (id == "delete") {
        infixString = infixString.substr(0, infixString.length-1);
        if (currentDisplay.length == 0) {
            hdisplay.textContent = infixString;
        } else {
            display.textContent = currentDisplay.substr(0, currentDisplay.length-1)
        }
    } else if (id == "decimal") {
        if (!existDecimal){
            infixString = infixString.concat(".");
            display.textContent = infixString;

            existDecimal = true;
        } 
    } else if (id == "clear") {
        clearDisplay();
    }
    
   

}

function infixToPostfix (string) {

    var infixArray = string.split("");
    postfixString = "";
    var numOper = 0;

    for (var i = 0; i < infixArray.length; i++) {

        if (infixArray[i] in numbers) {
            postfixString = postfixString.concat(parseFloat(infixArray[i]));
        } else if (infixArray[i] == ".") {
            postfixString = postfixString.concat(infixArray[i]);
        }
        
        else if (infixArray[i] in operatorPrec) {
            postfixString = postfixString.concat(" ");
            while (operatorPrec[operatorStack[numOper-1]] >= operatorPrec[infixArray[i]] 
                && operatorStack[numOper-1] in operatorPrec) {
                postfixString = postfixString.concat(operatorStack.pop(), " ");
                numOper--;    
            }
            operatorStack.push(infixArray[i]);
            numOper++;
        } else if (infixArray[i] == "(") {
            operatorStack.push(infixArray[i]);
            numOper++;
        } else if (infixArray[i] == ")") {
            while (operatorStack[numOper - 1] != "(" && numOper != 0) {
                postfixString = postfixString.concat(" ", operatorStack.pop());
                numOper--;
            }
            operatorStack.pop();
        }
    

    }

    while (operatorStack.length != 0) {
        postfixString = postfixString.concat(" ", operatorStack.pop());
    }

    return postfixString;


}

function evalPostfix(string) {

    var postfixArray = string.split(" ");
    var postfixStack = [];
    var firstOperand = 0;
    var secondOperand = 0;

    for (var i = 0; i < postfixArray.length; i++) {
        if (!(postfixArray[i] in operatorPrec)) {
            postfixStack.push(postfixArray[i]);
        } else {
            secondOperand = parseFloat(postfixStack.pop());
            firstOperand = parseFloat(postfixStack.pop());

            switch (postfixArray[i]) {
                case "+":
                    postfixStack.push(operate("add", firstOperand, secondOperand));
                    break;
                case "-":
                    postfixStack.push(operate("subtract", firstOperand, secondOperand));
                    break;
                case "*":
                    postfixStack.push(operate("multiply", firstOperand, secondOperand));
                    break;
                case "/":
                    if (secondOperand == 0) {
                        return "Error";
                    }
                    postfixStack.push(operate("divide", firstOperand, secondOperand));
                    break;
                default:
                    break;
            }
        } 
    }
    
    var result = postfixStack.pop();    

    if (isNaN(result)) {
        return "Error"
    } else {
        return result;
    }

}

