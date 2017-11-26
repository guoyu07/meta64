console.log("CoreTypesPlugin.ts");

import * as I from "../Interfaces";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, props, render;

export class CoreTypesPlugin {

    init = () => {
        meta64.addTypeHandlers("meta64:folder", this.renderFolderNode, null);
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
