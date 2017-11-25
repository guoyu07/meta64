console.log("ViewIntf.ts");

import * as I from "../Interfaces";

export interface ViewIntf {

    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any);

    compareNodeA: I.NodeInfo;
    scrollToSelNodePending: boolean ;

    updateStatusBar (): void ;

    /*
     * newId is optional parameter which, if supplied, should be the id we scroll to when finally done with the
     * render.
     */
    refreshTreeResponse (res?: I.RenderNodeResponse, targetId?: any, scrollToTop?: boolean): void ;
    /*
     * newId is optional and if specified makes the page scroll to and highlight that node upon re-rendering.
     */
    refreshTree (nodeId?: any, renderParentIfLeaf?: any, highlightId?: any, isInitialRender?: boolean): void ;
    firstPage (): void ;

    prevPage (): void ;

    nextPage (): void ;

    lastPage (): void ;

    /*
     * todo-3: this scrolling is slightly imperfect. sometimes the code switches to a tab, which triggers
     * scrollToTop, and then some other code scrolls to a specific location a fraction of a second later. the
     * 'pending' boolean here is a crutch for now to help visual appeal (i.e. stop if from scrolling to one place
     * and then scrolling to a different place a fraction of a second later)
     */
    scrollToSelectedNode () ;
    scrollToTop () ;
    initEditPathDisplayById (domId: string) ;

    showServerInfo () ;

    setCompareNodeA () ;

    compareAsBtoA () ;

    processNodeHashes (verify: boolean) ;
}