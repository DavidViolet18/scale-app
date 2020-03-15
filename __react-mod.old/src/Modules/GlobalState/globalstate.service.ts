import { globalStateStore } from "./globalstate.store"
import { Action } from "redux";
import { ServiceInjectable } from "../Services";

@ServiceInjectable()
export class globalStateService<T> {
    constructor(){}

    getCurrentState(): T {
        return globalStateStore.getState() as T;
    }

    dispatch<K>(action: Action<K>){
        globalStateStore.dispatch(action);
    }
}