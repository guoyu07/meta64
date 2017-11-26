console.log("RssPluginIntf.ts");

import * as I from "../Interfaces";

export interface RssPluginIntf {
    init ();
    renderFeedNode (node: I.NodeInfo, rowStyling: boolean): string ;
    renderItemNode (node: I.NodeInfo, rowStyling: boolean): string ;
    propOrderingFeedNode (node: I.NodeInfo, properties: I.PropertyInfo[]): I.PropertyInfo[] ;
    propOrderingItemNode (node: I.NodeInfo, properties: I.PropertyInfo[]): I.PropertyInfo[] ;
}
