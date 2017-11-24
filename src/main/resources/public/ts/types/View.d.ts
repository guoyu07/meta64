import * as I from "./Interfaces";
export declare class View {
    postConstruct(_f: any): void;
    compareNodeA: I.NodeInfo;
    scrollToSelNodePending: boolean;
    updateStatusBar: () => void;
    refreshTreeResponse: (res?: I.RenderNodeResponse, targetId?: any, scrollToTop?: boolean) => void;
    refreshTree: (nodeId?: any, renderParentIfLeaf?: any, highlightId?: any, isInitialRender?: boolean) => void;
    firstPage: () => void;
    prevPage: () => void;
    nextPage: () => void;
    lastPage: () => void;
    private loadPage;
    scrollToSelectedNode: () => void;
    scrollToTop: () => void;
    initEditPathDisplayById: (domId: string) => void;
    showServerInfo: () => void;
    setCompareNodeA: () => void;
    compareAsBtoA: () => void;
    processNodeHashes: (verify: boolean) => void;
}
