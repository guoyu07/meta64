console.log("running module: render.js");

declare var postTargetUrl;
declare var prettyPrint;

namespace m64 {
    export namespace render {
        let debug: boolean = false;

        /*
         * This is the content displayed when the user signs in, and we see that they have no content being displayed. We
         * want to give them some instructions and the ability to add content.
         */
        let getEmptyPagePrompt = function(): string {
            return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
        }

        let renderBinary = function(node: json.NodeInfo): string {
            /*
             * If this is an image render the image directly onto the page as a visible image
             */
            if (node.binaryIsImage) {
                return makeImageTag(node);
            }
            /*
             * If not an image we render a link to the attachment, so that it can be downloaded.
             */
            else {
                let anchor: string = tag("a", {
                    "href": getUrlForNodeAttachment(node)
                }, "[Download Attachment]");

                return tag("div", {
                    "class": "binary-link"
                }, anchor);
            }
        }

        /*
         * Important little method here. All GUI page/divs are created using this sort of specification here that they
         * all must have a 'build' method that is called first time only, and then the 'init' method called before each
         * time the component gets displayed with new information.
         *
         * If 'data' is provided, this is the instance data for the dialog
         */
        export let buidPage = function(pg, data): void {
            console.log("buildPage: pg.domId=" + pg.domId);

            if (!pg.built || data) {
                pg.build(data);
                pg.built = true;
            }

            if (pg.init) {
                pg.init(data);
            }
        }

        export let buildRowHeader = function(node: json.NodeInfo, showPath: boolean, showName: boolean): string {
            let commentBy: string = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);

            let headerText: string = "";

            if (cnst.SHOW_PATH_ON_ROWS) {
                headerText += "<div class='path-display'>Path: " + formatPath(node) + "</div>";
            }

            headerText += "<div>";

            if (commentBy) {
                let clazz: string = (commentBy === meta64.userName) ? "created-by-me" : "created-by-other";
                headerText += "<span class='" + clazz + "'>Comment By: " + commentBy + "</span>";
            } //
            else if (node.createdBy) {
                let clazz: string = (node.createdBy === meta64.userName) ? "created-by-me" : "created-by-other";
                headerText += "<span class='" + clazz + "'>Created By: " + node.createdBy + "</span>";
            }

            headerText += "<span id='ownerDisplay" + node.uid + "'></span>";
            if (node.lastModified) {
                headerText += "  Mod: " + node.lastModified;
            }
            headerText += "</div>";

            /*
             * on root node name will be empty string so don't show that
             *
             * commenting: I decided users will understand the path as a single long entity with less confusion than
             * breaking out the name for them. They already unserstand internet URLs. This is the same concept. No need
             * to baby them.
             *
             * The !showPath condition here is because if we are showing the path then the end of that is always the
             * name, so we don't need to show the path AND the name. One is a substring of the other.
             */
            if (showName && !showPath && node.name) {
                headerText += "Name: " + node.name + " [uid=" + node.uid + "]";
            }

            headerText = tag("div", {
                "class": "header-text"
            }, headerText);

            return headerText;
        }

        /*
         * Pegdown markdown processor will create <code> blocks and the class if provided, so in order to get google
         * prettifier to process it the rest of the way (when we call prettyPrint() for the whole page) we now run
         * another stage of transformation to get the <pre> tag put in with 'prettyprint' etc.
         */
        export let injectCodeFormatting = function(content: string): string {
            if (!content) return content;
            // example markdown:
            // ```js
            // var x = 10;
            // var y = "test";
            // ```
            //
            if (content.contains("<code")) {
                meta64.codeFormatDirty = true;
                content = encodeLanguages(content);
                content = content.replaceAll("</code>", "</pre>");
            }

            return content;
        }

        export let injectSubstitutions = function(content: string): string {
            return content.replaceAll("{{locationOrigin}}", window.location.origin);
        }

