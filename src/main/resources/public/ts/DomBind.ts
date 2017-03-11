console.log("DomBind.ts");

import { util } from "./Util";

/*
This allows us to wire a function to a particular Element by its ID even long BEFORE the ID itself comes into existence
on the DOM! This allows us to set things up before they get rendered! Very powerful concept for 'temporal decoupling'. In Fact
the word I'd used to describe this innovation/technique would indeed be "Temporal Decoupling"
*/
class DomBind {
    private counter: number = 0;

    /* Binds DOM IDs to functions that should be called on "onClick" */
    private idToFuncMap: { [key: string]: Function } = {};

    constructor() {
        /* I bet there's a better way to subscribe to DOM events than this timer, but i'm using the timer for now */
        setInterval(() => {
            if (domBind) {
                domBind.interval();
            }
        }, 500);
    }

    private interval = (): void => {
        /* The loop below may have multiple entries targeting the same element, so just to avoid as many DOM operations
        as possible (for performance) we cache them in this map once we find them */
        let idToElmMap: { [key: string]: HTMLElement } = {};

        util.forEachProp(this.idToFuncMap, (key: string, func: Function): boolean => {
            let id = util.chopAtLastChar(key, ".");

            //first try to get from map.
            let e = idToElmMap[id];

            //if not in map look on DOM itself
            if (!e) {
                e = util.domElm(id);

                //if we found it, put it in map
                if (e) {
                    idToElmMap[id] = e;
                }
            }

            if (e) {
                //console.log("DomBind " + id + " FOUND.");
                this.idToFuncMap[key](e);
                delete this.idToFuncMap[key];
            }
            else {
                console.log("DomBind " + id + " waiting...");
            }
            return true;
        });
    }

    public addOnClick(domId: string, callback: Function) {
        this.idToFuncMap[domId + ".onclick"] = (e) => { (<any>e).onclick = callback; };
    }

    public addKeyPress(domId: string, callback: Function) {
        this.idToFuncMap[domId + ".keypress"] = (e) => { (<any>e).onkeypress = callback; };
    }

    public addOnChange(domId: string, callback: Function) {
        this.idToFuncMap[domId + ".onchange"] = (e) => { (<any>e).onchange = callback; };
    }

    public whenElm(domId: string, callback: Function) {

        /* First try to find the domId immediately and if found run the function */
        let e = util.domElm(domId);
        if (e) {
            callback(e);
            return;
        }

        /* Otherwise we setup into the timer loop, to process whenever the element comes into existence */
        this.idToFuncMap[domId + ".whenElm" + (++this.counter)] = callback;
    }
}

export let domBind: DomBind = new DomBind();
export default domBind;
