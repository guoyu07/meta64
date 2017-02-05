class SystemFolder {
    //
    // renderNode = function(node: NodeInfo, rowStyling: boolean): string {
    //     let ret: string = "";
    //     let pathProp: PropertyInfo = props.getNodeProperty("meta64:path", node);
    //     let path: string = "";
    //
    //     if (pathProp) {
    //         path += render.tag("h2", {
    //         }, pathProp.value);
    //     }
    //
    //     /* This was an experiment to load a node property with the results of a directory listing, but I decided that
    //     really if I want to have a file browser, the right way to do that is to have a dedicated tab that can do it
    //     just like the other top-level tabs */
    //     //let fileListingProp: PropertyInfo = props.getNodeProperty("meta64:json", node);
    //     //let fileListing = fileListingProp ? render.renderJsonFileSearchResultProperty(fileListingProp.value) : "";
    //
    //     if (rowStyling) {
    //         ret += render.tag("div", {
    //             "class": "jcr-content"
    //         }, path /* + fileListing */);
    //     } else {
    //         ret += render.tag("div", {
    //             "class": "jcr-root-content"
    //         },
    //             path /* + fileListing */);
    //     }
    //
    //     return ret;
    // }
    //
    // renderFileListNode = function(node: NodeInfo, rowStyling: boolean): string {
    //     let ret: string = "";
    //
    //     let searchResultProp: PropertyInfo = props.getNodeProperty(jcrCnst.JSON_FILE_SEARCH_RESULT, node);
    //     if (searchResultProp) {
    //         let jcrContent = render.renderJsonFileSearchResultProperty(searchResultProp.value);
    //
    //         if (rowStyling) {
    //             ret += render.tag("div", {
    //                 "class": "jcr-content"
    //             }, jcrContent);
    //         } else {
    //             ret += render.tag("div", {
    //                 "class": "jcr-root-content"
    //             },
    //                 jcrContent);
    //         }
    //     }
    //
    //     return ret;
    // }
    //
    // fileListPropOrdering = function(node: NodeInfo, properties: PropertyInfo[]): PropertyInfo[] {
    //     let propOrder: string[] = [//
    //         "meta64:json"];
    //
    //     return props.orderProps(propOrder, properties);
    // }
    //
    // reindex = function() {
    //     let selNode: NodeInfo = meta64.getHighlightedNode();
    //     if (selNode) {
    //         util.json<FileSearchRequest, FileSearchResponse>("fileSearch", {
    //             "nodeId": selNode.id,
    //             "reindex": true,
    //             "searchText": null
    //         }, systemfolder.reindexResponse, systemfolder);
    //     }
    // }
    //
    // browse = function() {
    //     // This browse function works, but i'm disabling it, for now because what I'll be doing instead is making it
    //     // switch to a FileBrowser Tab (main tab) where browsing will all be done. No JCR nodes will be updated during
    //     // the process of browsing and editing files on the server.
    //     //
    //     // let selNode: NodeInfo = meta64.getHighlightedNode();
    //     // if (selNode) {
    //     //     util.json<BrowseFolderRequest, BrowseFolderResponse>("browseFolder", {
    //     //         "nodeId": selNode.path
    //     //     }, systemfolder.refreshResponse, systemfolder);
    //     // }
    // }
    //
    // refreshResponse = function(res: BrowseFolderResponse) {
    //     //nav.mainOffset = 0;
    //     // util.json<RenderNodeRequest, RenderNodeResponse>("renderNode", {
    //     //     "nodeId": res.searchResultNodeId,
    //     //     "upLevel": null,
    //     //     "renderParentIfLeaf": null,
    //     //     "offset": 0,
    //     //     "goToLastPage" : false
    //     // }, nav.navPageNodeResponse);
    // }
    //
    // reindexResponse = function(res: FileSearchResponse) {
    //     alert("Reindex complete.");
    // }
    //
    // search = function() {
    //     (new SearchFilesDlg(true)).open();
    // }
    //
    // propOrdering = function(node: NodeInfo, properties: PropertyInfo[]): PropertyInfo[] {
    //     let propOrder: string[] = [//
    //         "meta64:path"];
    //
    //     return props.orderProps(propOrder, properties);
    // }
}
export let systemfolder: SystemFolder = new SystemFolder();
