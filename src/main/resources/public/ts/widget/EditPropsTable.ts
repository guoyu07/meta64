console.log("EditPropsTable.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class EditPropsTable extends Comp {

    constructor(public content: string = "", attribs : Object = {}) {
        super(attribs);
        //(<any>this.attribs).style = "display:table; width:100%;";
        //(<any>this.attribs).sourceClass = "EditPropsTable";
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return S.tag.div(this.attribs, this.renderChildren());
    }
}
