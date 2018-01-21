console.log("MessageDlg.ts");

import { DialogBase } from "../DialogBase";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextContent } from "../widget/TextContent";
import { Comp } from "../widget/base/Comp";

/*
 * Callback can be null if you don't need to run any function when the dialog is closed
 */
export class MessageDlg extends DialogBase {

    constructor(public config: Object) {
        super((<any>config).title || "Message", "modal-md");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new TextContent((<any>this.config).message),
            (<any>this.config).customWidget,
            new ButtonBar([
                new Button("Ok", (<any>this.config).callback, null, true, this)
            ])
        ]);
    }
}
