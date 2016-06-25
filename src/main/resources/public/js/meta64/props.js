console.log("running module: props.js");
var props = function () {
    var _ = {
        propsToggle: function () {
            meta64.showProperties = meta64.showProperties ? false : true;
            render.renderPageFromData();
            view.scrollToSelectedNode();
            meta64.selectTab("mainTabName");
        },
        deletePropertyFromLocalData: function (propertyName) {
            for (var i = 0; i < edit.editNode.properties.length; i++) {
                if (propertyName === edit.editNode.properties[i].name) {
                    edit.editNode.properties.splice(i, 1);
                    break;
                }
            }
        },
        getPropertiesInEditingOrder: function (props) {
            var propsNew = props.clone();
            var targetIdx = 0;
            var tagIdx = propsNew.indexOfItemByProp("name", jcrCnst.CONTENT);
            if (tagIdx != -1) {
                propsNew.arrayMoveItem(tagIdx, targetIdx++);
            }
            tagIdx = propsNew.indexOfItemByProp("name", jcrCnst.TAGS);
            if (tagIdx != -1) {
                propsNew.arrayMoveItem(tagIdx, targetIdx++);
            }
            return propsNew;
        },
        renderProperties: function (properties) {
            if (properties) {
                var ret = "<table class='property-text'>";
                var propCount = 0;
                ret += "<thead><tr><th></th><th></th></tr></thead>";
                ret += "<tbody>";
                $.each(properties, function (i, property) {
                    if (render.allowPropertyToDisplay(property.name)) {
                        var isBinaryProp = render.isBinaryProperty(property.name);
                        propCount++;
                        ret += "<tr class='prop-table-row'>";
                        ret += "<td class='prop-table-name-col'>" + render.sanitizePropertyName(property.name)
                            + "</td>";
                        if (isBinaryProp) {
                            ret += "<td class='prop-table-val-col'>[binary]</td>";
                        }
                        else if (!property.values) {
                            var val = property.htmlValue ? property.htmlValue : property.value;
                            ret += "<td class='prop-table-val-col'>" + render.wrapHtml(val) + "</td>";
                        }
                        else {
                            ret += "<td class='prop-table-val-col'>" + props.renderPropertyValues(property.values)
                                + "</td>";
                        }
                        ret += "</tr>";
                    }
                    else {
                        console.log("Hiding property: " + property.name);
                    }
                });
                if (propCount == 0) {
                    return "";
                }
                ret += "</tbody></table>";
                return ret;
            }
            else {
                return undefined;
            }
        },
        getNodeProperty: function (propertyName, node) {
            if (!node || !node.properties)
                return null;
            for (var i = 0; i < node.properties.length; i++) {
                var prop = node.properties[i];
                if (prop.name === propertyName) {
                    return prop;
                }
            }
            return null;
        },
        getNodePropertyVal: function (propertyName, node) {
            var prop = _.getNodeProperty(propertyName, node);
            return prop ? prop.value : null;
        },
        isNonOwnedNode: function (node) {
            var createdBy = _.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            if (!createdBy) {
                createdBy = "admin";
            }
            return createdBy != meta64.userName;
        },
        isNonOwnedCommentNode: function (node) {
            var commentBy = _.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy != meta64.userName;
        },
        isOwnedCommentNode: function (node) {
            var commentBy = _.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy == meta64.userName;
        },
        renderProperty: function (property) {
            if (!property.values) {
                if (!property.value || property.value.length == 0) {
                    return "";
                }
                return render.wrapHtml(property.htmlValue);
            }
            else {
                return _.renderPropertyValues(property.values);
            }
        },
        renderPropertyValues: function (values) {
            var ret = "<div>";
            var count = 0;
            $.each(values, function (i, value) {
                if (count > 0) {
                    ret += cnst.BR;
                }
                ret += render.wrapHtml(value);
                count++;
            });
            ret += "</div>";
            return ret;
        }
    };
    console.log("Module ready: props.js");
    return _;
}();
//# sourceMappingURL=props.js.map