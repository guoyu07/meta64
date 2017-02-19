console.log("MessageDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { MessageDlg } from "./MessageDlg";
import { render } from "./Render";

/*
 * Callback can be null if you don't need to run any function when the dialog is closed
 */
export default class MessageDlgImpl extends DialogBaseImpl implements MessageDlg {

    private message: any;
    private title: any;
    private callback: any;

    constructor(args: Object) {
        super("MessageDlg");

        if (!(<any>args).title) {
            this.title = "Message";
        }
        this.title = (<any>args).title;
        this.message = (<any>args).message;
        this.callback = (<any>args).callback;
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let content = this.makeHeader(this.title) + "<p>" + this.message + "</p>";
        content += render.centeredButtonBar(this.makeCloseButton("Ok", "messageDlgOkButton", this.callback));
        return content;
    }
}
