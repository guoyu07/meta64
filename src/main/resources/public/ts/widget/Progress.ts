console.log("Progress.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
declare var tag;
export class Progress extends Comp {

    constructor() {
        super({
            "indeterminate": "indeterminate",
            "value": "800",
            "min": "100",
            "max": "1000"
        });
    }

    renderHtml = (): string => {
        return tag.progress(this.attribs);
    }
}
