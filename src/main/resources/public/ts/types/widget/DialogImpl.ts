console.log("Dialog.ts");

import { CompImpl } from "./base/CompImpl";

export interface DialogImpl extends CompImpl {
    //constructor(text: string, isReact : boolean);
    renderHtml(): string;
}
