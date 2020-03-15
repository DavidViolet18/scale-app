import React from "react"
import { ReactModApp } from "../Modules/ReactModApp/ReactModApp";
import { LiteEventManager } from "@dadoudidou/liteevent";
import { RMError, RMRuntimeError } from "./ReactModError";
import { RMViewError, ErrorBoundaryModule } from "../Modules/ErrorBoundary";
import { RMModule, IRMModule } from "./Module";
import { SuspenseModule } from "../Modules/Suspense";
import { ServiceDI, ServiceModule } from "../Modules/Services";
import { LoggerModule, ILogger, Logger } from "../Modules/Logger";
import { GlobalStateModule } from "../Modules/GlobalState";

type eventsManager = {
    "error": RMError
    "runtimeError": RMRuntimeError
    "viewError": RMViewError
    "moduleAdded": RMModule
}

export class Application {
    public services: ServiceDI;
    public events: LiteEventManager<eventsManager> = new LiteEventManager();
    public modules: RMModule[] = [];

    constructor(){
        this.events.add("error");
        this.events.add("runtimeError");
        this.events.add("viewError");
        this.events.add("moduleAdded")

        this.services = new ServiceDI();

        this.addModules([
            new SuspenseModule(this),
            new ErrorBoundaryModule(this),
            new ServiceModule(this, this.services),
            new GlobalStateModule(this),
            new LoggerModule(this),
        ])

        // -- gestion des erreurs javascript
        this.runtimeErrorHandler = this.runtimeErrorHandler.bind(this);
        if(window) window.addEventListener("error", this.runtimeErrorHandler);

    }

    /** Erreurs javascripts */
    private runtimeErrorHandler(event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error){
        let _err = new RMRuntimeError(
            typeof (event) == "string" ? event : "",
            lineno, colno,
            error, source
        );
        this.events.trigger("runtimeError")(_err);
        this.events.trigger("error")(_err);
    }

    bootstrap(element: React.ReactElement){
        return (
            <ReactModApp app={this}>
                {element}
            </ReactModApp>
        )
    }

    //#region Modules

    addModules(modules: RMModule[]){
        if(modules && modules.length > 0){
            modules.forEach(x => {
                this.modules.push(x);
                this.events.trigger("moduleAdded")(x)
            });
        }
    }

    getModules(){
        return this.modules;
    }

    //#endregion

    //#region Logger

    setLogger(logger: ILogger){
        this.services.register(Logger, { useValue: logger });
    }

    //#endregion

    //#region Error Boundary
    private _errorBoundary: React.ComponentType<{ error: RMViewError }>
    setErrorBoundary(Element: React.ComponentType<{ error: RMViewError }>){
        this._errorBoundary = Element;
    }
    getErrorBoundary(){
        return this._errorBoundary;
    }
    //#endregion

    //#region Suspense
    private _suspenseFallback: React.ReactNode = (<div>Chargement ...</div>)
    setSuspenseFallback(Element: React.ReactNode){
        this._suspenseFallback = Element;
    }
    getSuspenseFallback(){
        return this._suspenseFallback;
    }
    //#endregion


}