console.log("PasswordTextField.ts");

import { TextField } from "./TextField";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";
import {util} from "../Util";

export class PasswordTextField extends TextField {

    constructor(public label: string) {
        super(null);

        util.mergeProps(this.attribs, {
            "label" : label,
            "type" : "password"
        });
    }
}