        export let encodeLanguages = function(content: string): string {
            /*
             * todo-1: need to provide some way of having these language types configurable in a properties file
             * somewhere, and fill out a lot more file types.
             */
            var langs = ["js", "html", "htm", "css"];
            for (var i = 0; i < langs.length; i++) {
                content = content.replaceAll("<code class=\"" + langs[i] + "\">", //
                    "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
            }
            content = content.replaceAll("<code>", "<pre class='prettyprint'>");

            return content;
        }

        /* after a property, or node is updated (saved) we can now call this method instead of refreshing the entire page
        which is what's done in most of the app, which is much less efficient and snappy visually */
        export let refreshNodeOnPage = function(node: json.NodeInfo): void {
            //need to lookup uid from NodeInfo.id then set the content of this div.
            //"id": uid + "_content"
            //to the value from renderNodeContent(node, true, true, true, true, true)));
            let uid: string = meta64.identToUidMap[node.id];
            if (!uid) throw "Unable to find nodeId " + node.id + " in uid map";
            meta64.initNode(node, false);
            if (uid != node.uid) throw "uid changed unexpectly after initNode";
            let rowContent: string = renderNodeContent(node, true, true, true, true, true);
            $("#" + uid + "_content").html(rowContent);
        }

        /*
         * This is the function that renders each node in the main window. The rendering in here is very central to the
         * app and is what the user sees covering 90% of the screen most of the time. The "content* nodes.
         *
         * todo-0: Rather than having this node renderer itself be responsible for rendering all the different types
         * of nodes, need a more pluggable design, where rendeing of different things is deletaged to some
         * appropriate object/service
         */
        export let renderNodeContent = function(node: json.NodeInfo, showPath, showName, renderBin, rowStyling, showHeader): string {
            var ret: string = getTopRightImageTag(node);

            /* todo-2: enable headerText when appropriate here */
            if (meta64.showMetaData) {
                ret += showHeader ? buildRowHeader(node, showPath, showName) : "";
            }

            if (meta64.showProperties) {
                var properties = props.renderProperties(node.properties);
                if (properties) {
                    ret += /* "<br>" + */properties;
                }
            } else {
                let renderComplete: boolean = false;

                /*
                 * Special Rendering for Search Result
                 */
                let searchResultProp: json.PropertyInfo = props.getNodeProperty(jcrCnst.JSON_FILE_SEARCH_RESULT, node);
                if (searchResultProp) {
                    let jcrContent = renderJsonFileSearchResultProperty(searchResultProp.value);
                    renderComplete = true;

                    if (rowStyling) {
                        ret += tag("div", {
                            "class": "jcr-content"
                        }, jcrContent);
                    } else {
                        ret += tag("div", {
                            "class": "jcr-root-content"
                        },
                            jcrContent);
                    }
                }

                /*
                 * Special Rendering for RSS Feed node
                 */
                if (!renderComplete) {
                    let rssFeedTitle: json.PropertyInfo = props.getNodeProperty("rssFeedTitle", node);
                    if (rssFeedTitle) {
                        renderComplete = true;
                        ret += podcast.renderFeedNode(node, rowStyling);
                    }
                }

                /*
                 * Special Rendering for RSS Entry
                 */
                if (!renderComplete) {
                    let rssLink: json.PropertyInfo = props.getNodeProperty("rssEntryLink", node);
                    if (rssLink && rssLink.value.toLowerCase().indexOf(".mp3") != -1) {
                        renderComplete = true;
                        ret += podcast.renderEntryNode(node, rowStyling);
                    }
                }

                if (!renderComplete) {
                    let contentProp: json.PropertyInfo = props.getNodeProperty(jcrCnst.CONTENT, node);

                    //console.log("contentProp: " + contentProp);
                    if (contentProp) {
                        renderComplete = true;
                        let jcrContent = props.renderProperty(contentProp);
                        jcrContent = "<div>" + jcrContent + "</div>";

                        if (meta64.serverMarkdown) {
                            jcrContent = injectCodeFormatting(jcrContent);
                            jcrContent = injectSubstitutions(jcrContent);

                            if (rowStyling) {
                                ret += tag("div", {
                                    "class": "jcr-content"
                                }, jcrContent);
                            } else {
                                ret += tag("div", {
                                    "class": "jcr-root-content"
                                },
                                    // probably could use
                                    // "img.top.right" feature for
                                    // (Also need to make this a configurable option, because other clones of meta64 don't
                                    // want my github link!)
                                    //
                                    //I decided for now I don't want to show the fork-me-on-github image at upper right of app, but uncommenting this line is al
                                    //that's required to bring it back.
                                    //"<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"+
                                    jcrContent);
                            }
                        }
                        /*
                         * I spent hours trying to get marked-element to work. Unsuccessful still, so I just have
                         * serverMarkdown flag that I can set to true, and turn this experimental feature off for now.
                         */
                        else {

                            /* alternate attribute way */
                            // jcrContent = jcrContent.replaceAll("'",
                            // "{{quot}}");
                            // ret += "<marked-element sanitize='true'
                            // markdown='" +
                            // jcrContent
                            // + "'><div class='markdown-html jcr-content'>";
                            // ret += "</div></marked-element>";
                            if (rowStyling) {
                                ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                                ret += tag("script", {
                                    "type": "text/markdown"
                                }, jcrContent);
                            } else {
                                ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                                ret += tag("script", {
                                    "type": "text/markdown"
                                },
                                    // probably could
                                    // "img.top.right" feature for
                                    // this
                                    // // if we wanted to. oops.
                                    "<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"
                                    + jcrContent);
                            }
                            ret += "</div></marked-element>";
                        }

                        /*
                         * if (jcrContent.length > 0) { if (rowStyling) { ret += tag("div", { "class" : "jcr-content" },
                         * jcrContent); } else { ret += tag("div", { "class" : "jcr-root-content" }, // probably could
                         * "img.top.right" feature for this // if we wanted to. oops. "<a
                         * href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png'
                         * class='corner-style'/></a>" + jcrContent); } }
                         */
                    }
                }

                if (!renderComplete) {
                    if (node.path.trim() == "/") {
                        ret += "Root Node";
                    }
                    // ret += "<div>[No Content Property]</div>";
                    let properties: string = props.renderProperties(node.properties);
                    if (properties) {
                        ret += /* "<br>" + */properties;
                    }
                }
            }

            if (renderBin && node.hasBinary) {
                let binary: string = renderBinary(node);

                /*
                 * We append the binary image or resource link either at the end of the text or at the location where
                 * the user has put {{insert-attachment}} if they are using that to make the image appear in a specific
                 * locatio in the content text.
                 */
                if (ret.contains(cnst.INSERT_ATTACHMENT)) {
                    ret = ret.replaceAll(cnst.INSERT_ATTACHMENT, binary);
                } else {
                    ret += binary;
                }
            }

            let tags: string = props.getNodePropertyVal(jcrCnst.TAGS, node);
            if (tags) {
                ret += tag("div", {
                    "class": "tags-content"
                }, "Tags: " + tags);
            }

            return ret;
        }

        export let renderJsonFileSearchResultProperty = function(jsonContent: string): string {
            let content: string = "";
            try {
                console.log("json: " + jsonContent);
                let list: any[] = JSON.parse(jsonContent);

                for (let entry of list) {
                    let fileNameDiv = tag("div", {
                        "class": "systemFile",
                    }, entry.fileName);

                    let localOpenLink = tag("a", {
                        "onclick": "m64.meta64.openSystemFile('" + entry.fileName + "')"
                    }, "Local Open")

                    let downloadLink = tag("a", {
                        "onclick": "m64.meta64.downloadSystemFile('" + entry.fileName + "')"
                    }, "Download")

                    let linksDiv = tag("div", {
                    }, localOpenLink + downloadLink);

                    content += tag("div", {
                    }, fileNameDiv + linksDiv);
                }
            }
            catch (e) {
                content = "[render failed]";
            }
            return content;
        }

        /*
         * This is the primary method for rendering each node (like a row) on the main HTML page that displays node
         * content. This generates the HTML for a single row/node.
         *
         * node is a NodeInfo.java JSON
         */
        export let renderNodeAsListItem = function(node: json.NodeInfo, index: number, count: number, rowCount: number): string {

            let uid: string = node.uid;
            let canMoveUp: boolean = index > 0 && rowCount > 1;
            let canMoveDown: boolean = index < count - 1;

            let isRep: boolean = node.name.startsWith("rep:") || /*
														 * meta64.currentNodeData. bug?
														 */node.path.contains("/rep:");

            let editingAllowed: boolean = props.isOwnedCommentNode(node);
            if (!editingAllowed) {
                editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                    && !props.isNonOwnedNode(node);
            }

            // console.log("Rendering Node Row[" + index + "] editingAllowed="+editingAllowed);

            /*
             * if not selected by being the new child, then we try to select based on if this node was the last one
             * clicked on for this page.
             */
            // console.log("test: [" + parentIdToFocusIdMap[currentNodeId]
            // +"]==["+ node.id + "]")
            let focusNode: json.NodeInfo = meta64.getHighlightedNode();
            let selected: boolean = (focusNode && focusNode.uid === uid);

            let buttonBarHtmlRet: string = makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
            let bkgStyle: string = getNodeBkgImageStyle(node);

            let cssId: string = uid + "_row";
            return tag("div", {
                "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
                "onClick": "m64.nav.clickOnNodeRow(this, '" + uid + "');", //
                "id": cssId,
                "style": bkgStyle
            },//
                buttonBarHtmlRet + tag("div", {
                    "id": uid + "_content"
                }, renderNodeContent(node, true, true, true, true, true)));
        }

        export let showNodeUrl = function() {
            let node: json.NodeInfo = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("You must first click on a node.")).open();
                return;
            }

