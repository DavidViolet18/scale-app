import React from "react"
import { Module } from "@dadoudidou/scale-app";
import { ErrorBoundary } from "./ErrorBoundary";

@Module({
    bootstrapElement: (props) => (<ErrorBoundary {...props} />),
    bootstrapElementOrdering: -99
})
export class ErrorBoundaryModule {}