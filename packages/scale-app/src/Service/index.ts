import { diInjectable } from "../DI/DI.decorator"
import { METADATA_SERVICE } from "../Core/globals"

//export const Service = diInjectable

export const Service = (): ClassDecorator => {
    return (target) => {
        Reflect.defineMetadata(METADATA_SERVICE, "", target)
        diInjectable()(target as any)
    }
}