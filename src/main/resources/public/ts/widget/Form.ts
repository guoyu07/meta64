console.log("Form.ts");

import { Comp } from "./base/Comp";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag;

export class Form extends Comp {

    constructor(attribs : Object) {
        super(attribs);
    }

    renderHtml = (): string => {
        return tag.form(this.attribs, this.renderChildren());
    }
}
