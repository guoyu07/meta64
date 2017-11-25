console.log("DomBind.ts");

import {Factory} from "../Factory";
import {UtilIntf as Util} from "./UtilIntf";

let util : Util;

/*
This allows us to wire a function to a particular Element by its ID even long BEFORE the ID itself comes into existence
on the DOM! This allows us to set things up before they get rendered! Very powerful concept for 'temporal decoupling'. In Fact
the word I'd used to describe this innovation/technique would indeed be "Temporal Decoupling"
*/
export interface DomBindIntf {

    postConstruct(_f: any);

    addOnClick(domId: string, callback: Function) ;

    addOnTimeUpdate(domId: string, callback: Function);

    addOnCanPlay(domId: string, callback: Function) ;

    addKeyPress(domId: string, callback: Function) ;

    addOnChange(domId: string, callback: Function) ;

    whenElm(domId: string, callback: Function) ;
}
