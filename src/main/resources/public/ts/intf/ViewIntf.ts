console.log("ViewIntf.ts");

import * as I from "../Interfaces";

export interface ViewIntf {
    compareNodeA: I.NodeInfo;
    scrollToSelNodePending: boolean;

    postConstruct(_f: any);
    updateStatusBar(): void;
    refreshTreeResponse(res?: I.RenderNodeResponse, targetId?: any, scrollToTop?: boolean): void;
    refreshTree(nodeId?: any, renderParentIfLeaf?: any, highlightId?: any, isInitialRender?: boolean): void;
    firstPage(): void;
    prevPage(): void;
    nextPage(): void;
    lastPage(): void;
    scrollToSelectedNode();
    scrollToTop();
    initEditPathDisplayById(domId: string);
    showServerInfo();
    setCompareNodeA();
    compareAsBtoA();
    processNodeHashes(verify: boolean);
}