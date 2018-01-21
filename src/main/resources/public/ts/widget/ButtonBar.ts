console.log("ButtonBar.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class ButtonBar extends Comp {

    constructor(initialButtons: Comp[] = null, justify: string = "center-justified") {
        super(null);
        (<any>this.attribs).class = "btn-group";
        (<any>this.attribs).role = "group"; //"horizontal " + justify + " layout vertical-layout-row";
        (<any>this.attribs).style = "margin-top: 12px";
        this.setChildren(initialButtons);
    }

    renderHtml = (): string => {
        return S.tag.div(this.attribs, this.renderChildren());
    }
}
