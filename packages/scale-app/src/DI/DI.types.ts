import { DI } from "./DI";

type constructor<T> = { new (...args: any[]): T; };

export type diContainer = DI
export type diToken<T = any> = constructor<T> | string | symbol

export type diProvider<T = any> =  
    | diConstructor<T>
    | {
        token: diToken<T>,
        provider: 
        | diConstructor<T>
        | diValueProvider<T>
        | diFactoryProvider<T>
        | diTokenProvider<T>
        | diClassProvider<T>
    }    

    

export type diValueProvider<T> = { useValue: T; }
export type diFactoryProvider<T> = { useFactory: (dependencyContainer: diContainer) => T; }
export type diTokenProvider<T> = { useToken: diToken<T> }
export type diClassProvider<T> = { useClass: diConstructor<T>; }
export type diConstructor<T> = constructor<T>