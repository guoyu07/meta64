console.log("Div.ts");

import { Comp } from "./base/Comp";

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag, util;

export class Anchor extends Comp {

    constructor(public url: string, public content: string, _attribs: Object = null) {
        super({ href: url });
        util.mergeProps(this.attribs, _attribs);
    }

    renderHtml = (): string => {
        return tag.a(this.attribs, this.content || this.url);
    }
}