            let path: string = node.path.stripIfStartsWith("/root");
            let url: string = window.location.origin + "?id=" + path;
            meta64.selectTab("mainTabName");

            let message: string = "URL using path: <br>" + url;
            let uuid: string = props.getNodePropertyVal("jcr:uuid", node);
            if (uuid) {
                message += "<p>URL for UUID: <br>" + window.location.origin + "?id=" + uuid;
            }

            (new MessageDlg(message, "URL of Node")).open();
        }

        export let getTopRightImageTag = function(node: json.NodeInfo) {
            let topRightImg: string = props.getNodePropertyVal('img.top.right', node);
            let topRightImgTag: string = "";
            if (topRightImg) {
                topRightImgTag = tag("img", {
                    "src": topRightImg,
                    "class": "top-right-image"
                }, "", false);
            }
            return topRightImgTag;
        }

        export let getNodeBkgImageStyle = function(node: json.NodeInfo): string {
            let bkgImg: string = props.getNodePropertyVal('img.node.bkg', node);
            let bkgImgStyle: string = "";
            if (bkgImg) {
                bkgImgStyle = "background-image: url(" + bkgImg + ");";
            }
            return bkgImgStyle;
        }

        export let centeredButtonBar = function(buttons?: string, classes?: string): string {
            classes = classes || "";

            return tag("div", {
                "class": "horizontal center-justified layout " + classes
            }, buttons);
        }

        export let buttonBar = function(buttons: string, classes: string): string {
            classes = classes || "";

            return tag("div", {
                "class": "horizontal left-justified layout " + classes
            }, buttons);
        }

        export let makeRowButtonBarHtml = function(node: json.NodeInfo, canMoveUp: boolean, canMoveDown: boolean, editingAllowed: boolean) {

            let createdBy: string = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            let commentBy: string = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            let publicAppend: string = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, node);

            let openButton: string = "";
            let selButton: string = "";
            let createSubNodeButton: string = "";
            let editNodeButton: string = "";
            let moveNodeUpButton: string = "";
            let moveNodeDownButton: string = "";
            let insertNodeButton: string = "";
            let replyButton: string = "";

            /*
             * Show Reply button if this is a publicly appendable node and not created by current user,
             * or having been added as comment by current user
             */
            if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
                replyButton = tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.edit.replyToComment('" + node.uid + "');" //
                }, //
                    "Reply");
            }

            let buttonCount: number = 0;

            /* Construct Open Button */
            if (nodeHasChildren(node.uid)) {
                buttonCount++;

                openButton = tag("paper-button", {

                    /* For some unknown reason the ability to style this with the class broke, and even
                    after dedicating several hours trying to figure out why I'm still baffled. I checked everything
                    a hundred times and still don't know what I'm doing wrong...I just finally put the god damn fucking style attribute
                    here to accomplish the same thing */
                    //"class": "green",
                    "style": "background-color: #4caf50;color:white;",
                    "raised": "raised",
                    "onClick": "m64.nav.openNode('" + node.uid + "');"//
                }, //
                    "Open");
            }

            /*
             * If in edit mode we always at least create the potential (buttons) for a user to insert content, and if
             * they don't have privileges the server side security will let them know. In the future we can add more
             * intelligence to when to show these buttons or not.
             */
            if (meta64.userPreferences.editMode) {
                // console.log("Editing allowed: " + nodeId);

                let selected: boolean = meta64.selectedNodes[node.uid] ? true : false;

                // console.log(" nodeId " + node.uid + " selected=" + selected);
                buttonCount++;

                let css: Object = selected ? {
                    "id": node.uid + "_sel",//
                    "onClick": "m64.nav.toggleNodeSel('" + node.uid + "');",
                    "checked": "checked",
                    //padding is a back hack to make checkbox line up with other icons.
                    //(i will probably end up using a paper-icon-button that toggles here, instead of checkbox)
                    "style": "margin-top: 11px;"
                } : //
                    {
                        "id": node.uid + "_sel",//
                        "onClick": "m64.nav.toggleNodeSel('" + node.uid + "');",
                        "style": "margin-top: 11px;"
                    };

                selButton = tag("paper-checkbox", css, "");

                if (cnst.NEW_ON_TOOLBAR && !commentBy) {
                    /* Construct Create Subnode Button */
                    buttonCount++;
                    createSubNodeButton = tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture-alt", //"icons:more-vert",
                        "id": "addNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "m64.edit.createSubNode('" + node.uid + "');"
                    }, "Add");
                }

                if (cnst.INS_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    /* Construct Create Subnode Button */
                    insertNodeButton = tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture", //"icons:more-horiz",
                        "id": "insertNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "m64.edit.insertNode('" + node.uid + "');"
                    }, "Ins");
                }
            }

            //Polmer Icons Reference: https://elements.polymer-project.org/elements/iron-icons?view=demo:demo/index.html

            if (meta64.userPreferences.editMode && editingAllowed) {
                buttonCount++;
                /* Construct Create Subnode Button */
                editNodeButton = tag("paper-icon-button", //
                    {
                        "alt": "Edit node.",
                        "icon": "editor:mode-edit",
                        "raised": "raised",
                        "onClick": "m64.edit.runEditNode('" + node.uid + "');"
                    }, "Edit");

                if (cnst.MOVE_UPDOWN_ON_TOOLBAR && meta64.currentNode.childrenOrdered && !commentBy) {

                    if (canMoveUp) {
                        buttonCount++;
                        /* Construct Create Subnode Button */
                        moveNodeUpButton = tag("paper-icon-button", {
                            "icon": "icons:arrow-upward",
                            "raised": "raised",
                            "onClick": "m64.edit.moveNodeUp('" + node.uid + "');"
                        }, "Up");
                    }

                    if (canMoveDown) {
                        buttonCount++;
                        /* Construct Create Subnode Button */
                        moveNodeDownButton = tag("paper-icon-button", {
                            "icon": "icons:arrow-downward",
                            "raised": "raised",
                            "onClick": "m64.edit.moveNodeDown('" + node.uid + "');"
                        }, "Dn");
                    }
                }
            }

            /*
             * i will be finding a reusable/DRY way of doing tooltops soon, this is just my first experiment.
             *
             * However tooltips ALWAYS cause problems. Mystery for now.
             */
            let insertNodeTooltip: string = "";
            //			 tag("paper-tooltip", {
            //			 "for" : "insertNodeButtonId" + node.uid
            //			 }, "INSERTS a new node at the current tree position. As a sibling on this level.");

            let addNodeTooltip: string = "";
            //			 tag("paper-tooltip", {
            //			 "for" : "addNodeButtonId" + node.uid
            //			 }, "ADDS a new node inside the current node, as a child of it.");

            let allButtons: string = selButton + openButton + insertNodeButton + createSubNodeButton + insertNodeTooltip
                + addNodeTooltip + editNodeButton + moveNodeUpButton + moveNodeDownButton + replyButton;

            return allButtons.length > 0 ? makeHorizontalFieldSet(allButtons) : "";
        }

        export let makeHorizontalFieldSet = function(content?: string, extraClasses?: string): string {

            /* Now build entire control bar */
            return tag("div", //
                {
                    "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
                }, content, true);
        }

        export let makeHorzControlGroup = function(content: string): string {
            return tag("div", {
                "class": "horizontal layout"
            }, content, true);
        }

        export let makeRadioButton = function(label: string, id: string): string {
            return tag("paper-radio-button", {
                "id": id,
                "name": id
            }, label);
        }

        /*
         * Returns true if the nodeId (see makeNodeId()) NodeInfo object has 'hasChildren' true
         */
        export let nodeHasChildren = function(uid: string): boolean {
            var node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("Unknown nodeId in nodeHasChildren: " + uid);
                return false;
            } else {
                return node.hasChildren;
            }
        }

        export let formatPath = function(node: json.NodeInfo): string {
            let path: string = node.path;

            /* we inject space in here so this string can wrap and not affect window sizes adversely, or need scrolling */
            path = path.replaceAll("/", " / ");
            let shortPath: string = path.length < 50 ? path : path.substring(0, 40) + "...";

            let noRootPath: string = shortPath;
            if (noRootPath.startsWith("/root")) {
                noRootPath = noRootPath.substring(0, 5);
            }

            let ret: string = meta64.isAdminUser ? shortPath : noRootPath;
            ret += " [" + node.primaryTypeName + "]";
            return ret;
        }

        export let wrapHtml = function(text: string): string {
            return "<div>" + text + "</div>";
        }

        /*
         * Renders page and always also takes care of scrolling to selected node if there is one to scroll to
         */
        export let renderPageFromData = function(data?: json.RenderNodeResponse): string {
            meta64.codeFormatDirty = false;
            console.log("m64.render.renderPageFromData()");

            let newData: boolean = false;
            if (!data) {
                data = meta64.currentNodeData;
            } else {
                newData = true;
            }

            if (!data || !data.node) {
                util.setVisibility("#listView", false);
                $("#mainNodeContent").html("No content is available here.");
                return;
            } else {
                util.setVisibility("#listView", true);
            }

            meta64.treeDirty = false;

            if (newData) {
                meta64.uidToNodeMap = {};
                meta64.idToNodeMap = {};
                meta64.identToUidMap = {};

                /*
                 * I'm choosing to reset selected nodes when a new page loads, but this is not a requirement. I just
                 * don't have a "clear selections" feature which would be needed so user has a way to clear out.
                 */
                meta64.selectedNodes = {};
                meta64.parentUidToFocusNodeMap = {};

                meta64.initNode(data.node, true);
                meta64.setCurrentNodeData(data);
            }

            let propCount: number = meta64.currentNode.properties ? meta64.currentNode.properties.length : 0;

            if (debug) {
                console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
            }

            let output: string = "";
            let bkgStyle: string = getNodeBkgImageStyle(data.node);

            /*
             * NOTE: mainNodeContent is the parent node of the page content, and is always the node displayed at the to
             * of the page above all the other nodes which are its child nodes.
             */
            let mainNodeContent: string = renderNodeContent(data.node, true, true, true, false, true);

            //console.log("mainNodeContent: "+mainNodeContent);

            if (mainNodeContent.length > 0) {
                let uid: string = data.node.uid;
                let cssId: string = uid + "_row";
                let buttonBar: string = "";
                let editNodeButton: string = "";
                let createSubNodeButton: string = "";
                let replyButton: string = "";

                // console.log("data.node.path="+data.node.path);
                // console.log("isNonOwnedCommentNode="+props.isNonOwnedCommentNode(data.node));
                // console.log("isNonOwnedNode="+props.isNonOwnedNode(data.node));

                let createdBy: string = props.getNodePropertyVal(jcrCnst.CREATED_BY, data.node);
                let commentBy: string = props.getNodePropertyVal(jcrCnst.COMMENT_BY, data.node);
                let publicAppend: string = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, data.node);

                /*
                 * Show Reply button if this is a publicly appendable node and not created by current user,
                 * or having been added as comment by current user
                 */

                if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
                    replyButton = tag("paper-button", {
                        "raised": "raised",
                        "onClick": "m64.edit.replyToComment('" + data.node.uid + "');" //
                    }, //
                        "Reply");
                }

                if (meta64.userPreferences.editMode && cnst.NEW_ON_TOOLBAR && edit.isInsertAllowed(data.node)) {
                    createSubNodeButton = tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture-alt", //icons:more-vert",
                        // "id" : "addNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "m64.edit.createSubNode('" + uid + "');"
                    }, "Add");
                }

                /* Add edit button if edit mode and this isn't the root */
                if (edit.isEditAllowed(data.node)) {

                    /* Construct Create Subnode Button */
                    editNodeButton = tag("paper-icon-button", {
                        "icon": "editor:mode-edit",
                        "raised": "raised",
                        "onClick": "m64.edit.runEditNode('" + uid + "');"
                    }, "Edit");
                }

                /* Construct Create Subnode Button */
                let focusNode: json.NodeInfo = meta64.getHighlightedNode();
                let selected: boolean = focusNode && focusNode.uid === uid;
                // var rowHeader = buildRowHeader(data.node, true, true);

                if (createSubNodeButton || editNodeButton || replyButton) {
                    buttonBar = makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
                }

                let content: string = tag("div", {
                    "class": (selected ? "mainNodeContentStyle active-row" : "mainNodeContentStyle inactive-row"),
                    "onClick": "m64.nav.clickOnNodeRow(this, '" + uid + "');",
                    "id": cssId
                },//
                    buttonBar + mainNodeContent);

                $("#mainNodeContent").show();
                $("#mainNodeContent").html(content);

                /* force all links to open a new window/tab */
                //$("a").attr("target", "_blank"); <---- this doesn't work.
                // $('#mainNodeContent').find("a").each(function() {
                //     $(this).attr("target", "_blank");
                // });
            } else {
                $("#mainNodeContent").hide();
            }

            // console.log("update status bar.");
            view.updateStatusBar();

            let rowCount: number = 0;
            if (data.children) {
                let childCount: number = data.children.length;
                // console.log("childCount: " + childCount);
                /*
                 * Number of rows that have actually made it onto the page to far. Note: some nodes get filtered out on
                 * the client side for various reasons.
                 */

                for (var i = 0; i < data.children.length; i++) {
                    let node: json.NodeInfo = data.children[i];
                    let row: string = generateRow(i, node, newData, childCount, rowCount);
                    if (row.length != 0) {
                        output += row;
                        rowCount++;
                    }
                }
            }

            if (edit.isInsertAllowed(data.node)) {
                if (rowCount == 0 && !meta64.isAnonUser) {
                    output = getEmptyPagePrompt();
                }
            }

            util.setHtml("listView", output);

            if (meta64.codeFormatDirty) {
                prettyPrint();
            }

            $("a").attr("target", "_blank");

            /*
             * TODO-3: Instead of calling screenSizeChange here immediately, it would be better to set the image sizes
             * exactly on the attributes of each image, as the HTML text is rendered before we even call
             * setHtml, so that images always are GUARANTEED to render correctly immediately.
             */
            meta64.screenSizeChange();

            if (!meta64.getHighlightedNode()) {
                view.scrollToTop();
            } else {
                view.scrollToSelectedNode();
            }
        }

        export let generateRow = function(i: number, node: json.NodeInfo, newData: boolean, childCount: number, rowCount: number): string {

            if (meta64.isNodeBlackListed(node))
                return "";

            if (newData) {
                meta64.initNode(node, true);

                if (debug) {
                    console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
                }
            }

            rowCount++; // warning: this is the local variable/parameter
            var row = renderNodeAsListItem(node, i, childCount, rowCount);
            // console.log("row[" + rowCount + "]=" + row);
            return row;
        }

        export let getUrlForNodeAttachment = function(node: json.NodeInfo): string {
            return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
        }

        /* see also: makeImageTag() */
        export let adjustImageSize = function(node: json.NodeInfo): void {

            var elm = $("#" + node.imgId);
            if (elm) {
                // var width = elm.attr("width");
                // var height = elm.attr("height");
                // console.log("width=" + width + " height=" + height);

                if (node.width && node.height) {

                    /*
                     * New Logic is try to display image at 150% meaning it can go outside the content div it's in,
                     * which we want, but then we also limit it with max-width so on smaller screen devices or small
                     * window resizings even on desktop browsers the image will always be entirely visible and not
                     * clipped.
                     */
                    // var maxWidth = meta64.deviceWidth - 80;
                    // elm.attr("width", "150%");
                    // elm.attr("height", "auto");
                    // elm.attr("style", "max-width: " + maxWidth + "px;");
                    /*
                     * DO NOT DELETE (for a long time at least) This is the old logic for resizing images responsively,
                     * and it works fine but my new logic is better, with limiting max width based on screen size. But
                     * keep this old code for now..
                     */
                    if (node.width > meta64.deviceWidth - 80) {

                        /* set the width we want to go for */
                        // var width = meta64.deviceWidth - 80;
                        /*
                         * and set the height to the value it needs to be at for same w/h ratio (no image stretching)
                         */
                        // var height = width * node.height / node.width;
                        elm.attr("width", "100%");
                        elm.attr("height", "auto");
                        // elm.attr("style", "max-width: " + maxWidth + "px;");
                    }
                    /*
                     * Image does fit on screen so render it at it's exact size
                     */
                    else {
                        elm.attr("width", node.width);
                        elm.attr("height", node.height);
                    }
                }
            }
        }

        /* see also: adjustImageSize() */
        export let makeImageTag = function(node: json.NodeInfo) {
            let src: string = getUrlForNodeAttachment(node);
            node.imgId = "imgUid_" + node.uid;

            if (node.width && node.height) {

                /*
                 * if image won't fit on screen we want to size it down to fit
                 *
                 * Yes, it would have been simpler to just use something like width=100% for the image width but then
                 * the hight would not be set explicitly and that would mean that as images are loading into the page,
                 * the effective scroll position of each row will be increasing each time the URL request for a new
                 * image completes. What we want is to have it so that once we set the scroll position to scroll a
                 * particular row into view, it will stay the correct scroll location EVEN AS the images are streaming
                 * in asynchronously.
                 *
                 */
                if (node.width > meta64.deviceWidth - 50) {

                    /* set the width we want to go for */
                    let width: number = meta64.deviceWidth - 50;

                    /*
                     * and set the height to the value it needs to be at for same w/h ratio (no image stretching)
                     */
                    let height: number = width * node.height / node.width;

                    return tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": width + "px",
                        "height": height + "px"
                    }, null, false);
                }
                /* Image does fit on screen so render it at it's exact size */
                else {
                    return tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": node.width + "px",
                        "height": node.height + "px"
                    }, null, false);
                }
            } else {
                return tag("img", {
                    "src": src,
                    "id": node.imgId
                }, null, false);
            }
        }

        /*
         * creates HTML tag with all attributes/values specified in attributes object, and closes the tag also if
         * content is non-null
         */
        export let tag = function(tag?: string, attributes?: Object, content?: string, closeTag?: boolean): string {

            /* default parameter values */
            if (typeof (closeTag) === 'undefined')
                closeTag = true;

            /* HTML tag itself */
            let ret: string = "<" + tag;

            if (attributes) {
                ret += " ";
                $.each(attributes, function(k, v) {
                    if (v) {
                        /*
                         * we intelligently wrap strings that contain single quotes in double quotes and vice versa
                         */
                        if (v.contains("'")) {
                            ret += k + "=\"" + v + "\" ";
                        } else {
                            ret += k + "='" + v + "' ";
                        }
                    } else {
                        ret += k + " ";
                    }
                });
            }

            if (closeTag) {
                ret += ">" + content + "</" + tag + ">";
            } else {
                ret += "/>";
            }

            return ret;
        }

        export let makeTextArea = function(fieldName: string, fieldId: string): string {
            return tag("paper-textarea", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        }

        export let makeEditField = function(fieldName: string, fieldId: string): string {
            return tag("paper-input", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        }

        export let makePasswordField = function(fieldName: string, fieldId: string): string {
            return tag("paper-input", {
                "type": "password",
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        }

        export let makeButton = function(text: string, id: string, callback: any): string {
            let attribs: Object = {
                "raised": "raised",
                "id": id
            };

            if (callback != undefined) {
                attribs["onClick"] = callback;
            }

            return tag("paper-button", attribs, text, true);
        }

        /*
         * domId is id of dialog being closed.
         */
        export let makeBackButton = function(text: string, id: string, domId: string, callback: any): string {

            if (callback === undefined) {
                callback = "";
            }

            return tag("paper-button", {
                "raised": "raised",
                "id": id,
                "onClick": "m64.meta64.cancelDialog('" + domId + "');" + callback
            }, text, true);
        }

        export let allowPropertyToDisplay = function(propName: string): boolean {
            if (!meta64.inSimpleMode())
                return true;
            return meta64.simpleModePropertyBlackList[propName] == null;
        }

        export let isReadOnlyProperty = function(propName: string): boolean {
            return meta64.readOnlyPropertyList[propName];
        }

        export let isBinaryProperty = function(propName: string): boolean {
            return meta64.binaryPropertyList[propName];
        }

        export let sanitizePropertyName = function(propName: string): string {
            if (meta64.editModeOption === "simple") {
                return propName === jcrCnst.CONTENT ? "Content" : propName;
            } else {
                return propName;
            }
        }
    }
}
