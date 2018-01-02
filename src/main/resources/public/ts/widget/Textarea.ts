console.log("Textarea.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
declare var tag, util;

export class Textarea extends Comp {

    constructor(public attribs: Object) {
        super(attribs);
    }

    getValue = (): string => {
        let elm = this.getElement();
        if (elm) {
            return (<any>elm).value.trim();
        }
        /* we just resort to returning the value the object was originally created to have if the gui elmement doesn't exist yet on the DOM
        when we got into here */
        else {
            return  (<any>this.attribs).value;
        }
    }

    setValue = (val: string): void => {
        (<any>this.attribs).value = val;
        let elm = this.getElement();
        if (elm) {
            //is it necessary to set attribs, i'm kinda rusty on how this works. I'm thinking if we call 'setValue' before this Widget
            //ever gets rendered we better have it's attribs value correct right?
            (<any>elm).value = val;
        }
    }

    /* Shouldn't i wrap labels and their controls in form-group for each one (like also in TextField, etc) ?? todo-1 */
    renderHtml = (): string => {
        let ret = "";
        if ((<any>this.attribs).label) {
            ret += tag.label((<any>this.attribs).label, {
                for: this.getId()
            });
        }
        (<any>this.attribs).class = "form-control";
        (<any>this.attribs).rows = "5";
        ret += tag.textarea(this.attribs, (<any>this.attribs).value);
        return ret;
    }
}
