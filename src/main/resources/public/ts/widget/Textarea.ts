console.log("Textarea.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

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
        let elm = this.getElement();
        if (elm) {
            //is it necessary to set attribs, i'm kinda rusty on how this works. I'm thinking if we call 'setValue' before this Widget
            //ever gets rendered we better have it's attribs value correct right?
            (<any>this.attribs).value = val;
            (<any>elm).value = val;
        }
    }

    render = (): string => {
        return tag.textarea(this.attribs);
    }
}
