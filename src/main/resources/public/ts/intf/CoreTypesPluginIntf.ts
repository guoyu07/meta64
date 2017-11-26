console.log("CoreTypesPluginIntf.ts");

import * as I from "../Interfaces";

export interface CoreTypesPluginIntf {
    init();
    renderFolderNode(node: I.NodeInfo, rowStyling: boolean): string;
}
