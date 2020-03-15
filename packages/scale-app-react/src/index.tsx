import React, { useContext } from "react"
import ReactDOM from "react-dom"
import { ViewError } from "./Modules/ErrorBoundary/ErrorBoundary"
import { ErrorBoundaryModule } from "./Modules/ErrorBoundary/errorBoundary.module"
import { SuspenseModule } from "./Modules/Suspense/suspense.module"
import { ServiceModule } from "./Modules/Services"
import * as scaleApp from "@dadoudidou/scale-app"

// module augmentation
declare module "@dadoudidou/scale-app" {
    interface ModuleMetaData {
        bootstrapElement?: React.ElementType<BootstrapElementProps>
        bootstrapElementOrdering?: number
    }
    class ModuleClass {
        bootstrapElement?: React.ElementType<BootstrapElementProps>
        bootstrapElementOrdering?: number
    }
    class ScaleApp {
        private react_error_boundary?: React.ComponentType<{ error: ViewError }>
        setReactErrorBoundary : (Element: React.ComponentType<{ error: ViewError }>) => void
        getReactErrorBoundary : () => React.ComponentType<{ error: ViewError }>

        private react_suspense?: React.ComponentType
        setReactSuspense : (Element: React.ComponentType) => void
        getReactSuspense : () => React.ComponentType
    }
}


const AppContext = React.createContext<scaleApp.ScaleApp>(null);
AppContext.displayName = "ScaleApp";

export const useScaleApp = () => {
    const ctx = useContext(AppContext);
    if(ctx == null) throw new Error("L'application n'a pas été correctement initialisée.");
    return ctx;
}
type BootstrapElementProps = {
    application: scaleApp.ScaleApp
}
type ScaleAppReactProps = { app: scaleApp.ScaleApp }
const ScaleAppReact: React.FC<ScaleAppReactProps> = (props) => {

    let _modules = Array
        .from(props.app._runnings.entries(), (k) => ({ name: k[0], module: k[1] }))
        .filter(x => Boolean(x.module.bootstrapElement))
        .sort((a,b) => {
            let _aOrder = a.module.bootstrapElementOrdering || 0;
            let _bOrder = b.module.bootstrapElementOrdering || 0;
            if(_aOrder < _bOrder) return -1;
            if(_aOrder > _bOrder) return 1;
            return 0;
        });
    

    const compose = (index: number) => {
        if(index == _modules.length) return props.children;
        var component = _modules[index].module.bootstrapElement;
        if(!component["displayName"]) component["displayName"] = _modules[index].name;
        return React.createElement(component, { application: props.app }, compose(index + 1))
    }
    let Comp = props.children;
    if(_modules.length > 0){
        Comp = compose(0);
    }

    return (
        <AppContext.Provider value={props.app}>
            {Comp}
        </AppContext.Provider>
    )
}


type pluginOption = {
    domElement?: HTMLElement
}
const defaultsOptions: pluginOption = {}

type plugin = (opts?: pluginOption) => scaleApp.PluginFunction
export const scaleAppReactPlugin: plugin = (options) => (app, opts) => {

    app.getReactErrorBoundary=function(){ return this.react_error_boundary; }
    app.setReactErrorBoundary=function(element){ this.react_error_boundary = element; }

    app.getReactSuspense=function(){ return this.react_suspense; }
    app.setReactSuspense=function(element){ this.react_suspense = element; }
    app.setReactSuspense(() => (<div>Chargement ...</div>))
    
    app.registerModule(ErrorBoundaryModule);
    app.registerModule(SuspenseModule);
    app.registerModule(ServiceModule)

    app.mediator.subscribe(app.events.instancesStarted, () => {
        let _opts: pluginOption = {
            ...defaultsOptions,
            ...options
        }
        if(_opts.domElement){
            ReactDOM.render(
                (<ScaleAppReact app={app} />),
                options.domElement
            )
        }

    });
}


