console.log("PropsIntf.ts");

import * as I from "../Interfaces";
import { PropTable } from "../widget/PropTable";
import { Button } from "../widget/Button";

export interface PropsIntf {

    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any);
    orderProps(propOrder: string[], _props: I.PropertyInfo[]): I.PropertyInfo[];
    moveNodePosition(props: I.PropertyInfo[], idx: number, typeName: string): number;

    /*
     * Toggles display of properties in the gui.
     */
    propsToggle(): void;
    deletePropertyFromLocalData(propertyName): void;

    /*
     * Sorts props input array into the proper order to show for editing. Simple algorithm first grabs 'jcr:content'
     * node and puts it on the top, and then does same for 'jctCnst.TAGS'
     */
    getPropertiesInEditingOrder(node: I.NodeInfo, _props: I.PropertyInfo[]): I.PropertyInfo[];

    /*
     * properties will be null or a list of PropertyInfo objects.
     */
    renderProperties(properties): PropTable;

    decryptToClipboard(val: string, decryptButton: Button): void;

    /*
     * brute force searches on node (NodeInfo.java) object properties list, and returns the first property
     * (PropertyInfo.java) with name matching propertyName, else null.
     */
    getNodeProperty(propertyName, node): I.PropertyInfo;

    getNodePropertyVal(propertyName, node): string;

    /*
     * Returns trus if this is a comment node, that the current user doesn't own. Used to disable "edit", "delete",
     * etc. on the GUI.
     */
    isNonOwnedNode(node: I.NodeInfo): boolean;

    /*
     * Returns true if this is a comment node, that the current user doesn't own. Used to disable "edit", "delete",
     * etc. on the GUI.
     */
    isNonOwnedCommentNode(node): boolean;

    isOwnedCommentNode(node): boolean;

    /*
     * Returns Span representation of property value, even if multiple properties
     */
    renderProperty(property): string;

    //todo-1: this needs to be retested after widget refactoring.
    renderPropertyValues(values): string;
}
