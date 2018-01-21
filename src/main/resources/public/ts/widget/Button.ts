console.log("Button.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class Button extends Comp {

    constructor(public text: string, public callback: Function, _attribs: Object = null, public isDlgCloser: boolean = false, //
        public dlg: DialogBase = null, initiallyVisible = true, public delayCloseCallback: number = 0) {
        super(_attribs);
        S.util.mergeProps(this.attribs, {
            "class": "btn btn-primary", /* also: secondary, info, success, danger, warning */
            "type": "button"
        });

        if (!initiallyVisible) {
            (<any>this.attribs).style = "display:none;"
        }

        (<any>this.attribs).onclick = () => {

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

    renderHtml = (): string => {
        let iElm;
        if ((<any>this).attribs.iconClass) {
           // <i className="fa fa-home fa-lg"/>
           iElm = S.tag.i({class: (<any>this).attribs.iconClass});
        }
        let content = this.text ? this.text : "";
        if (iElm) {
            content = iElm + content;
        }
        return S.tag.button(this.attribs, content);
    }
}
