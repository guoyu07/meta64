console.log("Progress.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
declare var tag;
export class Progress extends Comp {

    constructor() {
        super({
            class: "progress-bar progress-bar-striped progress-bar-animated",
            role: "progressbar",
            "aria-valuenow": "100",
            "aria-valuemin": "0",
            "aria-valuemax": "100",
            style: "width: 100%"
        });
    }

    renderHtml = (): string => {
        return tag.progress(this.attribs);
    }
}
