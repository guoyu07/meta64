console.log("CompImpl.ts");

export interface CompImpl {

    //constructor(attribs: Object, isReact: boolean);

    refreshState(): void;

    setDomAttr(attrName: string, attrVal: string);

    bindOnClick(callback: Function); 

    setIsEnabledFunc(isEnabledFunc: Function); 

    setIsVisibleFunc(isVisibleFunc: Function);

    updateState(): boolean;

    removeAllChildren(): void;

    getId(): string;

    getElement(): HTMLElement; 

    whenElm(func: Function); 

    setVisible(visible: boolean); 

    setEnabled(enabled: boolean);

    setClass(clazz: string): void; 

    setOnClick(onclick: Function): void; 

    renderToDom(elm?: HTMLElement): void;

    renderChildrenToDom(elm?: HTMLElement): void;

    setInnerHTML(html: string); 

    // addChild(comp: Comp): void 

    // addChildren(comps: Comp[]): void 

    // setChildren(comps: Comp[]) 

    renderChildren(): string;

    //don't have interface for this yet.
    //reactRenderChildren = (): React.ReactNode[] 

    reactRender(): any; /* React.DetailedReactHTMLElement???? */ 

    /* This returns an empty DIV that will have ReactJS content rendered into it if 'isReact' is true. This is only 
    a clean approach, because we have a rule that our TSWidgets (non-react compoents) are allowed to contain React elements, 
    but React elements are NOT allowed to contain non-react elements. This works fine for my purposes, because I know that any 
    React elements i have will be PURE react */ 
    renderHtml(): string;
}
