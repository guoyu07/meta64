console.log("Header.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
declare var tag;
//todo-1: delete this. this class was a horrible idea.
export class PreRendered extends Comp {

    constructor(public domContent: string) {
        super(null);
    }

    renderHtml = (): string => {
        return this.domContent;
    }
}
