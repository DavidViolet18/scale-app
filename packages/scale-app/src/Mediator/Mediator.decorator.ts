export const MessagePattern = (pattern: string): MethodDecorator => {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata("messagePattern", pattern, target.constructor, propertyKey)
    }
}

export const EventPattern = (eventName: string): MethodDecorator => {
    return (target, propertyKey) => {
        Reflect.defineMetadata("eventPattern", eventName, target.constructor, propertyKey)
    }
}

