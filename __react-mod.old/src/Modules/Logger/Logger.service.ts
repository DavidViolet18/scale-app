import { ServiceInjectable } from "../Services"

export interface ILogger {
    error(...args: any[])
    warn(...args: any[])
    info(...args: any[])
    log(...args: any[])
    debug(...args: any[])
}

@ServiceInjectable()
export class Logger implements ILogger {
    error(...args: any[]) {
        if(console && console.error) console.error(...args)
    }
    warn(...args: any[]) {
        if(console && console.warn) console.warn(...args)
    }
    info(...args: any[]) {
        if(console && console.info) console.info(...args)
    }
    log(...args: any[]) {
        if(console && console.log) console.log(...args)
    }
    debug(...args: any[]) {
        if(console && console.debug) console.debug(...args)
    }
}