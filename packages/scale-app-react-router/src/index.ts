import React from "react"
import "@dadoudidou/scale-app"
import { PluginFunction } from "@dadoudidou/scale-app"
import { RouteOrHandler, RouteHandlerNotFound } from "@dadoudidou/scale-app-router"
export { ReactRouterModule } from "./ReactRouter.module"

// module augmentation
declare module "@dadoudidou/scale-app" {
    interface ModuleMetaData {
        
    }
}

type pluginOption = { 
    history?: History,
    notFoundRoute?: RouteHandlerNotFound
}
const defaultsOptions: pluginOption = {}
type plugin = (opts?: pluginOption) => PluginFunction
export const scaleAppReactRouterPlugin: plugin = (options) => (app) => {
    //app.registerModule(ReactRouterModule)
}


