import "reflect-metadata"
import { container as tsyringeContainer, RegistrationOptions, injectable, DependencyContainer} from "tsyringe"
import { diContainer, diClassProvider, diConstructor, diFactoryProvider, diToken, diTokenProvider, diValueProvider } from "./di.types";
export class DI {

    private container: DependencyContainer;
    constructor(container?: DependencyContainer){
        this.container = (container || tsyringeContainer).createChildContainer();
        //this.register = this.register.bind(this);
        //console.log("di", this.container)
    }

    register<T>(token: diToken<T>, provider: diValueProvider<T>): diContainer;
    register<T>(token: diToken<T>, provider: diFactoryProvider<T>): diContainer;
    register<T>(token: diToken<T>, provider: diTokenProvider<T>, options?: RegistrationOptions): diContainer;
    register<T>(token: diToken<T>, provider: diClassProvider<T>, options?: RegistrationOptions): diContainer;
    register<T>(token: diToken<T>, provider: diConstructor<T>, options?: RegistrationOptions): diContainer;
    register(token: any, provider: any, options?: any) {
        return this.container.register(token, provider, options);
    }

    registerSingleton<T>(from: diToken<T>, to: diToken<T>): diContainer;
    registerSingleton<T>(token: diConstructor<T>): diContainer;
    registerSingleton(from: any, to?: any) {
        return this.container.registerSingleton(from, to);
    }

    registerType<T>(from: diToken<T>, to: diToken<T>): diContainer {
         this.container.registerType(from, to);
         return this;
    }
    registerInstance<T>(token: diToken<T>, instance: T): diContainer {
        this.container.registerInstance(token, instance);
        return this;
    }
    resolve<T>(token: diToken<T>): T {
        return this.container.resolve(token);
    }
    resolveAll<T>(token: diToken<T>): T[] {
        return this.container.resolveAll(token)
    }
    isRegistered<T>(token: diToken<T>, recursive?: boolean): boolean {
        return this.container.isRegistered(token, recursive);
    }
    reset(): void {
        this.container.reset();
    }
    createChildContainer(): DI {
        return new DI(this.container);
    }
    

}

