console.log("ButtonRe.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

/* React version of Button class */
export class ButtonRe extends Comp {

    constructor(public text: string, public callback: Function, _attribs: Object = null, public isDlgCloser: boolean = false, //
        public dlg: DialogBase = null, initiallyVisible = true, public delayCloseCallback: number = 0) {
        super(_attribs, true);
        S.util.mergeProps(this.attribs, {
            "raised": "raised",
            "class": "standardButton"
        });

        if (!initiallyVisible) {
            (this.attribs as any).style = "display:none;"
        }

        (this.attribs as any).onClick = () => {

            /* This timer, is so that if perhaps the 'callback' is going to result in
            another dialog being opened, we can reduce screen 'flicker' by having a delayCloseCallback of like 1500 millis
            and this will make the new dialog able to pop over the top of the one we are about to close here,
            and the effect is much smoother and you never see the previous dialog disappear a millisecond before thw
            new dialog opens, which is annoying, and nice to not have to see
            */
            if (this.isDlgCloser) {
                setTimeout(() => {
                    this.dlg.cancel.bind(this.dlg)();
                }, this.delayCloseCallback);
            }

            if (this.callback) {
                this.callback();
            }
        };
    }

    reactRender = () => {
        (this.attribs as any).className = (this.attribs as any).class;
        let tagName = (this.attribs as any).icon ? "paper-icon-button" : "paper-button";
        return React.createElement(tagName, this.attribs, this.text);
    }
}
