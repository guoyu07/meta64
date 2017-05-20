console.log("Div.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";

export class Anchor extends Comp {

    constructor(public url : string, public content: string) {
        super({href: url});
    }

    render = (): string => {
        return tag.a(this.attribs, this.url);
    }
}
