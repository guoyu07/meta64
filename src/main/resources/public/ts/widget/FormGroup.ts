console.log("FormGroup.ts");

import { Comp } from "./base/Comp";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag;

export class FormGroup extends Comp {

    constructor(attribs: Object = null, initialChildren: Comp[] = null) {
        super(attribs);
        (<any>this.attribs).class = "form-group";
        this.setChildren(initialChildren);
    }

    renderHtml = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
