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

            let createFirstChildButton = this.makeCloseButton("First", "createFirstChildButton", this.createFirstChild, this);
            let createLastChildButton = this.makeCloseButton("Last", "createLastChildButton", this.createLastChild, this);
            let createInlineButton = this.makeCloseButton("Inline", "createInlineButton", this.createInline, this);
            let backButton = this.makeCloseButton("Cancel", "cancelButton");
            let buttonBar = render.centeredButtonBar(createFirstChildButton + createLastChildButton + createInlineButton + backButton);

            let content = "";
            let typeIdx = 0;
            /* todo-1: need a better way to enumerate and add the types we want to be able to search */
            content += this.makeListItem("Standard Type", "nt:unstructured", typeIdx++, true);
            content += this.makeListItem("RSS Feed", "meta64:rssfeed", typeIdx++, false);
            content += this.makeListItem("System Folder", "meta64:systemfolder", typeIdx++, false);

            var mainContent = render.tag("div", {
                "class": "listBox"
            }, content);

            return header + mainContent + buttonBar;
        }

        makeListItem(val: string, typeName: string, typeIdx: number, initiallySelected: boolean): string {
            let payload: Object = {
                "typeName": typeName,
                "typeIdx": typeIdx
            };

            let divId: string = this.id("typeRow" + typeIdx);

            if (initiallySelected) {
                this.lastSelTypeName = typeName;
                this.lastSelDomId = divId;
            }

            return render.tag("div", {
                "class": "listItem" + (initiallySelected ? " selectedListItem" : ""),
                "id": divId,
                "onclick": meta64.encodeOnClick(this.onRowClick, this, payload)
            }, val);
        }

        createFirstChild = (): void => {
            if (!this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            edit.createSubNode(null, this.lastSelTypeName, true);
        }

        createLastChild = (): void => {
            if (!this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            edit.createSubNode(null, this.lastSelTypeName, false);
        }

        createInline = (): void => {
            if (!this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            edit.insertNode(null, this.lastSelTypeName);
        }

        onRowClick = (payload: any): void => {
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
