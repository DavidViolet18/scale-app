import React, { Suspense } from "react";
import { Module } from "@dadoudidou/scale-app";


@Module({
    bootstrapElement: (props) => (
        <Suspense fallback={props.application.getReactSuspense()}>
            {props.children}
        </Suspense>
    ),
    bootstrapElementOrdering: -99
})
export class SuspenseModule { }