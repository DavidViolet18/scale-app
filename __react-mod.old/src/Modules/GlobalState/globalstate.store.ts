import { createStore, Store, combineReducers, Reducer } from "redux";

type asyncReducer = { [key: string]: Reducer }
export type GlobalStore = {
    addReducers: (reducers: asyncReducer) => void
    hasReducer: (reducer: string) => boolean
    asyncReducer: asyncReducer
} & Store<any, any>

const StoreReducers: asyncReducer = {}

const createRootReducer = (reducers: asyncReducer) => {
    const appReducer = combineReducers(reducers);
    return (state, action) => {
        return appReducer(state, action);
    }
}

export const globalStateStore: GlobalStore = createStore(
    createRootReducer(StoreReducers),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
globalStateStore.asyncReducer = StoreReducers;
globalStateStore.hasReducer = (reducer) => {
    return Boolean(globalStateStore.asyncReducer[reducer]);
}
globalStateStore.addReducers = (reducers) => {
    let _asyncReducers = globalStateStore.asyncReducer;
    Object.keys(reducers).forEach(x => {
        if (!globalStateStore.hasReducer(x)) {
            _asyncReducers = {
                ..._asyncReducers,
                [x]: reducers[x]
            }
        }
    });
    if (globalStateStore.asyncReducer !== _asyncReducers) {
        globalStateStore.asyncReducer = _asyncReducers;
        globalStateStore.replaceReducer(createRootReducer(_asyncReducers));
    }
}