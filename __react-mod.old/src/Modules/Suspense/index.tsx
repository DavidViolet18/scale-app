import React, { Suspense } from "react"
import { RMModule } from "../../Core/Module"



export class SuspenseModule extends RMModule {
    moduleName="SuspenseModule";
    bootstrapComponent: React.FC =(props) => (
        <Suspense fallback={this.application.getSuspenseFallback()}>
            {props.children}
        </Suspense>
    )
}