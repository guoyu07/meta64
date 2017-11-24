console.log("EditPropsTable.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Div } from "./Div";
import { SharingDlg } from "../SharingDlg";
import { Button } from "./Button";
import { TextContent } from "./TextContent";

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag, util, render;

export class EditPrivsTableRow extends Comp {

    constructor(public sharingDlg: SharingDlg, public aclEntry: I.AccessControlEntryInfo) {
        super(null);
        (<any>this.attribs).class = "privilege-list";
        this.addChild(new Div("<h4>User: " + aclEntry.principalName + "</h4>"));

        let privElementsDiv = new Div();
        this.renderAclPrivileges(privElementsDiv, aclEntry);
        this.addChild(privElementsDiv);
    }

    renderAclPrivileges = (div: Div, aclEntry: I.AccessControlEntryInfo): void => {

        util.forEachArrElm(aclEntry.privileges, (privilege, index) => {
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
        return tag.div(this.attribs, this.renderChildren());
    }
}
