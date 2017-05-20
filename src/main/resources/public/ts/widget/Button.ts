console.log("Button.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { util } from "../Util";
import { DialogBase } from "../DialogBase";

export class Button extends Comp {

    constructor(public text: string, public callback: Function, _attribs: Object = null, public isDlgCloser: boolean = false, //
        public dlg: DialogBase = null, initiallyVisible = true, public delayCloseCallback: number = 0) {
        super(_attribs);
        util.mergeProps(this.attribs, {
            "raised": "raised",
            "class": "standardButton"
        });

        if (!initiallyVisible) {
            (<any>this.attribs).style = "display:none;"
        }

        (<any>this.attribs).onclick = () => {
            if (this.callback) {
                this.callback();
            }

            if (this.isDlgCloser) {
                setTimeout(() => {
                    this.dlg.cancel.bind(this.dlg)();
                }, this.delayCloseCallback);
            }
        };
    }

    render = (): string => {
        return tag.button(this.attribs, this.text);
    }
}
