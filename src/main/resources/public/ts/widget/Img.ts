console.log("Img.ts");

import { Comp } from "./base/Comp";
declare var tag;
export class Img extends Comp {

    constructor(attribs : Object = {}) {
        super(attribs);
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return tag.img(this.attribs);
    }
}
