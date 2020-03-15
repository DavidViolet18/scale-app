import { ScaleApp } from "../Core"

export type PluginFunction = (app: ScaleApp, options?: any) => void
export type PluginObject = { plugin: PluginFunction, options?: any }
export type Plugin = PluginFunction | PluginObject

export class PluginContainer extends Set<PluginObject> {}