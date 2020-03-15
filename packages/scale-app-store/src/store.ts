import { createStore as reduxCreateStore, Store as ReduxStore, combineReducers, Reducer } from "redux";

type asyncReducer = { [key: string]: Reducer }

export type StoreAction<T> = { type: string, payload: T }
export type StoreActionCreator<T> = { type: string, (payload: T) : StoreAction<T> }

export const createStoreAction = <T = any>(type: string) => {
    const actionCreator= (payload: T) => {
        return { type, payload }
    }
    let _actionCreator = actionCreator as StoreActionCreator<T>;
    _actionCreator.type = type;
    return _actionCreator;
}
export const isStoreAction = <T>(action: StoreAction<T>, actionCreator: StoreActionCreator<T>): action is StoreAction<T> => {
    return action.type === actionCreator.type;
}

export class Store {
    private _store: ReduxStore
    private _reducers: asyncReducer
    constructor(){
        this.init();
    }
    private rootReducing(reducers: asyncReducer){
        const appReducer = combineReducers(reducers);
        return (state, action) => {
            return appReducer(state, action);
        }
    }
    private init(){
        this._reducers = { __default__: (s = {}) => s };
        this._store = reduxCreateStore(
            this.rootReducing(this._reducers),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        );
    }
    hasReducer(reducer: string): boolean {
        return Boolean(this._reducers[reducer]);
    }
    addReducers(reducers: asyncReducer){
        let _asyncReducers = this._reducers;
        Object.keys(reducers).forEach(x => {
            if (!this.hasReducer(x)) {
                _asyncReducers = {
                    ..._asyncReducers,
                    [x]: reducers[x]
                }
            }
        });
        if (this._reducers !== _asyncReducers) {
            this._reducers = _asyncReducers;
            this._store.replaceReducer(this.rootReducing(this._reducers));
        }
    }
    getState<T = any>(): T{
        return this._store.getState() as T;
    }
    createStoreAction<T = any>(type: string){
        return createStoreAction(type);
    }
    isStoreAction<T>(action: StoreAction<T>, actionCreator: StoreActionCreator<T>): action is StoreAction<T> {
        return isStoreAction(action, actionCreator);
    }
    dispatch<T>(action: StoreAction<T>){
        this._store.dispatch(action);
    }
}
