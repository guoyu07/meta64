console.log("DomBind.ts");

import { util } from "./Util";

/*
This allows us to wire a function to a particular Element by its ID even long BEFORE the ID itself comes into existence
on the DOM! This allows us to set things up before they get rendered! Very powerful concept for 'temporal decoupling'. In Fact
the word I'd used to describe this innovation/technique would indeed be "Temporal Decoupling"
*/
class DomBind {
    /* Binds DOM IDs to functions that should be called on "onClick" */
    private idToFuncMap: { [key: string]: Function } = {};

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
        util.forEachProp(this.idToFuncMap, function(key: string, func: Function): boolean {
            let id = util.chopAtLastChar(key, ".");
            let e = util.domElm(id);

            //todo-1: An optimization that could be done here is that once we find an element we are looking for, we could run all
            //the functions that are mapped onto it because there can be multiple of these in idToFuncMap that are for this DOM id, but
            //this will not be all that common, and at this time not worth adding that compleity to the code quite yet. KISS for now.
            if (e) {
                //console.log("DomBind " + id + " FOUND.");
                thiz.idToFuncMap[key](e);
                delete thiz.idToFuncMap[key];
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
}

export let domBind: DomBind = new DomBind();
export default domBind;
