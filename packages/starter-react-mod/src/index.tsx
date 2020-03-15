import React, { useState } from "react"
import ReactDOM from "react-dom"

if (module.hot) {
    module.hot.accept()
}

import { ScaleApp } from "@dadoudidou/scale-app"
import { scaleAppReactPlugin } from "@dadoudidou/scale-app-react"
import { scaleAppStorePlugin } from "@dadoudidou/scale-app-store"
import { scaleAppReactStorePlugin } from "@dadoudidou/scale-app-react-store"
import { scaleAppRouterPlugin } from "@dadoudidou/scale-app-router"
import { scaleAppReactRouterPlugin } from "@dadoudidou/scale-app-react-router"
import { AppModule } from "./App"

const app = new ScaleApp();
app.use([
    scaleAppReactPlugin({ domElement: document.getElementById("app") }),
    scaleAppStorePlugin(),
    scaleAppReactStorePlugin(),
    scaleAppRouterPlugin(),
    scaleAppReactRouterPlugin()
]);

app.registerModule(AppModule);
app.start();
window["temp1"] = app;


