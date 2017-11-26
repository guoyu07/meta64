console.log("Header.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag;

export class Header extends Comp {

    constructor(public text: string, centered:boolean = false) {
        super(null);
        (<any>this.attribs).class = (centered ? "horizontal center-justified layout" : "") + " dialog-header";
    }

    renderHtml = (): string => {
        return tag.div(this.attribs, this.text);
    }
}
