console.log("Captcha.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";
import { domBind } from "../DomBind";

export class Captcha extends Comp {

    constructor() {
        super(null);
        this.setClass("captcha");
    }

    setSrc(src: string) {
        domBind.whenElm(this.getId(), (elm) => {
            elm.setAttribute("src", src);
        });
    }

    renderHtml = (): string => {
        return tag.img(this.attribs);
    }
}
