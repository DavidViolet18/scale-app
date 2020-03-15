import { container as tsyringeContainer, DependencyContainer, InjectionToken, RegistrationOptions, ValueProvider, FactoryProvider, TokenProvider, ClassProvider } from "tsyringe"
import { constructor } from "tsyringe/dist/typings/types";
export class ServiceDI {

    private container: DependencyContainer;
    constructor(container?: DependencyContainer){
        this.container = (container || tsyringeContainer).createChildContainer();
    }

    register<T>(token: InjectionToken<T>, provider: ValueProvider<T>): DependencyContainer;
    register<T>(token: InjectionToken<T>, provider: FactoryProvider<T>): DependencyContainer;
    register<T>(token: InjectionToken<T>, provider: TokenProvider<T>, options?: RegistrationOptions): DependencyContainer;
    register<T>(token: InjectionToken<T>, provider: ClassProvider<T>, options?: RegistrationOptions): DependencyContainer;
    register<T>(token: InjectionToken<T>, provider: constructor<T>, options?: RegistrationOptions): DependencyContainer;
    register(token: any, provider: any, options?: any) {
        return this.container.register(token, provider, options);
    }

    registerSingleton<T>(from: InjectionToken<T>, to: InjectionToken<T>): DependencyContainer;
    registerSingleton<T>(token: constructor<T>): DependencyContainer;
    registerSingleton(from: any, to?: any) {
        return this.container.registerSingleton(from, to);
    }

    registerType<T>(from: InjectionToken<T>, to: InjectionToken<T>): DependencyContainer {
        return this.container.registerType(from, to);
    }
    registerInstance<T>(token: InjectionToken<T>, instance: T): DependencyContainer {
        return this.container.registerInstance(token, instance);
    }
    resolve<T>(token: InjectionToken<T>): T {
        return this.container.resolve(token);
    }
    resolveAll<T>(token: InjectionToken<T>): T[] {
        return this.container.resolveAll(token)
    }
    isRegistered<T>(token: InjectionToken<T>, recursive?: boolean): boolean {
        return this.container.isRegistered(token, recursive);
    }
    reset(): void {
        this.container.reset();
    }
    createChildContainer(): ServiceDI {
        return new ServiceDI(this.container);
    }
    

}