console.log("Div.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";

export class Heading extends Comp {

    constructor(public level: number, public content: string) {
        super(null);
    }

    renderHtml = (): string => {
        return tag.heading(this.level, this.content);
    }
}
