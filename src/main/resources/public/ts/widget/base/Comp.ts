console.log("Comp.ts");

import { util } from "../../Util";
import { domBind } from "../../DomBind";

export abstract class Comp {

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

    constructor(attribs: Object) {
        this.attribs = attribs || {};
        this.children = [];
        let id = "c" + Comp.nextGuid();
        (<any>this.attribs).id = id;

        //This map allows us to lookup the Comp directly by its ID similar to a DOM lookup
        Comp.idToCompMap[id] = this;
    }

    /* Function refreshes all enablement and visibility based on current state of app */
    refreshState(): void {
        //todo-0: need to make this the smart routine which does a minimal-only DOM update on the dom tree branches, but first
        //simply to prove working we do just brute force updating here.
        //todo-0: future optimization. For components that don't implement any enablement/visibilty functions, we need can
        //just only do this enablement stuff ONCE and then not do it again on that same element.
        this.updateState();
        this.setVisible(this.visible);
        this.setEnabled(this.enabled);

        //recursively drill down and do entire tree. For efficiency I need to modify this to be 'breadth' first?
        //let visibleChildrenCount = 0;
        util.forEachArrElm(this.children, function(child, idx) {
            if (child) {
                child.refreshState();
                // if (child.visible) {
                //     visibleChildrenCount++;
                // }
            }
        });
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

        util.forEachArrElm(this.children, function(child, idx) {
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

    //todo-0: oops this methid is a dupliate of setVisible() delete it.
    setDisplay = (showing: boolean): void => {
        domBind.whenElm(this.getId(), (elm) => {
            util.setElmDisplay(elm, showing);
        });
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

    // createElement(): HTMLElement {
    //     document.createElement("paper-dialog");
    // }

    /* If caller happens to have this element it can be passed, to avoid one DOM lookup */
    renderToDom = (elm?: HTMLElement): void => {
        if (this.renderPending) return;

        /* To be synchronous where possible we go ahead and check to see if the
        element exists right now, and if so we render and don't rely on domBind async */
        elm = elm || this.getElement();
        if (elm) {
            elm.innerHTML = this.render();
            return;
        }

        this.renderPending = true;
        domBind.whenElm(this.getId(), (elm) => {
            elm.innerHTML = this.render();
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
        let html = "";
        util.forEachArrElm(this.children, function(child, idx) {
            if (child) {
                let childRender = child.render();
                if (childRender) {
                    html += childRender;
                }
            }
        });
        return html;
    }

    render = (): string => {
        return this.renderChildren();
    }
}
