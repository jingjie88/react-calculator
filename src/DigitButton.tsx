import { Action_types } from './App'

interface Props {
    dispatch: Function; 
    digit: string;
}

export default function DigitButton({dispatch, digit}: Props) {
    return (
        <button 
            onClick = {() => dispatch({ type: Action_types.ADD_DIGIT, payload: digit })}
        >
            {digit}
        </button>
    )
}
    