console.log("EditPropsTable.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag;

export class EditPrivsTable extends Comp {

    constructor(public content: string = "", attribs : Object = {}) {
        super(attribs);
        let width = window.innerWidth * 0.6;
        let height = window.innerHeight * 0.4;
        (<any>this.attribs).style = `width:${width}px;height:${height}px;overflow:scroll;border:4px solid lightGray;`;
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
