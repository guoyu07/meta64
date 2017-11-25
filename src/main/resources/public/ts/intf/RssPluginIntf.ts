console.log("RssPluginIntf.ts");

import * as I from "../Interfaces";

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, util, props, render, tag, podcast;

export interface RssPluginIntf {

    init ();

    renderFeedNode (node: I.NodeInfo, rowStyling: boolean): string ;
    renderItemNode (node: I.NodeInfo, rowStyling: boolean): string ;
    propOrderingFeedNode (node: I.NodeInfo, properties: I.PropertyInfo[]): I.PropertyInfo[] ;

    propOrderingItemNode (node: I.NodeInfo, properties: I.PropertyInfo[]): I.PropertyInfo[] ;
}
