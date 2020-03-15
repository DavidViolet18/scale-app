import { PluginFunction, ScaleApp, ModuleClass } from "@dadoudidou/scale-app"
import { StoreModule } from "./store.module"


type pluginOption = { }
const defaultsOptions: pluginOption = {}
type plugin = (opts?: pluginOption) => PluginFunction
export const scaleAppReactStorePlugin: plugin = (options) => (app) => {
    app.registerModule(StoreModule)
}


