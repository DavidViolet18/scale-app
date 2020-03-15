import React from "react"
import { RMModule } from "../../Core/Module";
import { ServiceProvider } from "./services.context";
import { Application } from "src/Core/Application";
import { ServiceDI } from "./service.di";
import { DependencyContainer } from "tsyringe";

export class ServiceModule extends RMModule {
    moduleName = "ServiceModule";

    constructor(application: Application, private readonly serviceDI: DependencyContainer){
        super(application);
    }

    bootstrapComponent: React.FC = (props) => (
        <ServiceProvider serviceDi={this.serviceDI}>
            {props.children}
        </ServiceProvider>
    )
}