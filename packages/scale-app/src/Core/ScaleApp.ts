import { ModuleClass, ModulesContainer, ModuleInstancesContainer, classOfModule, classOf } from "../Module";
import { v4 as uuid } from "uuid"
import { DI } from "../DI/DI";
import { LiteEventManager } from "@dadoudidou/liteevent"
import { asyncForEach } from "../Utils"
import { Plugin, PluginFunction, PluginContainer } from "../Plugins";
import { Mediator } from "../Mediator";
import { RuntimeError } from "./error";

export const ScaleAppEvents = {
    registerModule: "registerModule",
    startModule: "startModule",
    stopModule: "stopModule",
    pluginsStarted: "pluginsStarted",
    modulesStarted: "modulesStarted",
    instancesStarted: "instancesStarted",
    runtimeError: "runtimeError",
    error: "error"
}

export const ScaleAppModuleOrder = {

}

export class ScaleApp {
    _modules: Map<string, classOfModule> = new Map<string, classOfModule>();
    _runnings: Map<string, ModuleClass> = new Map<string, ModuleClass>();
    _plugins: PluginContainer = new PluginContainer();
    _di: DI = new DI();
    //_events: LiteEventManager<ScaleAppEvents> = new LiteEventManager();
    mediator: Mediator = new Mediator();
    readonly events = ScaleAppEvents;

    constructor(){
        
        this.runtimeErrorHandler = this.runtimeErrorHandler.bind(this);
        if(window) window.addEventListener("error", this.runtimeErrorHandler);

        this._di.register(ScaleApp, { useValue: this })
        this._di.register(Mediator, { useValue: this.mediator });
        
    }

    registerModule(module: classOfModule | classOf<any>, moduleName?: string) {
        if (!moduleName) moduleName = module.name;
        if (this._modules.has(moduleName)) throw new Error(`Module "${moduleName}" was already registered`)
        let _module = ModuleClass.compileModule(module, this);
        this._modules.set(moduleName, _module);
        this.mediator.publish(this.events.registerModule, moduleName)
    }

    hasModule(module: classOfModule | classOf<any> | string){
        let _moduleName: string = typeof (module) == "string" ? module : module.name;
        return this._modules.has(_moduleName);
    }

    startModule(module: string | classOfModule | classOf<any>, instanceId?: string) {
        let _instanceId = instanceId;
        let _moduleName: string = typeof (module) == "string" ? module : module.name;
        if (!_instanceId) _instanceId = _moduleName;

        if (this._runnings.has(_instanceId)) return;
        if (!this._modules.has(_moduleName)) throw new Error(`Module "${_moduleName}" not registered`);
        let _module = this._modules.get(_moduleName)
        this._runnings.set(_instanceId, this.createInstance(_module));
        this.mediator.publish(this.events.startModule, _instanceId)
    }

    stopModule(instanceId: string) {
        let _module = this._runnings.get(instanceId);
        if(_module){
            this._runnings.delete(instanceId);
            this.mediator.publish(this.events.stopModule, instanceId)
        }
    }


    start() {
        const _start = () => {
            // démarre les plugins
            this._plugins.forEach(p => {
                p.plugin(this, p.options)
            })
            this.mediator.publish(this.events.pluginsStarted)

            // démarre les modules
            let _keys = Array.from(this._modules.keys());
            _keys.forEach(x => {
                this.startModule(x);
            })
            this.mediator.publish(this.events.modulesStarted)

            // démarre les instances
            this._runnings.forEach((value, key) => {
                if(value.startInstance){
                    value.startInstance();
                }
            })
            this.mediator.publish(this.events.instancesStarted)
        }
        _start();
    }

    createInstance(module: classOfModule): ModuleClass {
        return new module(this);
    }

    use(plugin: PluginFunction, options?: any)
    use(plugins: Plugin[])
    use(plugins: Plugin | Plugin[], options?: any){
        if(Array.isArray(plugins)){
            plugins.forEach(x => {
                if(typeof(x) == "function") this.use(x);
                else if(typeof(x) == "object") this.use(x.plugin, x.options);
            })
        }
        let plugin = plugins as PluginFunction;
        if(typeof(plugin) !== "function") return this;
        this._plugins.add({ plugin, options })
        return this;
    }

    private runtimeErrorHandler(event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error){
        let _err = new RuntimeError(
            typeof (event) == "string" ? event : "",
            lineno, colno,
            error, source
        );
        this.mediator.publish(this.events.runtimeError, _err);
        this.mediator.publish(this.events.error, _err);
    }

}