console.log("Heading.ts");

import { Comp } from "./base/Comp";

declare var tag;

export class Heading extends Comp {

    constructor(public level: number, public content: string) {
        super(null);
    }

    renderHtml = (): string => {
        return tag.heading(this.level, this.content);
    }
}
