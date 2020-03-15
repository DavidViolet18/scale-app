import React, { createContext } from "react"
import { Router, RouteMapped } from "@dadoudidou/scale-app-router";
import { Module, ScaleApp } from "@dadoudidou/scale-app";
import "@dadoudidou/scale-app-react"
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useScaleApp } from "@dadoudidou/scale-app-react";

const ReactRouterContext = createContext<Router>(null);
ReactRouterContext.displayName = "Router";


const Switch: React.FC<{ app: ScaleApp }> = (props) => {
    const [route, setRoute] = useState<RouteMapped>(props.app.router._lastRoute);
    const [init, setInit] = useState(false);
    if(!init){
        setInit(true);
        props.app.mediator.subscribe("router:updateroute", (r) => {
            setRoute(r);
        });
    }
    if(route == null) return null;
    let Comp: any = route.result;
    return React.createElement(Comp);
}


@Module({
    bootstrapElement: (props) => {
        return (
            <ReactRouterContext.Provider value={props.application.router}>
                <Switch app={props.application}>{props.children}</Switch>
            </ReactRouterContext.Provider>
        )
    }
})
export class ReactRouterModule {}