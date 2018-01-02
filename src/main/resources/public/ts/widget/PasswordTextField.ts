console.log("PasswordTextField.ts");

import { TextField } from "./TextField";
import { DialogBase } from "../DialogBase";

declare var tag, util;

export class PasswordTextField extends TextField {

    constructor(public label: string) {
        super(null);

        util.mergeProps(this.attribs, {
            "type" : "password",
            "class" : "form-control"
        });
    }
}
