import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Calculator.css';

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (number) => {
    if (isNewNumber) {
      setDisplay(number);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? number : display + number);
    }
  };

  const handleOperator = (operator) => {
    setIsNewNumber(true);
    if (equation === '') {
      setEquation(display + ' ' + operator);
    } else {
      calculate();
      setEquation(display + ' ' + operator);
    }
  };

  const calculate = () => {
    if (equation !== '') {
      const parts = equation.split(' ');
      const num1 = parseFloat(parts[0]);
      const operator = parts[1];
      const num2 = parseFloat(display);
      let result = 0;

      switch (operator) {
        case '+':
          result = num1 + num2;
          break;
        case '-':
          result = num1 - num2;
          break;
        case '×':
          result = num1 * num2;
          break;
        case '÷':
          result = num1 / num2;
          break;
        default:
          break;
      }

      setDisplay(Number(result.toFixed(5)).toString());
      setEquation('');
    }
  };

  const handleEqual = () => {
    calculate();
    setIsNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const handlePercent = () => {
    const num = parseFloat(display) / 100;
    setDisplay(Number(num.toFixed(5)).toString());
    setIsNewNumber(true);
  };

  const handlePlusMinus = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  return (
    <div className="calculator-container">
      <Link to="/" className="back-button">↩</Link>
      <div className="calculator">
        <div className="display">
          <div className="current">{display}</div>
        </div>
        <div className="buttons">
          <button onClick={handleClear} className="button function">
            AC
          </button>
          <button onClick={handlePlusMinus} className="button function">
            ±
          </button>
          <button onClick={handlePercent} className="button function">
            %
          </button>
          <button onClick={() => handleOperator('÷')} className="button operator">
            ÷
          </button>
          <button onClick={() => handleNumber('7')} className="button">
            7
          </button>
          <button onClick={() => handleNumber('8')} className="button">
            8
          </button>
          <button onClick={() => handleNumber('9')} className="button">
            9
          </button>
          <button onClick={() => handleOperator('×')} className="button operator">
            ×
          </button>
          <button onClick={() => handleNumber('4')} className="button">
            4
          </button>
          <button onClick={() => handleNumber('5')} className="button">
            5
          </button>
          <button onClick={() => handleNumber('6')} className="button">
            6
          </button>
          <button onClick={() => handleOperator('-')} className="button operator">
            -
          </button>
          <button onClick={() => handleNumber('1')} className="button">
            1
          </button>
          <button onClick={() => handleNumber('2')} className="button">
            2
          </button>
          <button onClick={() => handleNumber('3')} className="button">
            3
          </button>
          <button onClick={() => handleOperator('+')} className="button operator">
            +
          </button>
          <button onClick={() => handleNumber('0')} className="button zero">
            0
          </button>
          <button onClick={() => handleNumber('.')} className="button">
            .
          </button>
          <button onClick={handleEqual} className="button operator">
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
