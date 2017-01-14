console.log("running module: EditSystemFile.js");

/* This dialog is currenetly a work in progress and will eventually be able to edit a text file on the server */
namespace m64 {
    export class EditSystemFileDlg extends DialogBase {

        constructor(private fileName: string) {
            super("EditSystemFileDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            let content: string = "<h2>File Editor: " + this.fileName + "</h2>";

            let buttons = this.makeCloseButton("Save", "SaveFileButton", this.saveEdit)
                + this.makeCloseButton("Cancel", "CancelFileEditButton", this.cancelEdit);
            content += render.centeredButtonBar(buttons);

            return content;
        }

        saveEdit = (): void => {
            console.log("save.");
        }

        cancelEdit = (): void => {
            console.log("cancel.");
        }

        init = (): void => {
        }
    }
}
