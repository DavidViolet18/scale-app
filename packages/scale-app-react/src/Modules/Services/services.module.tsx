import React from "react"
import { Module } from "@dadoudidou/scale-app";
import { ServiceProvider } from "./services.context";


@Module({
    bootstrapElementOrdering: -99,
    bootstrapElement: (props) => (
        <ServiceProvider serviceDi={props.application._di}>
            {props.children}
        </ServiceProvider>
    )
})
export class ServiceModule {}