console.log("Header.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

//todo-1: delete this. this class was a horrible idea.
export class PreRendered extends Comp {

    constructor(public domContent: string) {
        super(null);
    }

    render = (): string => {
        return this.domContent;
    }
}
