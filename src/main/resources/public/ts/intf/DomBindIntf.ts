console.log("DomBindIntf.ts");

export interface DomBindIntf {
    postConstruct(_f: any);
    addOnClick(domId: string, callback: Function);
    addOnTimeUpdate(domId: string, callback: Function);
    addOnCanPlay(domId: string, callback: Function);
    addKeyPress(domId: string, callback: Function);
    addOnChange(domId: string, callback: Function);
    whenElm(domId: string, callback: Function);
}
