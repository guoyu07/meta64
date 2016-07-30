console.log("running module: ConfirmDlg.js");

namespace m64 {
    export class ConfirmDlg extends DialogBase {

        constructor(private title: string, private message: string, private buttonText: string, private yesCallback: Function,
         private noCallback?: Function) {
            super("ConfirmDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var content: string = this.makeHeader("", "ConfirmDlgTitle") + this.makeMessageArea("", "ConfirmDlgMessage");

            var buttons = this.makeCloseButton("Yes", "ConfirmDlgYesButton", this.yesCallback)
                + this.makeCloseButton("No", "ConfirmDlgNoButton", this.noCallback);
            content += render.centeredButtonBar(buttons);

            return content;
        }

        init = (): void => {
            this.setHtml(this.title, "ConfirmDlgTitle");
            this.setHtml(this.message, "ConfirmDlgMessage");
            this.setHtml(this.buttonText, "ConfirmDlgYesButton");
        }
    }
}
