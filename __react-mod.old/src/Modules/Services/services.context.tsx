import React, { createContext, useContext } from "react"
import { DependencyContainer, InjectionToken } from "tsyringe"
import { ServiceDI } from "./service.di";

const ServiceContext = createContext<DependencyContainer>(new ServiceDI());
ServiceContext.displayName = "Services"

type ServiceProviderProps = {
    serviceDi?: DependencyContainer
}

export const ServiceProvider:React.FC<ServiceProviderProps> = (props) => {
    const oldContainer = useServiceContainer();
    let container: DependencyContainer = oldContainer;
    if(props.serviceDi) container = props.serviceDi;
    else container = oldContainer.createChildContainer();
    return (
        <ServiceContext.Provider value={container}>
            {props.children}
        </ServiceContext.Provider>
    )
}

export const useServiceContainer = () => {
    return useContext(ServiceContext);
}

export const useService = function <T>(service: InjectionToken<T>){
    const container = useServiceContainer();
    return container.resolve(service);
}