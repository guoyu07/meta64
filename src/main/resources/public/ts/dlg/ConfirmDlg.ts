console.log("running module: ConfirmDlg.js");

class ConfirmDlg extends DialogBase {
    domId: string = "ConfirmDlg";
    // title: string;
    // message: string;
    // buttonText: string;
    // callback: any;

    constructor(private title: string, private message: string, private buttonText: string, private callback: Function) {

        //is this necessary?
        super();
        debugger;

        // this.title = title;
        // this.message = message;
        // this.buttonText = buttonText;
        // this.callback = callback;
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build(): string {
        debugger;
        var content: string = this.makeHeader("", "ConfirmDlgTitle") + this.makeMessageArea("", "ConfirmDlgMessage");

        var buttons = this.makeCloseButton("Yes", "ConfirmDlgYesButton", this.callback)
            + this.makeCloseButton("No", "ConfirmDlgNoButton");
        content += render.centeredButtonBar(buttons);

        return content;
    }

    init(): void {
        this.setHtml(this.title, "ConfirmDlgTitle");
        this.setHtml(this.message, "ConfirmDlgMessage");
        this.setHtml(this.buttonText, "ConfirmDlgYesButton");
    }
}
