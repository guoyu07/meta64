export declare class DomBind {
    private counter;
    private idToFuncMap;
    postConstruct(_f: any): void;
    private initMutationObserver;
    private interval;
    addOnClick: (domId: string, callback: Function) => void;
    addOnTimeUpdate: (domId: string, callback: Function) => void;
    addOnCanPlay: (domId: string, callback: Function) => void;
    addKeyPress: (domId: string, callback: Function) => void;
    addOnChange: (domId: string, callback: Function) => void;
    whenElm: (domId: string, callback: Function) => void;
}
