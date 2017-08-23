console.log("Div.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { util } from "../Util";

export class Anchor extends Comp {

    constructor(public url: string, public content: string, _attribs: Object = null) {
        super({ href: url });
        util.mergeProps(this.attribs, _attribs);
    }

    render = (): string => {
        return tag.a(this.attribs, this.content || this.url);
    }
}
