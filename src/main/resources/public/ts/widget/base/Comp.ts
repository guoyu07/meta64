/// <reference path="../../types.d.ts" />

console.log("Comp.ts");

import { util } from "../../Util";
import { domBind } from "../../DomBind";
import { tag } from "../../Tag";
import React from "react";
import ReactDOM from "react-dom";

/* 
Right now this component base class is a hybrid which can function EITHER as my TypeScript Widget Component
(*which works more like the JavaSwing paradigm, where you do not use ANY HTML/JSX) OR as a ReactJS.

I did this as a proof of concept for testing out ReactJS and also to provide a seamless upgrade path so that 
i can translate as much or as little of the TypeScript Widgets to ReactJS as I want.

UPDATE: Actually the way my non-react components work is by concatenating text of rendered HTML together by calling
getChildren/renderChildren resursively, and I think what i should experiment with next is how to keep the same approach
of having a 'children' array and recursively processing them but what I can do is during rendering do the
equivalent ReactJS call to concatenate elements, and in this way maintain precisely the same way of defining
components that I currently have where I build up a large "Component Graph". In other words the code here
pre-react was already a general "Component Graph", so there is no reason that we can't simply write code that
uses React.createElement() calls manually to construct a root object, rooted at whatever place our object graph
detects a react element, and in this way only the minimum number of  ReactDOM.render() calls will be made AND the current
way our code looks (with my own Component Graph exactly looking as it looked pre-react, still will work). Another way 
to say this is that the 'consumer code' that is using my "components" will not even know or care of ReactJS is 
being used or not. This means I have completely "abstracted out" the framework itself. We could plug vue.js 
underneath and it would still all work!!! So the truely 'novel' thing about the SubNode architecture is that 
it is completely independent of any framework yet IS using any framework, and in a CLEAN way.

And to sum it up: The SubNode Widget Architecture is an Abstraction Layer on top of the Framework Layer
*/
export abstract class Comp extends React.Component {

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
        let id = "c" + Comp.nextGuid();
        (<any>this.attribs).id = id;

        //This map allows us to lookup the Comp directly by its ID similar to a DOM lookup
        Comp.idToCompMap[id] = this;

        /* If this is a react component, we render it onto the element once we have the element, and what is always going on 
        here is that we render an empty div using our normal pipeline of rendering, and then the div gets
        populated by the react render once it already exists.
        */
        //delaying this to be supported using 'reactiveRender()' pipeline instead.
        // if (isReact) {
        //     this.whenElm(() => {
        //         ReactDOM.render(this.getJsx(), document.getElementById(this.getId()));
        //     });
        // }
    }

    /* Function refreshes all enablement and visibility based on current state of app */
    refreshState(): void {
        //todo-1: Eventually we will make this a smart routine which does a minimal-only DOM update on the dom tree branches, but first, for now
        //simply to prove all the code is working we do just brute force updating here.
        //todo-1: future optimization. For components that don't implement any enablement/visibilty functions, we can
        //just only do this enablement stuff ONCE and then not do it again on that same element.
        this.updateState();
        this.setVisible(this.visible);
        this.setEnabled(this.enabled);

        //recursively drill down and do entire tree. For efficiency I need to modify this to be 'breadth' first?
        //let visibleChildrenCount = 0;
        util.forEachArrElm(this.children, function (child, idx) {
            if (child) {
                child.refreshState();
                // if (child.visible) {
                //     visibleChildrenCount++;
                // }
            }
        });
    }

    setDomAttr = (attrName: string, attrVal: string) => {
        this.whenElm((elm) => {
            elm.setAttribute(attrName, attrVal);
            this.attribs[attrName] = attrVal;
        });
    }

    bindOnClick = (callback: Function) => {
        domBind.addOnClick(this.getId(), callback);
    }

    setIsEnabledFunc(isEnabledFunc: Function) {
        this.isEnabledFunc = isEnabledFunc;
    }

    setIsVisibleFunc(isVisibleFunc: Function) {
        this.isVisibleFunc = isVisibleFunc;
    }

    /* returns true if anything was done. Should I eventually make this return true if something CHAGNED ? */
    updateState(): boolean {
        let ret = false;

        if (this.isEnabledFunc) {
            this.enabled = this.isEnabledFunc();
            ret = true;
        }

        if (this.isVisibleFunc) {
            this.visible = this.isVisibleFunc();
            ret = true;
        }
        return ret;
    }

    /* Certain components decide if they are visible based on if any children are visible so we encapsulated that logic into here */
    setVisibleIfAnyChildrenVisible() {
        let thisVisible = false;

        util.forEachArrElm(this.children, function (child, idx) {
            if (child) {
                /* if we found a visible child, we can set visible to true, and end this forEach iteration, because we don't need any
                more info. We're done. It's gonna be visible */
                if (child.visible) {
                    thisVisible = true;
                    return false;
                }
            }
        });

        this.setVisible(thisVisible);
    }

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
        domBind.whenElm(this.getId(), func);
    }

    /* WARNING: this is NOT a setter for 'this.visible'. Perhaps i need to rename it for better clarity, it takes
    this.visible as its input sometimes. Slightly confusing */
    setVisible = (visible: boolean) => {
        domBind.whenElm(this.getId(), (elm) => {
            util.setElmDisplay(elm, visible);
        });
    }

    /* WARNING: this is NOT the setter for 'this.enabled' */
    setEnabled = (enabled: boolean) => {
        domBind.whenElm(this.getId(), (elm) => {
            (<any>elm).disabled = !enabled;
        });
    }

    setClass = (clazz: string): void => {
        (<any>this.attribs).class = clazz;
    }

    setOnClick = (onclick: Function): void => {
        (<any>this.attribs).onclick = onclick;
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
        domBind.whenElm(this.getId(), (elm) => {
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
        domBind.whenElm(this.getId(), (elm) => {
            elm.innerHTML = this.renderChildren();
            this.renderPending = false;
        });
    }

    setInnerHTML = (html: string) => {
        domBind.whenElm(this.getId(), (elm) => {
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
        util.forEachArrElm(this.children, function (child : Comp, idx) {
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
        let ret : React.ReactNode[] = [];

        //todo-1: use a mapper ('array.map(x=>{})') to perform this transformation 
        util.forEachArrElm(this.children, function (child : Comp, idx) {
            if (child) {
                ret.push(child.reactRender());
            }
        });
        return ret;
    }

    reactRender = (): any /* React.DetailedReactHTMLElement???? */ => {
        return null;
    }

    //Reactive Components need to override this, to control the rendering.
    // getJsx = (): JSX.Element => {
    //     return null;
    // }

    renderHtml = (): string => {
        if (this.isReact) {
            this.whenElm(() => {
                //ReactDOM.render(this.getJsx(), document.getElementById(this.getId()));
                ReactDOM.render(this.reactRender(), document.getElementById(this.getId()));
            });
        
            return tag.div(this.attribs, "");
        }
        else {
            return this.renderChildren();
        }
    }
}
