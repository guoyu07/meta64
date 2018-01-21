console.log("Checkbox.ts");

/// <reference path="/node_moduels/@tyeps/jquery/index.d.ts" />

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { Singletons } from "../Singletons";
import { Constants } from "../Constants";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class Checkbox extends Comp {

    constructor(private label: string = null, checked: boolean = false, _attribs: Object = null) {
        super(_attribs);
        if (checked) {
            (<any>this.attribs).checked = "checked";
            this.setChecked(true);
        }
        (<any>this.attribs).type = "checkbox";
    }

    setChecked(checked: boolean) {
        S.domBind.whenElm(/*"cci" + */this.getId(), (elm) => {
            (<any>elm).checked = checked;
        });
    }

    getChecked(): boolean {
        let elm: HTMLElement = S.util.domElm(/* "cci" + */this.getId());
        return elm && (<any>elm).checked;
    }

    renderHtml = (): string => {

        /* If we have an onclick provided, then wait for element to exist, and then setup the change listener on it as this same function */
        if ((<any>this.attribs).onclick) {
            S.domBind.whenElm(/*"cci" + */ this.getId(), (elm) => {
                $(/*"#cci" + */this.getId()).change((<any>this.attribs).onclick);
            });
        }

        let ret = S.tag.input(this.attribs);
        if (this.label) {
            ret += S.tag.label(this.label, { "for": this.getId() });
        }
        return ret;

        // /* If we have an onclick provided, then wait for element to exist, and then setup the change listener on it as this same function */
        // if ((<any>this.attribs).onclick) {
        //     domBind.whenElm("cci" + this.getId(), (elm) => {
        //         $("#cci" + this.getId()).change((<any>this.attribs).onclick);
        //     });
        // }

        // return tag.label(
        //     tag.input({ /* onclick: (<any>this.attribs).onclick,*/ type: "checkbox", class: "custom-control-input", id: "cci" + this.getId() }) +
        //     tag.span({ class: "custom-control-indicator" }, "Sel") +
        //     (this.label ? tag.span({ class: "custom-control-description" }, this.label) : "Sel2"),
        //     { class: "custom-control custom-checkbox", style: "margin-left: 1rem;" });
    }
}
