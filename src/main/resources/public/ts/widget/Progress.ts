console.log("Progress.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class Progress extends Comp {

    constructor() {
        super({
            "indeterminate": "indeterminate",
            "value": "800",
            "min": "100",
            "max": "1000"
        });
    }

    render = (): string => {
        return tag.progress(this.attribs);
    }
}
