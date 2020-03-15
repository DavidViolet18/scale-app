import { Store } from "./store"
export * from "./store"
import * as scaleApp from "@dadoudidou/scale-app"

// module augmentation
declare module "@dadoudidou/scale-app" {
    class ScaleApp {
        private _store: Store
        setStore: (store: Store) => void
        getStore: () => Store
    }
}

type pluginOption = { }
const defaultsOptions: pluginOption = {}
type plugin = (opts?: pluginOption) => scaleApp.PluginFunction
export const scaleAppStorePlugin: plugin = (options) => (app) => {
    app.setStore = function(store){ this._store = store }
    app.getStore = function(){ return this._store; }
    app.setStore(new Store());
}


