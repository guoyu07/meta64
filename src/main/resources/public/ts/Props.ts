console.log("Props.ts");

import * as I from "./Interfaces";
import { PropTable } from "./widget/PropTable";
import { PropTableRow } from "./widget/PropTableRow";
import { PropTableCell } from "./widget/PropTableCell";
import { Button } from "./widget/Button";
import { VerticalDivs } from "./widget/VerticalDivs";
import { Div } from "./widget/Div";
import { Span } from "./widget/Span";
import { Constants as cnst } from "./Constants";


import { Factory } from "./types/Factory";

import { Meta64 } from "./types/Meta64";
import { Util } from "./types/Util";
import { Render } from "./types/Render";
import { View } from "./types/View";
import { User } from "./types/User";
import { Edit } from "./types/Edit";
import { Encryption } from "./types/Encryption";
import { Tag } from "./types/Tag";

let meta64: Meta64;
let util: Util;
let render: Render;
let view: View;
let edit: Edit;
let encryption: Encryption;
let tag: Tag;

export class Props {

    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any) {
        let f: Factory = _f;
        util = f.getUtil();
        meta64 = f.getMeta64();
        render = f.getRender();
        view = f.getView();
        edit = f.getEdit();
        encryption = f.getEncryption();
        tag = f.getTag();
    }

    orderProps = (propOrder: string[], _props: I.PropertyInfo[]): I.PropertyInfo[] => {
        let propsNew: I.PropertyInfo[] = util.arrayClone(_props);
        let targetIdx: number = 0;

        for (let prop of propOrder) {
            targetIdx = this.moveNodePosition(propsNew, targetIdx, prop);
        }

        return propsNew;
    }

    moveNodePosition = (props: I.PropertyInfo[], idx: number, typeName: string): number => {
        let tagIdx: number = util.arrayIndexOfItemByProp(props, "name", typeName);
        if (tagIdx != -1) {
            util.arrayMoveItem(props, tagIdx, idx++);
        }
        return idx;
    }

    /*
     * Toggles display of properties in the gui.
     */
    propsToggle = (): void => {
        meta64.showProperties = meta64.showProperties ? false : true;
        // setDataIconUsingId("#editModeButton", editMode ? "edit" :
        // "forbidden");

        // fix for polymer
        // let elm = $ ("#propsToggleButton");
        // elm.toggleClass("ui-icon-grid", meta64.showProperties);
        // elm.toggleClass("ui-icon-forbidden", !meta64.showProperties);

        render.renderPageFromData();
        view.scrollToSelectedNode();
        meta64.selectTab("mainTabName");
    }

    deletePropertyFromLocalData = (propertyName): void => {
        for (let i = 0; i < edit.editNode.properties.length; i++) {
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
    getPropertiesInEditingOrder = (node: I.NodeInfo, _props: I.PropertyInfo[]): I.PropertyInfo[] => {
        let func: Function = meta64.propOrderingFunctionsByJcrType[node.type];
        if (func) {
            return func(node, _props);
        }

        let propsNew: I.PropertyInfo[] = util.arrayClone(_props);
        this.movePropsToTop([cnst.CONTENT, cnst.TAGS], propsNew);
        //this.movePropsToEnd([jcrCnst.CREATED, jcrCnst.OWNER, jcrCnst.LAST_MODIFIED], propsNew);

        return propsNew;
    }

    /* Moves all the properties listed in propList array to the end of the list of properties and keeps them in the order specified */
    private movePropsToTop = (propsList: string[], props: I.PropertyInfo[]) => {
        for (let prop of propsList) {
            let tagIdx = util.arrayIndexOfItemByProp(props, "name", prop);
            if (tagIdx != -1) {
                util.arrayMoveItem(props, tagIdx, 0);
            }
        }
    }

    /* Moves all the properties listed in propList array to the end of the list of properties and keeps them in the order specified */
    private movePropsToEnd = (propsList: string[], props: I.PropertyInfo[]) => {
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
    renderProperties = (properties): PropTable => {
        if (properties) {
            let propTable = new PropTable({
                "border": "1",
                "class": "property-table"
                // "sourceClass" : "[propsTable]"
            });

            util.forEachArrElm(properties, (property, i) => {
                //console.log("Render Prop: "+property.name);
                if (render.allowPropertyToDisplay(property.name)) {
                    var isBinaryProp = render.isBinaryProperty(property.name);

                    let propNameCell = new PropTableCell(render.sanitizePropertyName(property.name), {
                        "class": "prop-table-name-col"
                    });

                    let valCellAttrs = {
                        "class": "prop-table-val-col"
                    };
                    let propValCell: PropTableCell;

                    if (isBinaryProp) {
                        propValCell = new PropTableCell("[binary]", valCellAttrs);
                    }
                    else if (property.name == cnst.PASSWORD) {
                        let decryptButton: Button = null;
                        let comps = new VerticalDivs([
                            new Div(property.value),
                            decryptButton = new Button("Decrypt", () => {
                                this.decryptToClipboard(property.value, decryptButton);
                            })
                        ]);
                        propValCell = new PropTableCell(comps.renderHtml(), valCellAttrs);
                    }
                    else if (!property.values) {
                        propValCell = new PropTableCell(tag.div(null, property.value), valCellAttrs);
                    }
                    else {
                        propValCell = new PropTableCell(this.renderPropertyValues(property.values), valCellAttrs);
                    }

                    let propTableRow = new PropTableRow({
                        "class": "prop-table-row"
                    }, [propNameCell, propValCell])
                    propTable.addChild(propTableRow);

                } else {
                    console.log("Hiding property: " + property.name);
                }
            });
            return propTable;
        } else {
            return null;
        }
    }

    decryptToClipboard = (val: string, decryptButton: Button): void => {
        let decryptedValPromise = encryption.passwordDecryptString(val, util.getPassword());
        decryptedValPromise.then((decryptedVal) => {
            /*
            Instead of being able to just immediately copy the decrypted password to the clipboard we cannot because of the
            browser limitation that clipboard access can only happen as a synchronous response to user input (like in an onClick method),
            but since the entire CryptoAPI is async all we can do once we get the clipboard is set things up so the user can
            just make one more mouse click to be able to ACTUALLY put the password in the cliboard, and so that is what these
            next two lines are doing. Changing button to say appropriate thing and setting up command to load clipboard when clicked.
             */
            decryptButton.setInnerHTML("To Clipboard");
            decryptButton.bindOnClick(() => {
                util.copyToClipboard(decryptedVal);
                decryptButton.setInnerHTML("Copied!");
                setTimeout(() => {
                    decryptButton.setInnerHTML("To Clipboard");
                }, 2000);
            });
        });
    }

    /*
     * brute force searches on node (NodeInfo.java) object properties list, and returns the first property
     * (PropertyInfo.java) with name matching propertyName, else null.
     */
    getNodeProperty = (propertyName, node): I.PropertyInfo => {
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

    getNodePropertyVal = (propertyName, node): string => {
        let prop: I.PropertyInfo = this.getNodeProperty(propertyName, node);
        return prop ? prop.value : null;
    }

    /*
     * Returns trus if this is a comment node, that the current user doesn't own. Used to disable "edit", "delete",
     * etc. on the GUI.
     */
    isNonOwnedNode = (node: I.NodeInfo): boolean => {
        let owner: string = node.owner;

        // if we don't know who owns this node assume the admin owns it.
        if (!owner) {
            owner = "admin";
        }

        /* This is OR condition because of createdBy is null we assume we do not own it */
        return owner != meta64.userName;
    }

    /*
     * Returns true if this is a comment node, that the current user doesn't own. Used to disable "edit", "delete",
     * etc. on the GUI.
     */
    isNonOwnedCommentNode = (node): boolean => {
        let commentBy: string = this.getNodePropertyVal(cnst.COMMENT_BY, node);
        return commentBy != null && commentBy != meta64.userName;
    }

    isOwnedCommentNode = (node): boolean => {
        let commentBy: string = this.getNodePropertyVal(cnst.COMMENT_BY, node);
        return commentBy != null && commentBy == meta64.userName;
    }

    /*
     * Returns Span representation of property value, even if multiple properties
     */
    renderProperty = (property): string => {
        let ret: string = null;
        /* If this is a single-value type property */
        if (!property.values) {

            /* if property is missing return empty string */
            if (!property.value || property.value.length == 0) {
                ret = "";
            }
            else {
                ret = property.value;
            }
        }
        /* else render multi-value property */
        else {
            ret = this.renderPropertyValues(property.values);
        }

        return ret || "";
    }

    //todo-1: this needs to be retested after widget refactoring.
    renderPropertyValues = (values): string => {
        let ret = "";

        util.forEachArrElm(values, (value, i: number) => {
            ret += value;
            ret += "\n\n";
        });

        return ret;
    }
}
