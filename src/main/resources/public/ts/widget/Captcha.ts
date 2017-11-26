console.log("Captcha.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag, domBind;

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
