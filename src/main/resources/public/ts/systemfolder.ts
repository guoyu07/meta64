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

            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, path);
            } else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                },
                    path);
            }

            return ret;
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
