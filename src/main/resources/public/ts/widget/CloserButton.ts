console.log("CloserButton.ts");

import { Comp } from "./base/Comp";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { DialogImpl } from "./DialogImpl";
import { DialogBaseImpl } from "../DialogBaseImpl";

let S: Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

/* General Widget that doesn't fit any more reusable or specific category other than a plain Div, but inherits capability of Comp class */
export class CloserButton extends Comp {

    constructor(private closeFunc: Function) {
        super(null);
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return S.tag.button({
            class: "close",
            "data-dismiss": "modal", 
            "aria-label": "Close",
            "onclick": this.closeFunc
        },
            S.tag.span({ "aria-hidden": "true" }, "&times;"));
    }
}
