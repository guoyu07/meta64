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

            let reindexButton: string = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.systemfolder.reindex('" + node.uid + "');",
                "class": "standardButton"
            }, //
                "Reindex");

            let searchButton: string = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.systemfolder.search('" + node.uid + "');",
                "class": "standardButton"
            }, //
                "Search");

            let buttonBar = render.centeredButtonBar(reindexButton + searchButton);

            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, path + buttonBar);
            } else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                },
                    path + buttonBar);
            }

            return ret;
        }

        export let reindex = function(_uid: string) {
            let selNode: json.NodeInfo = meta64.getHighlightedNode();
            if (selNode) {
                util.json<json.FileSearchRequest, json.FileSearchResponse>("fileSearch", {
                    "nodeId": selNode.id,
                    "reindex": true,
                    "searchText": null
                }, reindexResponse, systemfolder);
            }
        }

        export let reindexResponse = function(res: json.FileSearchResponse) {
            alert("Reindex complete.");
        }

        export let search = function(_uid: string) {
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
