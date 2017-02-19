console.log("ConfirmDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ConfirmDlg } from "./ConfirmDlg";
import { render } from "./Render";

export default class ConfirmDlgImpl extends DialogBaseImpl implements ConfirmDlg {

    private title: string;
    private message: string;
    private buttonText: string;
    private yesCallback: Function;
    private noCallback: Function;

    constructor(args: Object) {
        super("ConfirmDlg");
        this.title = (<any>args).title;
        this.message = (<any>args).message;
        this.buttonText = (<any>args).buttonText;
        this.yesCallback = (<any>args).yesCallback;
        this.noCallback = (<any>args).noCallback;
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let content: string = this.makeHeader("", "ConfirmDlgTitle") + this.makeMessageArea("", "ConfirmDlgMessage");
        content = render.centerContent(content, 300);

        let buttons = this.makeCloseButton("Yes", "ConfirmDlgYesButton", this.yesCallback.bind(this))
            + this.makeCloseButton("No", "ConfirmDlgNoButton", this.noCallback.bind(this));
        content += render.centeredButtonBar(buttons);

        return content;
    }

    init = (): void => {
        this.setHtml(this.title, "ConfirmDlgTitle");
        this.setHtml(this.message, "ConfirmDlgMessage");
        this.setHtml(this.buttonText, "ConfirmDlgYesButton");
    }
}
