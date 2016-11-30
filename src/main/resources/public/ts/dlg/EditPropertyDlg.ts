console.log("running module: EditPropertyDlg.js");

/*
 * Property Editor Dialog (Edits Node Properties)
 */
namespace m64 {
    export class EditPropertyDlg extends DialogBase {

        constructor(private editNodeDlg: any) {
            super("EditPropertyDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
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
        }

        populatePropertyEdit = (): void => {
            var field = '';

            /* Property Name Field */
            {
                var fieldPropNameId = "addPropertyNameTextContent";

                field += render.tag("paper-textarea", {
                    "name": fieldPropNameId,
                    "id": this.id(fieldPropNameId),
                    "placeholder": "Enter property name",
                    "label": "Name"
                }, "", true);
            }

            /* Property Value Field */
            {
                var fieldPropValueId = "addPropertyValueTextContent";

                field += render.tag("paper-textarea", {
                    "name": fieldPropValueId,
                    "id": this.id(fieldPropValueId),
                    "placeholder": "Enter property text",
                    "label": "Value"
                }, "", true);
            }

            /* display the node path at the top of the edit page */
            view.initEditPathDisplayById(this.id("editPropertyPathDisplay"));

            util.setHtml(this.id("addPropertyFieldContainer"), field);
        }

        saveProperty = (): void => {
            var propertyNameData = util.getInputVal(this.id("addPropertyNameTextContent"));
            var propertyValueData = util.getInputVal(this.id("addPropertyValueTextContent"));

            var postData = {
                nodeId: edit.editNode.id,
                propertyName: propertyNameData,
                propertyValue: propertyValueData
            };
            util.json<json.SavePropertyRequest, json.SavePropertyResponse>("saveProperty", postData, this.savePropertyResponse, this);
        }

        savePropertyResponse = (res: json.SavePropertyResponse): void => {
            util.checkSuccess("Save properties", res);

            edit.editNode.properties.push(res.propertySaved);
            meta64.treeDirty = true;

            // if (this.editNodeDlg.domId != "EditNodeDlg") {
            //     console.log("error: incorrect object for EditNodeDlg");
            // }
            this.editNodeDlg.populateEditNodePg();
        }

        init = (): void => {
            this.populatePropertyEdit();
        }
    }
}
