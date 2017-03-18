console.log("CoreTypesPlugin.ts");

import { meta64 } from "../Meta64";
import * as I from "../Interfaces";
import { util } from "../Util";
import { props } from "../Props";
import { render } from "../Render";
import { tag } from "../Tag";

class CoreTypesPlugin {

    init = () => {
        meta64.addTypeHandlers("meta64:folder", coreTypesPlugin.renderFolderNode, null);
    }

    renderFolderNode = (node: I.NodeInfo, rowStyling: boolean): string => {
        let ret: string = "";
        let name: I.PropertyInfo = props.getNodeProperty("meta64:name", node);

        if (name) {
            ret += render.tag("h2", {"style" : "margin-left: 15px;"
            }, name.value);
        }

        return ret;
    }
}

export let coreTypesPlugin: CoreTypesPlugin = new CoreTypesPlugin();
export default coreTypesPlugin;
