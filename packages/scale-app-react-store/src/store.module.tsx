import React from "react"
import { createStoreHook, createDispatchHook, createSelectorHook, Provider } from "react-redux";
import * as scaleAppReact from "@dadoudidou/scale-app-react";
import * as scaleAppStore from "@dadoudidou/scale-app-store";
import * as scaleApp from "@dadoudidou/scale-app";



const storeContext = React.createContext(null);
storeContext.displayName = "Store"


export const useStore: () => scaleAppStore.Store = createStoreHook(storeContext) as any;
export const useStoreDispatch = createDispatchHook(storeContext);
export const useStoreSelector = createSelectorHook(storeContext);


type StoreProviderProps = {
    store: scaleAppStore.Store
}

export const StoreProvider: React.FC<StoreProviderProps> = (props) => {
    return (
        <Provider context={storeContext} store={props.store["_store"]}>
            {props.children}
        </Provider>
    )
}

@scaleApp.Module({
    bootstrapElementOrdering: -89,
    bootstrapElement: (props) => (
        <StoreProvider store={props.application["getStore"]()}>
            {props.children}
        </StoreProvider>
    )
})
export class StoreModule {}