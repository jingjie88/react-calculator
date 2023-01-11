import { useReducer } from 'react';
import React from 'react';
import './styles.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

interface State {
  currentOperand?: string;
  previousOperand?: string;
  operation?: string;
  overwrite?: boolean;
}

export enum Action_types {
  ADD_DIGIT = 'add-digit',
  CHOOSE_OPERATION = 'choose-operation',
  CLEAR = 'clear',
  DELETE = 'delete',
  EQUALS = 'equals',
}

export interface Actions {
  type: Action_types;
  payload?: string;
}

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case Action_types.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: action.payload,
          overwrite: false,
        }
      }

      if (state.currentOperand === '0' && action.payload === '0') {
        return state;
      }

      if (state.currentOperand === '0') {
        return {
          ...state,
          currentOperand: action.payload,
        };
      }

      if (state.currentOperand && state.currentOperand.includes('.') && action.payload === '.') {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${action.payload}`,
      };

    case Action_types.CHOOSE_OPERATION:
      if (!state.previousOperand && !state.currentOperand) {
        return state;
      }

      if (!state.currentOperand) {
        return {
          ...state,
          operation: action.payload,
        };
      }

      if (!state.previousOperand) {
        return {
          previousOperand: state.currentOperand,
          operation: action.payload,
          currentOperand: undefined,
          overwrite: false,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: undefined,
        operation: action.payload,
      };

    case Action_types.CLEAR:
      return {};

    case Action_types.DELETE:
      if (state.overwrite) {
        return {}
      }

      if (state.currentOperand) {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
          overwrite: false,
        };
      } 

      return state;

    case Action_types.EQUALS:
      return {
        currentOperand: evaluate(state),
        overwrite: true,
      };
  }
}

function evaluate({previousOperand, currentOperand, operation}: State): string {
  if (!previousOperand || !currentOperand) {
    return '';
  }

  const prev: number = parseFloat(previousOperand);
  const cur: number = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(cur)) {
    return '';
  }

  let res: number = 0;

  switch(operation) {
    case '+':
      res = prev + cur;
      break;

    case '-':
      res = prev - cur;
      break;

    case 'x':
      res = prev * cur;
      break;

    case '÷':
      if (cur === 0) return ''
      res = prev / cur;
      break;
  }

  return res.toString();
}

function formatNum(operand: string) {
  const [integer, decimal]: string[] = operand.split('.')
  const formatted_int = integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decimal == null) return formatted_int;
  return `${formatted_int}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  let cur_formatted: string = '';
  let prev_formatted: string = '';

  if (currentOperand) {
    cur_formatted = formatNum(currentOperand);
  }

  if (previousOperand) {
    prev_formatted = formatNum(previousOperand);
  }

  return (
    <div className='calculator-grid'>
      <div className="display">
        <div className="previousOperand">{prev_formatted} {operation}</div>
        <div className="currentOperand">{cur_formatted}</div>
      </div>
      <button
        className="span-two" onClick={() => dispatch({type: Action_types.CLEAR})}
      >
        AC
      </button>
      <button onClick={() => dispatch({type: Action_types.DELETE})}
      >
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation={'÷'} />
      <DigitButton dispatch={dispatch} digit={'1'} />
      <DigitButton dispatch={dispatch} digit={'2'} />
      <DigitButton dispatch={dispatch} digit={'3'} />
      <OperationButton dispatch={dispatch} operation={'x'} />
      <DigitButton dispatch={dispatch} digit={'4'} />
      <DigitButton dispatch={dispatch} digit={'5'} />
      <DigitButton dispatch={dispatch} digit={'6'} />
      <OperationButton dispatch={dispatch} operation={'+'} />
      <DigitButton dispatch={dispatch} digit={'7'} />
      <DigitButton dispatch={dispatch} digit={'8'} />
      <DigitButton dispatch={dispatch} digit={'9'} />
      <OperationButton dispatch={dispatch} operation={'-'} />
      <DigitButton dispatch={dispatch} digit={'.'} />
      <DigitButton dispatch={dispatch} digit={'0'} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: Action_types.EQUALS })}
      >
        =
      </button>
    </div>
  )
}

export default App;
