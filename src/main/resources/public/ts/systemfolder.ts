console.log("running module: systemfolder.js");

namespace m64 {
    export namespace systemfolder {

        export let renderNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";
            let pathProp: json.PropertyInfo = props.getNodeProperty("meta64:path", node);
            let path: string = "";

            if (pathProp) {
                path += render.tag("h2", {
                }, pathProp.value);
            }

            /* This was an experiment to load a node property with the results of a directory listing, but I decided that
            really if I want to have a file browser, the right way to do that is to have a dedicated tab that can do it
            just like the other top-level tabs */
            //let fileListingProp: json.PropertyInfo = props.getNodeProperty("meta64:json", node);
            //let fileListing = fileListingProp ? render.renderJsonFileSearchResultProperty(fileListingProp.value) : "";

            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, path /* + fileListing */);
            } else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                },
                    path /* + fileListing */);
            }

            return ret;
        }

        export let renderFileListNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";

            let searchResultProp: json.PropertyInfo = props.getNodeProperty(jcrCnst.JSON_FILE_SEARCH_RESULT, node);
            if (searchResultProp) {
                let jcrContent = render.renderJsonFileSearchResultProperty(searchResultProp.value);

                if (rowStyling) {
                    ret += render.tag("div", {
                        "class": "jcr-content"
                    }, jcrContent);
                } else {
                    ret += render.tag("div", {
                        "class": "jcr-root-content"
                    },
                        jcrContent);
                }
            }

            return ret;
        }

        export let fileListPropOrdering = function(node: json.NodeInfo, properties: json.PropertyInfo[]): json.PropertyInfo[] {
            let propOrder: string[] = [//
                "meta64:json"];

            return props.orderProps(propOrder, properties);
        }

        export let reindex = function() {
            let selNode: json.NodeInfo = meta64.getHighlightedNode();
            if (selNode) {
                util.json<json.FileSearchRequest, json.FileSearchResponse>("fileSearch", {
                    "nodeId": selNode.id,
                    "reindex": true,
                    "searchText": null
                }, reindexResponse, systemfolder);
            }
        }

        export let browse = function() {
            // This browse function works, but i'm disabling it, for now because what I'll be doing instead is making it
            // switch to a FileBrowser Tab (main tab) where browsing will all be done. No JCR nodes will be updated during
            // the process of browsing and editing files on the server.
            //
            // let selNode: json.NodeInfo = meta64.getHighlightedNode();
            // if (selNode) {
            //     util.json<json.BrowseFolderRequest, json.BrowseFolderResponse>("browseFolder", {
            //         "nodeId": selNode.path
            //     }, systemfolder.refreshResponse, systemfolder);
            // }
        }

        export let refreshResponse = function(res: json.BrowseFolderResponse) {
            //nav.mainOffset = 0;
            // util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
            //     "nodeId": res.searchResultNodeId,
            //     "upLevel": null,
            //     "renderParentIfLeaf": null,
            //     "offset": 0,
            //     "goToLastPage" : false
            // }, nav.navPageNodeResponse);
        }

        export let reindexResponse = function(res: json.FileSearchResponse) {
            alert("Reindex complete.");
        }

        export let search = function() {
            (new m64.SearchFilesDlg(true)).open();
        }

        export let propOrdering = function(node: json.NodeInfo, properties: json.PropertyInfo[]): json.PropertyInfo[] {
            let propOrder: string[] = [//
                "meta64:path"];

            return props.orderProps(propOrder, properties);
        }
    }
}

m64.meta64.renderFunctionsByJcrType["meta64:systemfolder"] = m64.systemfolder.renderNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:systemfolder"] = m64.systemfolder.propOrdering;

m64.meta64.renderFunctionsByJcrType["meta64:filelist"] = m64.systemfolder.renderFileListNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:filelist"] = m64.systemfolder.fileListPropOrdering;
