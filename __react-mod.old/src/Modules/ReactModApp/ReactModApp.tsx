import React, { useContext } from "react"
import { Application } from "../../Core/Application"


const AppContext = React.createContext<Application>(null);
AppContext.displayName = "ReactModApp";

export const useReactModApp = () => {
    const ctx = useContext(AppContext);
    if(ctx == null) throw new Error("L'application n'a pas été correctement initialisée.");
    return ctx;
}

type ReactModAppProps = {
    app: Application
}
export const ReactModApp: React.FC<ReactModAppProps> = (props) => {
    const modules = props.app.getModules().filter(x => Boolean(x.bootstrapComponent));
    const compose = (index: number) => {
        if(index == modules.length) return props.children;
        var component = modules[index].bootstrapComponent;
        if(!component.displayName) component.displayName = modules[index].moduleName;
        return React.createElement(modules[index].bootstrapComponent, { application: props.app }, compose(index + 1))
    }
    let Comp = props.children;
    if(modules.length > 0){
        Comp = compose(0);
    }

    return (
        <AppContext.Provider value={props.app}>
            {Comp}
        </AppContext.Provider>
    )
    /*
    return (
        <AppContext.Provider value={props.app}>
            <SuspenseModule application={props.app}>
                <ErrorBoundary  application={props.app}>
                    <ServiceProvider>
                        {props.children}
                    </ServiceProvider>
                </ErrorBoundary>
            </SuspenseModule>
        </AppContext.Provider>
    )
    */
}