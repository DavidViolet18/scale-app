import React from "react"
import { RMModule } from "../../Core/Module"
import { ErrorBoundary } from "./ErrorBoundary"


export class ErrorBoundaryModule extends RMModule {
    moduleName="ErrorBoundaryModule"
    bootstrapComponent = (p) => {
        return (
            <ErrorBoundary application={p.application}>{p.children}</ErrorBoundary>
        )
    }
}