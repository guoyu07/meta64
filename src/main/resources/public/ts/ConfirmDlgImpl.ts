console.log("ConfirmDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ConfirmDlg } from "./ConfirmDlg";
import { render } from "./Render";
import { Header } from "./widget/Header";
import { TextContent } from "./widget/TextContent";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";

/*
NOTE: This dialog is not yet converted to new Widget Architecture (see ChangePasswordDlgImpl.ts for a working example of the
new architecture)
*/
export default class ConfirmDlgImpl extends DialogBaseImpl implements ConfirmDlg {

    constructor(public config: any) {
        super("ConfirmDlg");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.getComponent().setChildren([
            new Header(this.config.title),
            new TextContent(this.config.message),
            new ButtonBar([
                new Button("Yes", this.config.yesCallback, null, true, this),
                new Button("No", this.config.noCallback, null, true, this)
            ])
        ]);
    }
}
