var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: EditPropertyDlg.js");
var EditPropertyDlg = (function (_super) {
    __extends(EditPropertyDlg, _super);
    function EditPropertyDlg(editNodeDlg) {
        _super.call(this, "EditPropertyDlg");
    }
    EditPropertyDlg.prototype.build = function () {
        var header = this.makeHeader("Edit Node Property");
        var savePropertyButton = this.makeCloseButton("Save", "savePropertyButton", this.saveProperty, this);
        var cancelEditButton = this.makeCloseButton("Cancel", "editPropertyPgCloseButton");
        var buttonBar = render.centeredButtonBar(savePropertyButton + cancelEditButton);
        var internalMainContent = "";
        if (cnst.SHOW_PATH_IN_DLGS) {
            internalMainContent += "<div id='" + this.id("editPropertyPathDisplay")
                + "' class='path-display-in-editor'></div>";
        }
        internalMainContent += "<div id='" + this.id("addPropertyFieldContainer") + "'></div>";
        return header + internalMainContent + buttonBar;
    };
    EditPropertyDlg.prototype.populatePropertyEdit = function () {
        var field = '';
        {
            var fieldPropNameId = "addPropertyNameTextContent";
            field += render.tag("paper-textarea", {
                "name": fieldPropNameId,
                "id": this.id(fieldPropNameId),
                "placeholder": "Enter property name",
                "label": "Name"
            }, "", true);
        }
        {
            var fieldPropValueId = "addPropertyValueTextContent";
            field += render.tag("paper-textarea", {
                "name": fieldPropValueId,
                "id": this.id(fieldPropValueId),
                "placeholder": "Enter property text",
                "label": "Value"
            }, "", true);
        }
        view.initEditPathDisplayById(this.id("editPropertyPathDisplay"));
        util.setHtmlEnhanced(this.id("addPropertyFieldContainer"), field);
    };
    EditPropertyDlg.prototype.saveProperty = function () {
        var propertyNameData = util.getInputVal(this.id("addPropertyNameTextContent"));
        var propertyValueData = util.getInputVal(this.id("addPropertyValueTextContent"));
        var postData = {
            nodeId: edit.editNode.id,
            propertyName: propertyNameData,
            propertyValue: propertyValueData
        };
        util.json("saveProperty", postData, this.savePropertyResponse, this);
    };
    EditPropertyDlg.prototype.savePropertyResponse = function (res) {
        util.checkSuccess("Save properties", res);
        edit.editNode.properties.push(res.propertySaved);
        meta64.treeDirty = true;
        if (this.editNodeDlg.domId != "EditNodeDlg") {
            console.log("error: incorrect object for EditNodeDlg");
        }
        this.editNodeDlg.populateEditNodePg();
    };
    EditPropertyDlg.prototype.init = function () {
        this.populatePropertyEdit();
    };
    return EditPropertyDlg;
}(DialogBase));
//# sourceMappingURL=EditPropertyDlg.js.map