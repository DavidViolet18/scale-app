import { GlobalStateActionCreator, GlobalStateAction } from "./globalstate.types";

export const createGlobalStateAction = <T = any>(type: string) => {
    const actionCreator= (payload: T) => {
        return { type, payload }
    }
    let _actionCreator = actionCreator as GlobalStateActionCreator<T>;
    _actionCreator.type = type;
    return _actionCreator;
}

export const isGlobalStateAction = <T>(action: GlobalStateAction<T>, actionCreator: GlobalStateActionCreator<T>): action is GlobalStateAction<T> => {
    return action.type === actionCreator.type;
}