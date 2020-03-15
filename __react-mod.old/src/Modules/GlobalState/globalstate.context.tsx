import React from "react"
import { createStoreHook, createDispatchHook, createSelectorHook, Provider, useStore } from "react-redux";
import { GlobalStore, globalStateStore } from "./globalstate.store";


const globalStateContext = React.createContext(null);
globalStateContext.displayName = "GlobalState"


export const useGlobalState = createStoreHook(globalStateContext) as () => GlobalStore;
export const useGlobalStateDispatch = createDispatchHook(globalStateContext);
export const useGlobalStateSelector = createSelectorHook(globalStateContext);

type GlobalStateProviderProps = {
    store?: GlobalStore
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = (props) => {
    return (
        <Provider context={globalStateContext} store={props.store || globalStateStore}>
            {props.children}
        </Provider>
    )
}