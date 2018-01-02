console.log("ConfirmDlg.ts");

import { DialogBase } from "../DialogBase";
import { Header } from "../widget/Header";
import { TextContent } from "../widget/TextContent";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { Form } from "../widget/Form";

/*
NOTE: This dialog is not yet converted to new Widget Architecture (see ChangePasswordDlgImpl.ts for a working example of the
new architecture)
*/
export class ConfirmDlg extends DialogBase {

    constructor(public config: any) {
        super(config.title);
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Form(null, [
                new TextContent(this.config.message),
                new ButtonBar([
                    new Button("Yes", this.config.yesCallback, null, true, this),
                    new Button("No", this.config.noCallback, null, true, this)
                ])
            ])
        ]);
    }
}
