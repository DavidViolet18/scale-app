import "reflect-metadata"
import { diProvider, diContainer } from "../DI/di.types";
import { GLOBALS_TYPE_METADATA_KEY, METADATA_MODULE } from "../Core/globals";
import { ScaleApp } from "../Core";
import { diInjectable, diScope } from "../DI/DI.decorator";
import { Lifecycle } from "tsyringe";

export type classOf<T> = Function & { new (...args: any[]): T }

export type classOfModule = classOf<ModuleClass> & { new (app: ScaleApp): ModuleClass }


const GLOBAL_MODULE_TYPE = ""


export class ModuleClass {
    static isModule = (target: Function) => {
        const _value = Reflect.getMetadata(METADATA_MODULE, target);
        if(_value == METADATA_MODULE) return true;
        return false;
    }

    static compileModule(module: classOf<any>, app: ScaleApp): classOfModule {
        if(!ModuleClass.isModule(module)) throw new Error(`${module.name} is not a valid module`);

        // register imported modules if not exists
        let _importedModules: classOfModule[] = Reflect.getMetadata("scaleapp:imports", module);
        if(_importedModules){
            _importedModules.forEach(m => {
                if(!app.hasModule(m)){
                    app.registerModule(m);
                }
            })
        }
                
        // création de la class
        let _class = class extends ModuleClass {
            constructor(app: ScaleApp){
                super(app);
                let _keys: string[] = Reflect.getMetadataKeys(module);
                _keys = _keys.filter(x => x.search(/^scaleapp:/) > -1);
                for(let i=0; i<_keys.length; i++){
                    let _key = _keys[i].replace("scaleapp:", "");
                    let _data = Reflect.getMetadata(_keys[i], module);
                    this[_key] = _data;
                }
                this._module = module;

                this.init();
            }
        };

        return _class;
    }


    providers: diProvider<any>[]
    imports: classOfModule[]
    
    private _app: ScaleApp
    private _container: diContainer
    private _module:  classOf<any>
    private _instance: any

    constructor(app: ScaleApp){
        this._app = app;
    }

    private init(){
        this._container = this._app._di.createChildContainer();
        
        this.registerProviders();
        this._container.registerType(this._module, this._module)
        diInjectable()(this._module);
    }

    private registerImportedModules(){
        if(this.imports){

        }
    }

    private registerProviders(){
        let _providers: diProvider<any>[] = []

        // import providers from imports
        if(this.imports){
            this.imports.forEach(x => {
                if(typeof(x) == "function"){
                    let __providers = Reflect.getMetadata(ModuleMetaDataKeys.providers, x);
                    if(__providers){
                        _providers = [..._providers, ...__providers];
                    }
                }
            })
        }

        // import own providers
        if(this.providers){
            _providers = [..._providers, ...this.providers]
        }
        

        // compile providers
        _providers.forEach(x => {
            if(typeof(x) == "object"){
                this._container.register(x.token, x.provider as any);
            } else if(typeof(x) == "function"){
                this._container.register(x, { useClass: x })
            }
        })
    }

    private registerMessagePattern(){
        Object.keys(this._module.prototype).forEach(key => {
            if(typeof(this._module.prototype[key]) == "function"){
                let _messagePattern = Reflect.getOwnMetadata("messagePattern",this._module, key);
                if(!_messagePattern) return;
                this._app.mediator.setMessage(_messagePattern,this._module.prototype[key], this._instance);
            }
        })
    }

    private registerEventPattern(){
        Object.keys(this._module.prototype).forEach(key => {
            if(typeof(this._module.prototype[key]) == "function"){
                let _eventPattern = Reflect.getOwnMetadata("eventPattern",this._module, key);
                if(!_eventPattern) return;
                this._app.mediator.subscribe(_eventPattern, this._module.prototype[key], this._instance);
            }
        })
    }

    startInstance(){
        this._instance = this._container.resolve(this._module);
        this.registerMessagePattern();
        this.registerEventPattern();
    }
}

export class ModulesContainer extends Map<string, classOfModule> {}

export class ModuleInstancesContainer extends Map<string, ModuleClass>{}


const ModuleMetaDataKeys = {
    providers: "providers",
    imports: "imports"
}

export interface ModuleMetaData {
    imports?: Function[]
    providers?: diProvider<any>[]
}

export const Module = (metaData: ModuleMetaData): ClassDecorator => {
    // -- validation des paramètres d'entrée

    // -- complétion de l'objet
    return (target) => {
        Reflect.defineMetadata(METADATA_MODULE, METADATA_MODULE, target);
        for(let property in metaData){
            Reflect.defineMetadata("scaleapp:" + property, metaData[property], target);
        }
    }
}


