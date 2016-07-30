console.log("running module: props.js");

namespace m64 {
    export namespace props {

        /*
         * Toggles display of properties in the gui.
         */
        export let propsToggle = function(): void {
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

        export let deletePropertyFromLocalData = function(propertyName): void {
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
        export let getPropertiesInEditingOrder = function(props: json.PropertyInfo[]): json.PropertyInfo[] {
            let propsNew: json.PropertyInfo[] = props.clone();
            let targetIdx: number = 0;

            let tagIdx: number = propsNew.indexOfItemByProp("name", jcrCnst.CONTENT);
            if (tagIdx != -1) {
                propsNew.arrayMoveItem(tagIdx, targetIdx++);
            }

            tagIdx = propsNew.indexOfItemByProp("name", jcrCnst.TAGS);
            if (tagIdx != -1) {
                propsNew.arrayMoveItem(tagIdx, targetIdx++);
            }

            return propsNew;
        }

        /*
         * properties will be null or a list of PropertyInfo objects.
         */
        export let renderProperties = function(properties): string {
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
                            val = render.wrapHtml(property.htmlValue ? property.htmlValue : property.value);
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
        export let getNodeProperty = function(propertyName, node): json.PropertyInfo {
            if (!node || !node.properties)
                return null;

            for (var i = 0; i < node.properties.length; i++) {
                let prop: json.PropertyInfo = node.properties[i];
                if (prop.name === propertyName) {
                    return prop;
                }
            }
            return null;
        }

        export let getNodePropertyVal = function(propertyName, node): string {
            let prop: json.PropertyInfo = getNodeProperty(propertyName, node);
            return prop ? prop.value : null;
        }

        /*
         * Returns trus if this is a comment node, that the current user doesn't own. Used to disable "edit", "delete",
         * etc. on the GUI.
         */
        export let isNonOwnedNode = function(node): boolean {
            let createdBy: string = getNodePropertyVal(jcrCnst.CREATED_BY, node);

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
        export let isNonOwnedCommentNode = function(node): boolean {
            let commentBy: string = getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy != meta64.userName;
        }

        export let isOwnedCommentNode = function(node): boolean {
            let commentBy: string = getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy == meta64.userName;
        }

        /*
         * Returns string representation of property value, even if multiple properties
         */
        export let renderProperty = function(property): string {
            if (!property.values) {
                if (!property.value || property.value.length == 0) {
                    return "";
                }
                // todo-1: make sure this wrapHtml isn't creating an unnecessary DIV element.
                return render.wrapHtml(property.htmlValue);
            } else {
                return renderPropertyValues(property.values);
            }
        }

        export let renderPropertyValues = function(values): string {
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
}
