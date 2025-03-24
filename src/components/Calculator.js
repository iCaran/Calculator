"use client";

import { useState, useEffect } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [operator, setOperator] = useState(null);
  const [firstOperand, setFirstOperand] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  // Load the last displayed number from localStorage on component mount
  useEffect(() => {
    const savedDisplay = localStorage.getItem("display");
    if (savedDisplay !== null) {
      setDisplay(savedDisplay);
    }
  }, []);

  // Save the current display to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("display", display);
  }, [display]);

  // Input a digit (or 0)
  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  // Input a decimal point
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  // Handle one of the basic operators: +, -, x, /
  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    // Allow operator change if waiting for the second operand
    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue);
      setDisplay(String(result));
      setFirstOperand(result);
    }
    setOperator(nextOperator);
    setWaitingForSecondOperand(true);
  };

  // Perform the calculation based on the operator
  const performCalculation = (operator, first, second) => {
    switch (operator) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case 'x':
        return first * second;
      case '/':
        return second === 0 ? "Error" : first / second;
      default:
        return second;
    }
  };

  // Calculate result when "=" is pressed
  const calculateResult = () => {
    if (operator && !waitingForSecondOperand) {
      const inputValue = parseFloat(display);
      const result = performCalculation(operator, firstOperand, inputValue);
      setDisplay(String(result));
      setFirstOperand(result);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  // Square the current number
  const squareNumber = () => {
    const inputValue = parseFloat(display);
    const squared = inputValue * inputValue;
    setDisplay(String(squared));
    setFirstOperand(squared);
  };

  // Clear the display and reset calculator state
  const clearDisplay = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="keypad">
        {/* Row 1 */}
        <button className="key number" onClick={() => inputDigit("7")}>7</button>
        <button className="key number" onClick={() => inputDigit("8")}>8</button>
        <button className="key number" onClick={() => inputDigit("9")}>9</button>
        <button className="key operator" onClick={() => handleOperator("/")}>/</button>
        {/* Row 2 */}
        <button className="key number" onClick={() => inputDigit("4")}>4</button>
        <button className="key number" onClick={() => inputDigit("5")}>5</button>
        <button className="key number" onClick={() => inputDigit("6")}>6</button>
        <button className="key operator" onClick={() => handleOperator("x")}>x</button>
        {/* Row 3 */}
        <button className="key number" onClick={() => inputDigit("1")}>1</button>
        <button className="key number" onClick={() => inputDigit("2")}>2</button>
        <button className="key number" onClick={() => inputDigit("3")}>3</button>
        <button className="key operator" onClick={() => handleOperator("-")}>-</button>
        {/* Row 4 */}
        <button className="key number" onClick={() => inputDigit("0")}>0</button>
        <button className="key number" onClick={inputDecimal}>.</button>
        <button className="key operator" onClick={calculateResult}>=</button>
        <button className="key operator" onClick={() => handleOperator("+")}>+</button>
        {/* Row 5 (extra operators) */}
        <button className="key extra" onClick={squareNumber}>x²</button>
        <button className="key extra" onClick={clearDisplay}>AC</button>
      </div>
      <style jsx>{`
        .calculator {
          max-width: 400px;
          margin: auto;
          padding: 20px;
        }
        .display {
          background-color: #4f4f4f;
          color: #ffffff;
          font-size: 2rem;
          text-align: right;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 10px;
          word-wrap: break-word;
        }
        .keypad {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .key {
          padding: 20px;
          font-size: 1.5rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          color: #ffffff;
        }
        .key.number {
          background-color: #737a7b;
        }
        .key.operator {
          background-color: #fe9f09;
        }
        .key.extra {
          background-color: #5b5b5a;
          grid-column: span 2;
        }
        @media (max-width: 500px) {
          .display {
            font-size: 1.5rem;
            padding: 15px;
          }
          .key {
            padding: 15px;
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Calculator;
