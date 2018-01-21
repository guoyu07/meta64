console.log("Legend.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class Legend extends Comp {

    constructor(public text: string, centered: boolean = false, attribs: Object = null) {
        super(null);
    }

    renderHtml = (): string => {
        return S.tag.legend(this.attribs, this.text);
    }
}
