import React from "react"
import { Application } from "./Application";
import "reflect-metadata";

export interface IRMModule {
    readonly moduleName: string
    readonly bootstrapComponent?: React.FC
}

type bootstrapComponentProps = {
    application: Application
}

export abstract class RMModule {

    /** Nom du module */
    public readonly moduleName: string

    /** Composant chargé en entete de l'application */
    public readonly bootstrapComponent?: React.FC<bootstrapComponentProps>

    /** Instance de l'application */
    protected readonly application: Application

    constructor(application: Application) {
        //if(this.moduleName == null) throw new Error("Module name is not defined");
        this.application = application;
    }
}


