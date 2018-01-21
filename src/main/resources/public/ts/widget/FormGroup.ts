console.log("FormGroup.ts");

import { Comp } from "./base/Comp";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class FormGroup extends Comp {

    constructor(attribs: Object = null, initialChildren: Comp[] = null) {
        super(attribs);
        (<any>this.attribs).class = "form-group";
        this.setChildren(initialChildren);
    }

    renderHtml = (): string => {
        return S.tag.div(this.attribs, this.renderChildren());
    }
}
