import { LiteEventManager } from "@dadoudidou/liteevent";

/**
 * Communication entre modules via un médiateur
 */

class ModuleA {
    private private_var: {} = {}
    public public_var: {} = {}
    constructor(private readonly mediator: Mediator){
        mediator.subscribe("changeName", this.onChangeName)
    }
    onChangeName(name: string){
        console.log("moduleA", "onChangeName", name)
    }
    changeName(name: string){
        this.mediator.publish("changeName", name);
    }
}

class ModuleB {
    private private_var: {} = {}
    public public_var: {} = {}
    constructor(mediator: Mediator){
        mediator.subscribe("changeName", this.onChangeName)
    }
    onChangeName(name: string){
        console.log("moduleB", "onChangeName", name)
    }
}

class Mediator {
    channels = new LiteEventManager();

    subscribe(channel, fn){
        this.channels.on(channel, fn);
    }
    publish(channel, arg?: any){
        this.channels.trigger(channel)(arg)
    }
}

var mediator = new Mediator();
var moduleA = new ModuleA(mediator);
var moduleB = new ModuleB(mediator);
moduleA.changeName("Hello");
