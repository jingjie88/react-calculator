import { Action_types, Actions } from './App'

interface Props {
    dispatch: Function;
    operation: string;
}

export default function OperationButton({dispatch, operation}: Props) {
    return (
        <button onClick = {() => dispatch({ type: Action_types.CHOOSE_OPERATION, payload: operation })}>
            {operation}
        </button>
    )
}