import * as I from "./Interfaces";
import { PropTable } from "./widget/PropTable";
import { Button } from "./widget/Button";
export declare class Props {
    postConstruct(_f: any): void;
    orderProps: (propOrder: string[], _props: I.PropertyInfo[]) => I.PropertyInfo[];
    moveNodePosition: (props: I.PropertyInfo[], idx: number, typeName: string) => number;
    propsToggle: () => void;
    deletePropertyFromLocalData: (propertyName: any) => void;
    getPropertiesInEditingOrder: (node: I.NodeInfo, _props: I.PropertyInfo[]) => I.PropertyInfo[];
    private movePropsToTop;
    private movePropsToEnd;
    renderProperties: (properties: any) => PropTable;
    decryptToClipboard: (val: string, decryptButton: Button) => void;
    getNodeProperty: (propertyName: any, node: any) => I.PropertyInfo;
    getNodePropertyVal: (propertyName: any, node: any) => string;
    isNonOwnedNode: (node: I.NodeInfo) => boolean;
    isNonOwnedCommentNode: (node: any) => boolean;
    isOwnedCommentNode: (node: any) => boolean;
    renderProperty: (property: any) => string;
    renderPropertyValues: (values: any) => string;
}
