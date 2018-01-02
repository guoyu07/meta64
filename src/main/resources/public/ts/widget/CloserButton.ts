console.log("CloserButton.ts");

import { Comp } from "./base/Comp";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag;

/* General Widget that doesn't fit any more reusable or specific category other than a plain Div, but inherits capability of Comp class */
export class CloserButton extends Comp {

    constructor() {
        super(null);
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return tag.button({
            class: "close",
            "data-dismiss":
                "modal", "aria-label": "Close"
        },
            tag.span({ "aria-hidden": "true" }, "&times;"));
    }
}
