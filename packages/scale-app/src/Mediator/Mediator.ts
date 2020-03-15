import { LiteEventManager, LiteEventHandler } from "@dadoudidou/liteevent"

export class Mediator {

    private eventManager = new LiteEventManager();

    subscribe(channel: string, fn: LiteEventHandler<any>, context?: Object)
    subscribe(channel: string[], fn: LiteEventHandler<any>, context?: Object)
    subscribe(channel: string | string[], fn: LiteEventHandler<any>, context?: any){
        return this.eventManager.on(channel as any, fn, context);
    }

    unsubscribe(channel: string)
    unsubscribe(fn: LiteEventHandler<any>)
    unsubscribe(channel: string, fn: LiteEventHandler<any>)
    unsubscribe(channel: any, fn?: any ){
        this.eventManager.off(channel, fn);
    }

    publish(channel: string, data?: any){
        this.eventManager.trigger(channel)(data);
    }

    private messageManager = new Map<string, { ctx?: any, func: Function }>();

    send<T = void>(pattern: string, ...payload: any[]): T {
        if(!this.messageManager.has(pattern)) return null;
        let _msg = this.messageManager.get(pattern);
        
        if(_msg.ctx){
            return _msg.func.call(_msg.ctx, ...payload);
        }
        return _msg.func(...payload);
    }

    setMessage(pattern: string, func: Function, context?: any){
        if(this.messageManager.has(pattern)) throw new Error(`Pattern message "${pattern}" already exists.`);
        this.messageManager.set(pattern, { func, ctx: context });
    }

}