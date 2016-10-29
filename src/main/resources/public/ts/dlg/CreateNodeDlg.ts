console.log("running module: CreateNodeDlg.js");

namespace m64 {
    export class CreateNodeDlg extends DialogBase {

        lastSelDomId: string;
        lastSelTypeName: string;

        constructor() {
            super("CreateNodeDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            let header = this.makeHeader("Create New Node");

            let createChildButton = this.makeCloseButton("Create Child", "createChildButton", this.createChild, this);
            let createInlineButton = this.makeCloseButton("Create Inline", "createInlineButton", this.createInline, this);
            let backButton = this.makeCloseButton("Cancel", "cancelButton");
            let buttonBar = render.centeredButtonBar(createChildButton + createInlineButton + backButton);

            let content = "";
            let typeIdx = 0;
            content += this.makeListItem("Standard Type", "nt:unstructured", typeIdx++);
            content += this.makeListItem("RSS Feed", "meta64:rssfeed", typeIdx++);

            var mainContent = render.tag("div", {
                "class": "listBox"
            }, content);

            return header + mainContent + buttonBar;
        }

        makeListItem(val: string, typeName: string, typeIdx: number): string {
            debugger;
            let payload: Object = {
                "typeName": typeName,
                "typeIdx": typeIdx
            };
            return render.tag("div", {
                "class": "listItem",
                "id": this.id("typeRow" + typeIdx),
                "onclick": meta64.encodeOnClick(this.onRowClick, this, payload)
            }, val);
        }

        createChild = (): void => {
            if (!this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            debugger;
            edit.createSubNode();
        }

        createInline = (): void => {
            if (!this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            debugger;
            edit.insertNode();
        }

        onRowClick = (payload: any): void => {
            debugger;
            let divId = this.id("typeRow" + payload.typeIdx);
            this.lastSelTypeName = payload.typeName;

            if (this.lastSelDomId) {
                $("#" + this.lastSelDomId).removeClass("selectedListItem");
            }
            this.lastSelDomId = divId;
            $("#" + divId).addClass("selectedListItem");
        }

        init = (): void => {
        }
    }
}
