import * as I from "../Interfaces";
export declare class RssPlugin {
    init: () => void;
    renderFeedNode: (node: I.NodeInfo, rowStyling: boolean) => string;
    renderItemNode: (node: I.NodeInfo, rowStyling: boolean) => string;
    propOrderingFeedNode: (node: I.NodeInfo, properties: I.PropertyInfo[]) => I.PropertyInfo[];
    propOrderingItemNode: (node: I.NodeInfo, properties: I.PropertyInfo[]) => I.PropertyInfo[];
}
