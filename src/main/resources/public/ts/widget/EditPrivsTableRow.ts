console.log("EditPropsTable.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Div } from "./Div";
import { SharingDlg } from "../dlg/SharingDlg";
import { Button } from "./Button";
import { TextContent } from "./TextContent";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class EditPrivsTableRow extends Comp {

    constructor(public sharingDlg: SharingDlg, public aclEntry: I.AccessControlEntryInfo) {
        super(null);
        //(<any>this.attribs).class = "privilege-list";
        this.setClass("list-group-item list-group-item-action");
        this.addChild(new Div("<h4>User: " + aclEntry.principalName + "</h4>"));

        let privElementsDiv = new Div();
        this.renderAclPrivileges(privElementsDiv, aclEntry);
        this.addChild(privElementsDiv);
    }

    renderAclPrivileges = (div: Div, aclEntry: I.AccessControlEntryInfo): void => {

        S.util.forEachArrElm(aclEntry.privileges, (privilege, index) => {
            let removeButton = new Button("Remove", () => {
                this.sharingDlg.removePrivilege(aclEntry.principalNodeId, privilege.privilegeName);
            })
            div.addChild(removeButton);
            div.addChild(new TextContent("<b>" + aclEntry.principalName + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.",
                "privilege-entry"));
        });
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return S.tag.div(this.attribs, this.renderChildren());
    }
}
