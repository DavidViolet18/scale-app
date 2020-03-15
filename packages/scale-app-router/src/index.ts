import "@dadoudidou/scale-app"
import { PluginFunction } from "@dadoudidou/scale-app"
import { Router, RouteOrHandler, RouteHandlerNotFound } from "./Router/Router"
import { History } from "history"

export * from "./Router/Router"

// module augmentation
declare module "@dadoudidou/scale-app" {
    class ScaleApp {
        router: Router
    }
    interface ModuleMetaData {
        routes?: { [path: string]: RouteOrHandler }
    }
    class ModuleClass {
        routes?: { [path: string]: RouteOrHandler }
    }
}

type pluginOption = { 
    history?: History,
    notFoundRoute?: RouteHandlerNotFound
}
const defaultsOptions: pluginOption = {}
type plugin = (opts?: pluginOption) => PluginFunction
export const scaleAppRouterPlugin: plugin = (options) => (app) => {
    app.router = new Router(app, options && options.history);
    if(options && options.notFoundRoute) app.router.notFound(options.notFoundRoute);
    app.mediator.subscribe(app.events.instancesStarted, () => {
        app._runnings.forEach(x => {
            if(x.routes){
                app.router.on(x.routes);
            }
        })
        app.router.resolve();
    })
}


