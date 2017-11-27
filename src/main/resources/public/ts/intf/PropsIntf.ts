console.log("PropsIntf.ts");

import * as I from "../Interfaces";
import { PropTable } from "../widget/PropTable";
import { Button } from "../widget/Button";
import {Singletons} from "../Singletons";

export interface PropsIntf {
    orderProps(propOrder: string[], _props: I.PropertyInfo[]): I.PropertyInfo[];
    moveNodePosition(props: I.PropertyInfo[], idx: number, typeName: string): number;
    propsToggle(): void;
    deletePropertyFromLocalData(propertyName): void;
    getPropertiesInEditingOrder(node: I.NodeInfo, _props: I.PropertyInfo[]): I.PropertyInfo[];
    renderProperties(properties): PropTable;
    decryptToClipboard(val: string, decryptButton: Button): void;
    getNodeProperty(propertyName, node): I.PropertyInfo;
    getNodePropertyVal(propertyName, node): string;
    isNonOwnedNode(node: I.NodeInfo): boolean;
    isNonOwnedCommentNode(node): boolean;
    isOwnedCommentNode(node): boolean;
    renderProperty(property): string;
    renderPropertyValues(values): string;
}
