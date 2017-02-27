console.log("Comp.ts");

import { util } from "../../Util";

export abstract class Comp {
    static guid: number = 0;
    static idToCompMap: { [key: string]: Comp } = {};
    attribs: Object;
    children: Comp[];

    constructor(attribs: Object) {
        this.attribs = attribs || {};
        this.children = [];
        let id = "Comp_" + (++Comp.guid);
        (<any>this.attribs).id = id;

        //This map allows us to lookup the Comp directly by its ID similar to a DOM lookup
        Comp.idToCompMap[id] = this;
    }

    static findById(id: string): Comp {
        return Comp.idToCompMap[id];
    }

    getId(): string {
        return (<any>this.attribs).id;
    }

    getElement = (): HTMLElement => {
        return <HTMLElement>document.querySelector("#" + this.getId());
    }

    setVisible(visible: boolean) {
        let elm = this.getElement();
        if (elm) {
            util.setElmDisplay(elm, visible);
        }
    }

    renderToDom(): void {
        let elm = this.getElement();
        if (elm) {
            elm.innerHTML = this.render();
        }
    }

    setInnerHTML(html: string) {
        let elm = this.getElement();
        if (elm) {
            elm.innerHTML = html;
        }
    }

    addChild(comp: Comp): void {
        this.children.push(comp);
    }

    addChildren(comps: Comp[]): void {
        this.children.push.apply(this.children, comps);
    }

    setChildren(comps: Comp[]) {
        this.children = comps;
    }

    renderChildren(): string {
        let html = "";
        util.forEachArrElm(this.children, function(child, idx) {
            html += child.render();
        });
        return html;
    }

    render(): string {
        return this.renderChildren();
    }
}
