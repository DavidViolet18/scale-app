import { RMModule } from "../../Core/Module";
import { Application } from "src/Core/Application";
import { Logger } from "./Logger.service";

export class LoggerModule extends RMModule {
    moduleName="LoggerModule"
    constructor(application: Application){
        super(application);
        application.services.register(Logger, { useClass: Logger })
    }
}