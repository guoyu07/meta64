console.log("Comp.ts");

import { util } from "../Util";

export abstract class Comp {
    static guid: number = 0;
    attribs: Object;
    children: Comp[];

    constructor(attribs: Object) {
        this.attribs = attribs || {};
        (<any>this.attribs).id = "Comp_" + (++Comp.guid);
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

    addChild(comp: Comp): void {
        this.children.push(comp);
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

    abstract render(): string;
}
