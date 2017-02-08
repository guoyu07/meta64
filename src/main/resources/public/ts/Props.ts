console.log("Props.ts");

import {meta64} from "./Meta64"
import {util} from "./Util";
import {cnst, jcrCnst} from "./Constants";
import {render} from "./Render";
import {view} from "./View";
import {edit} from "./Edit";
import * as I from "./Interfaces";



class Props {

    orderProps = function(propOrder: string[], _props: I.PropertyInfo[]): I.PropertyInfo[] {
        let propsNew: I.PropertyInfo[] = util.arrayClone(_props);
        let targetIdx: number = 0;

        for (let prop of propOrder) {
            targetIdx = props.moveNodePosition(propsNew, targetIdx, prop);
        }

        return propsNew;
    }

    moveNodePosition = function(props: I.PropertyInfo[], idx: number, typeName: string): number {
        let tagIdx: number = util.arrayIndexOfItemByProp(props, "name", typeName);
        if (tagIdx != -1) {
            util.arrayMoveItem(props, tagIdx, idx++);
        }
        return idx;
    }

    /*
     * Toggles display of properties in the gui.
     */
    propsToggle = function(): void {
        meta64.showProperties = meta64.showProperties ? false : true;
        // setDataIconUsingId("#editModeButton", editMode ? "edit" :
        // "forbidden");

        // fix for polymer
        // var elm = $("#propsToggleButton");
        // elm.toggleClass("ui-icon-grid", meta64.showProperties);
        // elm.toggleClass("ui-icon-forbidden", !meta64.showProperties);

        render.renderPageFromData();
        view.scrollToSelectedNode();
        meta64.selectTab("mainTabName");
    }

    deletePropertyFromLocalData = function(propertyName): void {
        for (var i = 0; i < edit.editNode.properties.length; i++) {
            if (propertyName === edit.editNode.properties[i].name) {
                // splice is how you delete array elements in js.
                edit.editNode.properties.splice(i, 1);
                break;
            }
        }
    }

    /*
     * Sorts props input array into the proper order to show for editing. Simple algorithm first grabs 'jcr:content'
     * node and puts it on the top, and then does same for 'jctCnst.TAGS'
     */
    getPropertiesInEditingOrder = function(node: I.NodeInfo, _props: I.PropertyInfo[]): I.PropertyInfo[] {
        let func: Function = meta64.propOrderingFunctionsByJcrType[node.primaryTypeName];
        if (func) {
            return func(node, _props);
        }

        let propsNew: I.PropertyInfo[] = util.arrayClone(_props);
        props.movePropsToTop([jcrCnst.CONTENT, jcrCnst.TAGS], propsNew);
        props.movePropsToEnd([jcrCnst.CREATED, jcrCnst.CREATED_BY, jcrCnst.LAST_MODIFIED, jcrCnst.LAST_MODIFIED_BY], propsNew);

        return propsNew;
    }

    /* Moves all the properties listed in propList array to the end of the list of properties and keeps them in the order specified */
    private movePropsToTop = function(propsList: string[], props: I.PropertyInfo[]) {
        for (let prop of propsList) {
            let tagIdx = util.arrayIndexOfItemByProp(props, "name", prop);
            if (tagIdx != -1) {
                util.arrayMoveItem(props, tagIdx, 0);
            }
        }
    }
    /* Moves all the properties listed in propList array to the end of the list of properties and keeps them in the order specified */
    private movePropsToEnd = function(propsList: string[], props: I.PropertyInfo[]) {
        for (let prop of propsList) {
            let tagIdx = util.arrayIndexOfItemByProp(props, "name", prop);
            if (tagIdx != -1) {
                util.arrayMoveItem(props, tagIdx, props.length);
            }
        }
    }
    /*
     * properties will be null or a list of PropertyInfo objects.
     */
    renderProperties = function(properties): string {
        if (properties) {
            let table: string = "";
            let propCount: number = 0;

            $.each(properties, function(i, property) {
                if (render.allowPropertyToDisplay(property.name)) {
                    var isBinaryProp = render.isBinaryProperty(property.name);

                    propCount++;
                    let td: string = render.tag("td", {
                        "class": "prop-table-name-col"
                    }, render.sanitizePropertyName(property.name));

                    let val: string;
                    if (isBinaryProp) {
                        val = "[binary]";
                    } else if (!property.values) {
                        val = render.wrapHtml(property.value);
                    } else {
                        val = props.renderPropertyValues(property.values);
                    }

                    td += render.tag("td", {
                        "class": "prop-table-val-col"
                    }, val);

                    table += render.tag("tr", {
                        "class": "prop-table-row"
                    }, td);

                } else {
                    console.log("Hiding property: " + property.name);
                }
            });

            if (propCount == 0) {
                return "";
            }

            return render.tag("table", {
                "border": "1",
                "class": "property-table"
            }, table);
        } else {
            return undefined;
        }
    }

    /*
     * brute force searches on node (NodeInfo.java) object properties list, and returns the first property
     * (PropertyInfo.java) with name matching propertyName, else null.
     */
    getNodeProperty = function(propertyName, node): I.PropertyInfo {
        if (!node || !node.properties)
            return null;

        for (var i = 0; i < node.properties.length; i++) {
            let prop: I.PropertyInfo = node.properties[i];
            if (prop.name === propertyName) {
                return prop;
            }
        }
        return null;
    }

    getNodePropertyVal = function(propertyName, node): string {
        let prop: I.PropertyInfo = props.getNodeProperty(propertyName, node);
        return prop ? prop.value : null;
    }

    /*
     * Returns trus if this is a comment node, that the current user doesn't own. Used to disable "edit", "delete",
     * etc. on the GUI.
     */
    isNonOwnedNode = function(node): boolean {
        let createdBy: string = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);

        // if we don't know who owns this node assume the admin owns it.
        if (!createdBy) {
            createdBy = "admin";
        }

        /* This is OR condition because of createdBy is null we assume we do not own it */
        return createdBy != meta64.userName;
    }

    /*
     * Returns true if this is a comment node, that the current user doesn't own. Used to disable "edit", "delete",
     * etc. on the GUI.
     */
    isNonOwnedCommentNode = function(node): boolean {
        let commentBy: string = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        return commentBy != null && commentBy != meta64.userName;
    }

    isOwnedCommentNode = function(node): boolean {
        let commentBy: string = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        return commentBy != null && commentBy == meta64.userName;
    }

    /*
     * Returns string representation of property value, even if multiple properties
     */
    renderProperty = function(property): string {
        /* If this is a single-value type property */
        if (!property.values) {

            /* if property is missing return empty string */
            if (!property.value || property.value.length == 0) {
                return "";
            }

            return property.value;
        }
        /* else render multi-value property */
        else {
            return props.renderPropertyValues(property.values);
        }
    }

    renderPropertyValues = function(values): string {
        let ret: string = "<div>";
        let count: number = 0;
        $.each(values, function(i, value) {
            if (count > 0) {
                ret += cnst.BR;
            }
            ret += render.wrapHtml(value);
            count++;
        });
        ret += "</div>";
        return ret;
    }
}
export let props: Props = new Props();
export default props;
