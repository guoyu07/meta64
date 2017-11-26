console.log("DomBindIntf.ts");

import {Singletons} from "../Singletons";

export interface DomBindIntf {
    postConstruct(s: Singletons);
    addOnClick(domId: string, callback: Function);
    addOnTimeUpdate(domId: string, callback: Function);
    addOnCanPlay(domId: string, callback: Function);
    addKeyPress(domId: string, callback: Function);
    addOnChange(domId: string, callback: Function);
    whenElm(domId: string, callback: Function);
}
