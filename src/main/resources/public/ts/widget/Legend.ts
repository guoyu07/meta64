console.log("Legend.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag;

export class Legend extends Comp {

    constructor(public text: string, centered: boolean = false, attribs: Object = null) {
        super(null);
    }

    renderHtml = (): string => {
        return tag.legend(this.attribs, this.text);
    }
}
