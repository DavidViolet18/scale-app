import React, { createContext, useContext } from "react"
import { diContainer, diToken } from "@dadoudidou/scale-app"


const ServiceContext = createContext<diContainer>(null);
ServiceContext.displayName = "Services"

type ServiceProviderProps = {
    serviceDi: diContainer
}

export const ServiceProvider:React.FC<ServiceProviderProps> = (props) => {
    return (
        <ServiceContext.Provider value={props.serviceDi}>
            {props.children}
        </ServiceContext.Provider>
    )
}

export const useServiceContainer = () => {
    return useContext(ServiceContext);
}

export const useService = function <T>(service: diToken<T>){
    const container = useServiceContainer();
    return container.resolve(service);
}