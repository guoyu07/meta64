console.log("PasswordTextField.ts");

import { TextField } from "./TextField";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class PasswordTextField extends TextField {

    constructor(public name: string, public label: string) {
        super(null);

        /* todo-0: need a cleaner way to add an objects properties another object */
        (<any>this.attribs).label = label;
        (<any>this.attribs).name = name;
        (<any>this.attribs).type = "password";
    }
}
