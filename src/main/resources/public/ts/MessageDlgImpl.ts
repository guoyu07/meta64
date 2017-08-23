console.log("MessageDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { MessageDlg } from "./MessageDlg";
import { Header } from "./widget/Header";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextContent } from "./widget/TextContent";
import { Comp } from "./widget/base/Comp";

/*
 * Callback can be null if you don't need to run any function when the dialog is closed
 */
export default class MessageDlgImpl extends DialogBaseImpl implements MessageDlg {

    constructor(public config: Object) {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header((<any>this.config).title || "Message"),
            new TextContent((<any>this.config).message),
            (<any>this.config).customWidget,
            new ButtonBar([
                new Button("Ok", (<any>this.config).callback, null, true, this)
            ])
        ]);
    }
}
