console.log("CoreTypesPlugin.ts");

import * as I from "../Interfaces";
import { CoreTypesPluginIntf } from "../intf/CoreTypesPluginIntf";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class CoreTypesPlugin implements CoreTypesPluginIntf {

    init = () => {
        S.meta64.addTypeHandlers("meta64:folder", this.renderFolderNode, null);
    }

    renderFolderNode = (node: I.NodeInfo, rowStyling: boolean): string => {
        let ret: string = "";
        let name: I.PropertyInfo = S.props.getNodeProperty("meta64:name", node);

        if (name) {
            ret += S.render.tag("h2", {
                "style": "margin-left: 15px;"
            }, name.value);
        }

        return ret;
    }
}
