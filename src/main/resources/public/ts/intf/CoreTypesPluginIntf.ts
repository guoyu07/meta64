console.log("CoreTypesPluginIntf.ts");

import * as I from "../Interfaces";

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, props, render;

export interface CoreTypesPluginIntf {

    init();

    renderFolderNode(node: I.NodeInfo, rowStyling: boolean): string ;
}
