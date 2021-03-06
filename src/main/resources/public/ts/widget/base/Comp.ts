console.log("Comp.ts");

/// <reference path="/node_moduels/@tyeps/jquery/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { CompImpl } from "./CompImpl";
import { PubSub } from "../../PubSub";
import { Constants } from "../../Constants";
import { Singletons } from "../../Singletons";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export abstract class Comp extends React.Component implements CompImpl {

    private static guid: number = 0;

    static idToCompMap: { [key: string]: Comp } = {};
    attribs: Object;

    /* Note: NULL elements are allowed in this array and simply don't render anything, and are required to be tolerated and ignored */
    children: Comp[];

    /* State tells us if the widget is currently about to re-render itself as soon as it can */
    renderPending: boolean = false;

    /* These are primarily used by Buttons and MenuItems based on enablement updater */
    enabled: boolean = true;
    visible: boolean = true;

    isEnabledFunc: Function;
    isVisibleFunc: Function;

    constructor(attribs: Object, private isReact: boolean = false) {
        super({});
        this.attribs = attribs || {};
        this.children = [];

        /* If an ID was specifically provided, then use it, or else generate one */
        let id = (<any>this.attribs).id || "c" + Comp.nextGuid();
        (<any>this.attribs).id = id;

        //This map allows us to lookup the Comp directly by its ID similar to a DOM lookup
        Comp.idToCompMap[id] = this;

        PubSub.sub(Constants.PUBSUB_RefreshEnablement, (unused: Object) => {
            this.whenElm((elm) => {
                //console.log("PubSub driven refreshState: on ID=" + this.getId());
                this.refreshState();
            });
        });
    }

    /* Function refreshes all enablement and visibility based on current state of app */
    refreshState(): void {
        //todo-1: Eventually we will make this a smart routine which does a minimal-only DOM update on the dom tree branches, but first, for now
        //simply to prove all the code is working we do just brute force updating here.
        //todo-1: future optimization. For components that don't implement any enablement/visibilty functions, we can
        //just only do this enablement stuff ONCE and then not do it again on that same element.
        this.updateState();
        //this.setVisible(this.visible); //<----- this wreaks havoc on the menu collapsing logic...trying without for now.
        this.setEnabled(this.enabled);
        //console.log("refreshState: id=" + this.getId() + " enabled=" + this.enabled);

        // //NOTE: I decided to use PubSub to broadcast an event to all Components, so this code is no longer needed.
        // // //recursively drill down and do entire tree. For efficiency I need to modify this to be 'breadth' first?
        // // //let visibleChildrenCount = 0;
        // util.forEachArrElm(this.children, function (child, idx) {
        //     if (child) {
        //         child.refreshState();
        //         if (child.visible) {
        //             visibleChildrenCount++;
        //         }
        //     }
        // });
    }

    setDomAttr = (attrName: string, attrVal: string) => {
        this.whenElm((elm) => {
            elm.setAttribute(attrName, attrVal);
            this.attribs[attrName] = attrVal;
        });
    }

    bindOnClick = (callback: Function) => {
        /* We must manually check if function is enabled before we call the button click for it. Polymer did this for us but
        in bootstrap this is our responsibility */
        S.domBind.addOnClick(this.getId(), () => {
            if (!this.isEnabledFunc || this.isEnabledFunc()) {
                callback();
            }
        });
    }

    setIsEnabledFunc = (isEnabledFunc: Function) => {
        this.isEnabledFunc = isEnabledFunc;
    }

    setIsVisibleFunc = (isVisibleFunc: Function) => {
        this.isVisibleFunc = isVisibleFunc;
    }

    /* returns true if anything was done. Should I eventually make this return true if something CHAGNED ? */
    updateState = (): boolean => {
        let ret = false;

        if (this.isEnabledFunc) {
            this.enabled = this.isEnabledFunc();
            //console.log("in updateState: id=" + this.getId() + " enablement function said: " + this.enabled);
            ret = true;
        }
        else {
            //console.log("in updateState: id=" + this.getId() + " has no ENABLEMENT function");
        }

        if (this.isVisibleFunc) {
            this.visible = this.isVisibleFunc();
            ret = true;
        }
        return ret;
    }

    // /* Certain components decide if they are visible based on if any children are visible so we encapsulated that logic into here */
    // setVisibleIfAnyChildrenVisible() {
    //     let thisVisible = false;
    //     util.forEachArrElm(this.children, function (child, idx) {
    //         if (child) {
    //             /* if we found a visible child, we can set visible to true, and end this forEach iteration, because we don't need any
    //             more info. We're done. It's gonna be visible */
    //             if (child.visible) {
    //                 thisVisible = true;
    //                 return false;
    //             }
    //         }
    //     });

    //     this.setVisible(thisVisible);
    // }

    static nextGuid(): number {
        return ++Comp.guid;
    }

    static findById(id: string): Comp {
        return Comp.idToCompMap[id];
    }

    removeAllChildren = (): void => {
        this.children = [];
    }

    getId = (): string => {
        return (<any>this.attribs).id;
    }

    /* Warning: Under lots of circumstances it's better to call domBind.whenElm rather than getElement() because getElement returns
    null unless the element is already created and rendered onto the DOM */
    getElement = (): HTMLElement => {
        return <HTMLElement>document.querySelector("#" + this.getId());
    }

    whenElm = (func: Function) => {
        S.domBind.whenElm(this.getId(), func);
    }

    /* WARNING: this is NOT a setter for 'this.visible'. Perhaps i need to rename it for better clarity, it takes
    this.visible as its input sometimes. Slightly confusing */
    setVisible = (visible: boolean) => {
        S.domBind.whenElm(this.getId(), (elm) => {
            S.util.setElmDisplay(elm, visible);
        });
    }

    /* WARNING: this is NOT the setter for 'this.enabled' */
    setEnabled = (enabled: boolean) => {
        S.domBind.whenElm(this.getId(), (elm) => {
            (<any>elm).disabled = !enabled;
            $(elm).prop('disabled', !enabled);

            if (!enabled) {
                $(elm).addClass("disabled");
            }
            else {
                $(elm).removeClass("disabled");
            }
        });
    }

    setClass = (clazz: string): void => {
        (<any>this.attribs).class = clazz;
    }

    setOnClick = (onclick: Function): void => {
        (<any>this.attribs).onclick = () => {
            if (!this.isEnabledFunc || this.isEnabledFunc()) {
                onclick();
            }
        };
    }

    /* If caller happens to have this element it can be passed, to avoid one DOM lookup */
    renderToDom = (elm?: HTMLElement): void => {
        if (this.renderPending) return;

        /* To be synchronous where possible we go ahead and check to see if the
        element exists right now, and if so we render and don't rely on domBind async */
        elm = elm || this.getElement();
        if (elm) {
            elm.innerHTML = this.renderHtml();
            return;
        }

        this.renderPending = true;
        S.domBind.whenElm(this.getId(), (elm) => {
            elm.innerHTML = this.renderHtml();
            this.renderPending = false;
        });
    }

    renderChildrenToDom = (elm?: HTMLElement): void => {
        if (this.renderPending) return;

        /* To be synchronous where possible we go ahead and check to see if the
        element exists right now, and if so we render and don't rely on domBind async */
        elm = elm || this.getElement();
        if (elm) {
            elm.innerHTML = this.renderChildren();
            return;
        }

        this.renderPending = true;
        S.domBind.whenElm(this.getId(), (elm) => {
            elm.innerHTML = this.renderChildren();
            this.renderPending = false;
        });
    }

    setInnerHTML = (html: string) => {
        S.domBind.whenElm(this.getId(), (elm) => {
            elm.innerHTML = html;
        });
    }

    addChild = (comp: Comp): void => {
        this.children.push(comp);
    }

    addChildren = (comps: Comp[]): void => {
        this.children.push.apply(this.children, comps);
    }

    setChildren = (comps: Comp[]) => {
        this.children = comps || [];
    }

    renderChildren = (): string => {
        if (this.isReact) {
            throw "Don't call renderChildren on react component. Call reactRenderChildren instead.";
        }
        let html = "";
        S.util.forEachArrElm(this.children, function (child: Comp, idx) {
            if (child) {
                let childRender = child.renderHtml();
                if (childRender) {
                    html += childRender;
                }
            }
        });
        return html;
    }

    reactRenderChildren = (): React.ReactNode[] => {
        if (!this.isReact) {
            throw "Don't call reactRenderChildren on react component. Call renderChildren instead.";
        }
        let ret: React.ReactNode[] = [];

        //todo-1: use a mapper ('array.map(x=>{})') to perform this transformation 
        S.util.forEachArrElm(this.children, function (child: Comp, idx) {
            if (child) {
                ret.push(child.reactRender());
            }
        });
        return ret;
    }

    reactRender = (): any /* React.DetailedReactHTMLElement???? */ => {
        return null;
    }

    /* This returns an empty DIV that will have ReactJS content rendered into it if 'isReact' is true. This is only 
    a clean approach, because we have a rule that our TSWidgets (non-react compoents) are allowed to contain React elements, 
    but React elements are NOT allowed to contain non-react elements. This works fine for my purposes, because I know that any 
    React elements i have will be PURE react */
    renderHtml = (): string => {
        if (this.isReact) {
            this.whenElm(() => {
                ReactDOM.render(this.reactRender(), document.getElementById(this.getId()));
            });

            return S.tag.div(this.attribs, "");
        }
        else {
            return this.renderChildren();
        }
    }
}
