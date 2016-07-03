console.log("running module: props.js");
var Props = (function () {
    function Props() {
    }
    Props.prototype.propsToggle = function () {
        meta64.showProperties = meta64.showProperties ? false : true;
        render.renderPageFromData();
        view.scrollToSelectedNode();
        meta64.selectTab("mainTabName");
    };
    Props.prototype.deletePropertyFromLocalData = function (propertyName) {
        for (var i = 0; i < edit.editNode.properties.length; i++) {
            if (propertyName === edit.editNode.properties[i].name) {
                edit.editNode.properties.splice(i, 1);
                break;
            }
        }
    };
    Props.prototype.getPropertiesInEditingOrder = function (props) {
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
    };
    Props.prototype.renderProperties = function (properties) {
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
    };
    Props.prototype.getNodeProperty = function (propertyName, node) {
        if (!node || !node.properties)
            return null;
        for (var i = 0; i < node.properties.length; i++) {
            var prop = node.properties[i];
            if (prop.name === propertyName) {
                return prop;
            }
        }
        return null;
    };
    Props.prototype.getNodePropertyVal = function (propertyName, node) {
        var prop = this.getNodeProperty(propertyName, node);
        return prop ? prop.value : null;
    };
    Props.prototype.isNonOwnedNode = function (node) {
        var createdBy = this.getNodePropertyVal(jcrCnst.CREATED_BY, node);
        if (!createdBy) {
            createdBy = "admin";
        }
        return createdBy != meta64.userName;
    };
    Props.prototype.isNonOwnedCommentNode = function (node) {
        var commentBy = this.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        return commentBy != null && commentBy != meta64.userName;
    };
    Props.prototype.isOwnedCommentNode = function (node) {
        var commentBy = this.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        return commentBy != null && commentBy == meta64.userName;
    };
    Props.prototype.renderProperty = function (property) {
        if (!property.values) {
            if (!property.value || property.value.length == 0) {
                return "";
            }
            return render.wrapHtml(property.htmlValue);
        }
        else {
            return this.renderPropertyValues(property.values);
        }
    };
    Props.prototype.renderPropertyValues = function (values) {
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
    };
    return Props;
}());
if (!window["props"]) {
    var props = new Props();
}
//# sourceMappingURL=props.js.map