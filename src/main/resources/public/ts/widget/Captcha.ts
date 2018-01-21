console.log("Captcha.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class Captcha extends Comp {

    constructor() {
        super(null);
        this.setClass("captcha");
    }

    setSrc(src: string) {
        S.domBind.whenElm(this.getId(), (elm) => {
            elm.setAttribute("src", src);
        });
    }

    renderHtml = (): string => {
        return S.tag.img(this.attribs);
    }
}
