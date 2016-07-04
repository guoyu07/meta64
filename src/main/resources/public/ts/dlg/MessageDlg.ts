console.log("running module: MessageDlg.js");

/*
 * Callback can be null if you don't need to run any function when the dialog is closed
 */
class MessageDlg extends DialogBase {

    constructor(private message?: any, private title?: any, private callback?: any) {
        super("MessageDlg");

        if (this.title == null) {
            this.title = "Message";
        }
        this.title = title;
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        var content = this.makeHeader(this.title) + "<p>" + this.message + "</p>";
        content += render.centeredButtonBar(this.makeCloseButton("Ok", "messageDlgOkButton", this.callback));
        return content;
    }
}
