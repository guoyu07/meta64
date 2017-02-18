console.log("DomBind.ts");

import { util } from "./Util";

class DomBind {
    /* Binds DOM IDs to functions that should be called on "onClick" */
    private idToOnClickMap: { [key: string]: Function } = {};
    private idToKeyPressMap: { [key: string]: Function } = {};

    constructor() {
        /* I bet there's a better way to subscribe to DOM events than this timer, but i'm using the timer for now */
        setInterval(function() {
            if (domBind) {
                domBind.interval();
            }
        }, 500);
    }

    private interval = (): void => {
        let thiz = this;
        util.forEachProp(this.idToOnClickMap, function(id, func) {
            let e = util.domElm(id);
            if (e) {
                (<any>e).onclick = func;
                delete thiz.idToOnClickMap[id];
            }
        });

        util.forEachProp(this.idToKeyPressMap, function(id, func) {
            let e = util.domElm(id);
            if (e) {
                (<any>e).onkeypress = this.idToKeyPressMap[id];
                delete thiz.idToKeyPressMap[id];
            }
        });
    }

    public addOnClick(domId: string, callback: Function) {
        this.idToOnClickMap[domId] = callback;
    }

    public addKeyPress(domId: string, callback: Function) {
        this.idToKeyPressMap[domId] = callback;
    }
}

export let domBind: DomBind = new DomBind();
export default domBind;
