console.log("PropsIntf.ts");

import * as I from "../Interfaces";
import { PropTable } from "../widget/PropTable";
import { Button } from "../widget/Button";
import {Singletons} from "../Singletons";

export interface PropsIntf {
    orderProps(propOrder: string[], _props: I.PropertyInfo[]): I.PropertyInfo[];
    moveNodePosition(props: I.PropertyInfo[], idx: number, typeName: string): number;
    propsToggle(): void;
    deletePropertyFromLocalData(propertyName : string): void;
    getPropertiesInEditingOrder(node: I.NodeInfo, _props: I.PropertyInfo[]): I.PropertyInfo[];
    renderProperties(properties : I.PropertyInfo[]): PropTable;
    decryptToClipboard(val: string, decryptButton: Button): void;
    getNodeProperty(propertyName: string, node: I.NodeInfo): I.PropertyInfo;
    getNodePropertyVal(propertyName : string, node: I.NodeInfo): string;
    isNonOwnedNode(node: I.NodeInfo): boolean;
    isNonOwnedCommentNode(node: I.NodeInfo): boolean;
    isOwnedCommentNode(node: I.NodeInfo): boolean;
    renderProperty(property : I.PropertyInfo): string;
}
