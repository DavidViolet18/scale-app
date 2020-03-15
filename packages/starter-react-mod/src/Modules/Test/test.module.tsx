import React from "React"
import { Module } from "@dadoudidou/scale-app";

@Module({
    bootstrapElement: (props) => (<div>Hello World<div>{props.children}</div></div>),
    routes: {
        "/test": () => {
            console.log("test route")
            return () => (<div>Test</div>)
        },
        "/test/:testId": (params) => {
            console.log("testid route")
            return () => (<div>Test id: {params.testId}</div>)
        }
    }
})
export class TestModule {}