console.log("BindClick.ts");

import { util } from "./Util";

//todo-0: need to rename this class, it's no longer about "clicks" but is more general
class BindClick {
    /* Binds DOM IDs to functions that should be called on "onClick" */
    private idToOnClickMap: { [key: string]: Function } = {};
    private idToKeyPressMap: { [key: string]: Function } = {};

    constructor() {
        /* I bet there's a better way to subscribe to DOM events than this timer, but i'm using the timer for now */
        setInterval(function() {
            if (bindClick) {
                bindClick.interval();
            }
        }, 500);
    }

    private interval = (): void => {
        for (let id in this.idToOnClickMap) {
            if (this.idToOnClickMap.hasOwnProperty(id)) {
                let e = util.domElm(id);
                if (e) {
                    (<any>e).onclick = this.idToOnClickMap[id];

                    /* i'm just goint to try and see if this creates a concurrent-modification exception during looping or not */
                    delete this.idToOnClickMap[id];
                }
            }
        }

        for (let id in this.idToKeyPressMap) {
            if (this.idToKeyPressMap.hasOwnProperty(id)) {
                let e = util.domElm(id);
                if (e) {
                    (<any>e).onkeypress = this.idToKeyPressMap[id];

                    /* i'm just goint to try and see if this creates a concurrent-modification exception during looping or not */
                    delete this.idToKeyPressMap[id];
                }
            }
        }
    }

    public addOnClick(domId: string, callback: Function) {
        this.idToOnClickMap[domId] = callback;
    }

    public addKeyPress(domId: string, callback: Function) {
        this.idToKeyPressMap[domId] = callback;
    }
}

export let bindClick: BindClick = new BindClick();
export default bindClick;
