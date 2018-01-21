console.log("Form.ts");

import { Comp } from "./base/Comp";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class Form extends Comp {

    constructor(attribs : Object, initialChildren: Comp[] = null) {
        super(attribs);
        this.setChildren(initialChildren);
    }

    renderHtml = (): string => {
        return S.tag.form(this.attribs, this.renderChildren());
    }
}
