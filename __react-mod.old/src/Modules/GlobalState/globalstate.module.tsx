import React from "react"
import { RMModule } from "../../Core/Module";
import { Application } from "../../Core/Application";
import { GlobalStateProvider } from "./globalstate.context";
import { globalStateService } from "./globalstate.service";

export class GlobalStateModule extends RMModule {

    moduleName = "GlobalStateModule"

    constructor(application: Application){
        super(application);
        application.services.register(globalStateService, { useClass: globalStateService })
    }

    bootstrapComponent: React.FC = (props) => (
        <GlobalStateProvider>{props.children}</GlobalStateProvider>
    )
}