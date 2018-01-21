console.log("Div.ts");

import { Comp } from "./base/Comp";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class Anchor extends Comp {

    constructor(public url: string, public content: string, _attribs: Object = null) {
        super({ href: url });
        S.util.mergeProps(this.attribs, _attribs);
    }

    renderHtml = (): string => {
        return S.tag.a(this.attribs, this.content || this.url);
    }
}
