console.log("running module: render.js");

declare var postTargetUrl;
declare var prettyPrint;

//&&&& I think just by importing cnst, now ALL other 'modules' have to be imported?? WTF. this should now be how they designed it.

//import { cnst } from "./cnst";

class Render {
    _debug: boolean = false;

	/*
	 * This is the content displayed when the user signs in, and we see that they have no content being displayed. We
	 * want to give them some instructions and the ability to add content.
	 */
    _getEmptyPagePrompt = () => {
        return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
    }

    _renderBinary = (node) => {
		/*
		 * If this is an image render the image directly onto the page as a visible image
		 */
        if (node.binaryIsImage) {
            return this.makeImageTag(node);
        }
		/*
		 * If not an image we render a link to the attachment, so that it can be downloaded.
		 */
        else {
            var anchor = render.tag("a", {
                "href": render.getUrlForNodeAttachment(node)
            }, "[Download Attachment]");

            return render.tag("div", {
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
    buidPage = (pg, data) => {
        console.log("buildPage: pg.domId=" + pg.domId);

        if (!pg.built || data) {
            pg.build(data);
            pg.built = true;
        }

        if (pg.init) {
            pg.init(data);
        }
    }

    buildRowHeader = (node, showPath, showName) => {
        var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);

        var headerText = "";

        if (cnst.SHOW_PATH_ON_ROWS) {
            headerText += "<div class='path-display'>Path: " + this.formatPath(node) + "</div>";
        }

        headerText += "<div>";

        if (commentBy) {
            var clazz = (commentBy === meta64.userName) ? "created-by-me" : "created-by-other";
            headerText += "<span class='" + clazz + "'>Comment By: " + commentBy + "</span>";
        } //
        else if (node.createdBy) {
            var clazz = (node.createdBy === meta64.userName) ? "created-by-me" : "created-by-other";
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

        headerText = this.tag("div", {
            "class": "header-text"
        }, headerText);

        return headerText;
    }

    /*
     * Pegdown markdown processor will create <code> blocks and the class if provided, so in order to get google
     * prettifier to process it the rest of the way (when we call prettyPrint() for the whole page) we now run
     * another stage of transformation to get the <pre> tag put in with 'prettyprint' etc.
     */
    injectCodeFormatting = (content) => {

        // example markdown:
        // ```js
        // var x = 10;
        // var y = "test";
        // ```
        //
        if (content.contains("<code")) {
            meta64.codeFormatDirty = true;
            content = this.encodeLanguages(content);
            content = content.replaceAll("</code>", "</pre>");
        }

        return content;
    }

    injectSubstitutions = (content) => {
        return content.replaceAll("{{locationOrigin}}", window.location.origin);
    }

    encodeLanguages = (content) => {
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

    /*
     * This is the function that renders each node in the main window. The rendering in here is very central to the
     * app and is what the user sees covering 90% of the screen most of the time. The "content* nodes.
     *
     * node: JSON of NodeInfo.java
     *
     */
    renderNodeContent = (node, showPath, showName, renderBinary, rowStyling, showHeader) => {
        var ret: string = this.getTopRightImageTag(node);

        /* todo-2: enable headerText when appropriate here */
        ret += showHeader ? this.buildRowHeader(node, showPath, showName) : "";

        if (meta64.showProperties) {
            var properties = props.renderProperties(node.properties);
            if (properties) {
                ret += /* "<br>" + */properties;
            }
        } else {
            var contentProp = props.getNodeProperty(jcrCnst.CONTENT, node);
            // console.log("contentProp: " + contentProp);
            if (contentProp) {

                var jcrContent = props.renderProperty(contentProp);
                jcrContent = "<div>" + jcrContent + "</div>"

                if (jcrContent.length > 0) {

                    if (meta64.serverMarkdown) {
                        jcrContent = this.injectCodeFormatting(jcrContent);
                        jcrContent = this.injectSubstitutions(jcrContent);

                        if (rowStyling) {
                            ret += this.tag("div", {
                                "class": "jcr-content"
                            }, jcrContent);
                        } else {
                            ret += this.tag("div", {
                                "class": "jcr-root-content"
                            },
                                // probably could use
                                // "img.top.right" feature for
                                // (Also need to make this a configurable option, because other clones of meta64 don't
                                // want my github link!)
                                "<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"
                                + jcrContent);
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
                            ret += this.tag("script", {
                                "type": "text/markdown"
                            }, jcrContent);
                        } else {
                            ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                            ret += this.tag("script", {
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
                } else {
                    ret += "<div>[No Content Text]</div>";
                    var properties = props.renderProperties(node.properties);
                    if (properties) {
                        ret += /* "<br>" + */properties;
                    }
                }

                /*
                 * if (jcrContent.length > 0) { if (rowStyling) { ret += this.tag("div", { "class" : "jcr-content" },
                 * jcrContent); } else { ret += this.tag("div", { "class" : "jcr-root-content" }, // probably could
                 * "img.top.right" feature for this // if we wanted to. oops. "<a
                 * href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png'
                 * class='corner-style'/></a>" + jcrContent); } }
                 */
            } else {
                if (node.path.trim() == "/") {
                    ret += "Root Node";
                }
                // ret += "<div>[No Content Property]</div>";
                var properties = props.renderProperties(node.properties);
                if (properties) {
                    ret += /* "<br>" + */properties;
                }
            }
        }

        if (renderBinary && node.hasBinary) {
            var binary = this._renderBinary(node);

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

        var tags = props.getNodePropertyVal(jcrCnst.TAGS, node);
        if (tags) {
            ret += this.tag("div", {
                "class": "tags-content"
            }, "Tags: " + tags);
        }

        return ret;
    }

    /*
     * This is the primary method for rendering each node (like a row) on the main HTML page that displays node
     * content. This generates the HTML for a single row/node.
     *
     * node is a NodeInfo.java JSON
     */
    renderNodeAsListItem = (node, index, count, rowCount) => {

        var uid = node.uid;
        var canMoveUp = index > 0 && rowCount > 1;
        var canMoveDown = index < count - 1;

        var isRep = node.name.startsWith("rep:") || /*
														 * meta64.currentNodeData. bug?
														 */node.path.contains("/rep:");

        var editingAllowed = props.isOwnedCommentNode(node);
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
        var focusNode = meta64.getHighlightedNode();
        var selected = (focusNode && focusNode.uid === uid);

        var buttonBarHtmlRet = this.makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
        var bkgStyle = this.getNodeBkgImageStyle(node);

        var cssId = uid + "_row";
        return this.tag("div", {
            "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
            "onClick": "nav.clickOnNodeRow(this, '" + uid + "');", //
            "id": cssId,
            "style": bkgStyle
        },//
            buttonBarHtmlRet + this.tag("div", {
                "id": uid + "_content"
            }, this.renderNodeContent(node, true, true, true, true, true)));
    }

    showNodeUrl = () => {
        var node = meta64.getHighlightedNode();
        if (!node) {
            (new MessageDlg("You must first click on a node.")).open();
            return;
        }

        var path = node.path.stripIfStartsWith("/root");
        var url = window.location.origin + "?id=" + path;
        meta64.selectTab("mainTabName");

        var message = "URL using path: <br>" + url;
        var uuid = props.getNodePropertyVal("jcr:uuid", node);
        if (uuid) {
            message += "<p>URL for UUID: <br>" + window.location.origin + "?id=" + uuid;
        }

        (new MessageDlg(message, "URL of Node")).open();
    }

    getTopRightImageTag = (node) => {
        var topRightImg = props.getNodePropertyVal('img.top.right', node);
        var topRightImgTag = "";
        if (topRightImg) {
            topRightImgTag = this.tag("img", {
                "src": topRightImg,
                "class": "top-right-image"
            }, "", false);
        }
        return topRightImgTag;
    }

    getNodeBkgImageStyle = (node) => {
        var bkgImg = props.getNodePropertyVal('img.node.bkg', node);
        var bkgImgStyle = "";
        if (bkgImg) {
            bkgImgStyle = "background-image: url(" + bkgImg + ");";
        }
        return bkgImgStyle;
    }

    centeredButtonBar = (buttons?: any, classes?: any) => {
        classes = classes || "";

        return this.tag("div", {
            "class": "horizontal center-justified layout " + classes
        }, buttons);
    }

    buttonBar = (buttons, classes) => {
        classes = classes || "";

        return this.tag("div", {
            "class": "horizontal left-justified layout " + classes
        }, buttons);
    }

    makeRowButtonBarHtml = (node, canMoveUp, canMoveDown, editingAllowed) => {

        var createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
        var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        var publicAppend = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, node);

        var openButton = "";
        var selButton = "";
        var createSubNodeButton = "";
        var editNodeButton = "";
        var moveNodeUpButton = "";
        var moveNodeDownButton = "";
        var insertNodeButton = "";
        var replyButton = "";

        /*
         * Show Reply button if this is a publicly appendable node and not created by current user,
         * or having been added as comment by current user
         */
        if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
            replyButton = this.tag("paper-button", {
                "raised": "raised",
                "onClick": "edit.replyToComment('" + node.uid + "');" //
            }, //
                "Reply");
        }

        var buttonCount = 0;

        /* Construct Open Button */
        if (this.nodeHasChildren(node.uid)) {
            buttonCount++;

            openButton = this.tag("paper-button", {
                "class": "highlight-button",
                "raised": "raised",
                "onClick": "nav.openNode('" + node.uid + "');"//
            }, //
                "Open");
        }

        /*
         * If in edit mode we always at least create the potential (buttons) for a user to insert content, and if
         * they don't have privileges the server side security will let them know. In the future we can add more
         * intelligence to when to show these buttons or not.
         */
        if (meta64.editMode) {
            // console.log("Editing allowed: " + nodeId);

            var selected = meta64.selectedNodes[node.uid] ? true : false;

            // console.log(" nodeId " + node.uid + " selected=" + selected);
            buttonCount++;

            var css = selected ? {
                "id": node.uid + "_sel",//
                "onClick": "nav.toggleNodeSel('" + node.uid + "');",
                "checked": "checked"
            } : //
                {
                    "id": node.uid + "_sel",//
                    "onClick": "nav.toggleNodeSel('" + node.uid + "');"
                };

            selButton = this.tag("paper-checkbox", css, "");

            if (cnst.NEW_ON_TOOLBAR && !commentBy) {
                /* Construct Create Subnode Button */
                buttonCount++;
                createSubNodeButton = this.tag("paper-button", {
                    "id": "addNodeButtonId" + node.uid,
                    "raised": "raised",
                    "onClick": "edit.createSubNode('" + node.uid + "');"
                }, "Add");
            }

            if (cnst.INS_ON_TOOLBAR && !commentBy) {
                buttonCount++;
                /* Construct Create Subnode Button */
                insertNodeButton = this.tag("paper-button", {
                    "id": "insertNodeButtonId" + node.uid,
                    "raised": "raised",
                    "onClick": "edit.insertNode('" + node.uid + "');"
                }, "Ins");
            }
        }

        if (meta64.editMode && editingAllowed) {
            buttonCount++;
            /* Construct Create Subnode Button */
            editNodeButton = this.tag("paper-button", //
                {
                    "raised": "raised",
                    "onClick": "edit.runEditNode('" + node.uid + "');"
                }, "Edit");

            if (meta64.currentNode.childrenOrdered && !commentBy) {

                if (canMoveUp) {
                    buttonCount++;
                    /* Construct Create Subnode Button */
                    moveNodeUpButton = this.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.moveNodeUp('" + node.uid + "');"
                    }, "Up");
                }

                if (canMoveDown) {
                    buttonCount++;
                    /* Construct Create Subnode Button */
                    moveNodeDownButton = this.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.moveNodeDown('" + node.uid + "');"
                    }, "Dn");
                }
            }
        }

        /*
         * i will be finding a reusable/DRY way of doing tooltops soon, this is just my first experiment.
         *
         * However tooltips ALWAYS cause problems. Mystery for now.
         */
        var insertNodeTooltip = "";
        //			 this.tag("paper-tooltip", {
        //			 "for" : "insertNodeButtonId" + node.uid
        //			 }, "INSERTS a new node at the current tree position. As a sibling on this level.");

        var addNodeTooltip = "";
        //			 this.tag("paper-tooltip", {
        //			 "for" : "addNodeButtonId" + node.uid
        //			 }, "ADDS a new node inside the current node, as a child of it.");

        var allButtons = selButton + openButton + insertNodeButton + createSubNodeButton + insertNodeTooltip
            + addNodeTooltip + editNodeButton + moveNodeUpButton + moveNodeDownButton + replyButton;

        return allButtons.length > 0 ? this.makeHorizontalFieldSet(allButtons) : "";
    }

    makeHorizontalFieldSet = (content?: string, extraClasses?: string) => {

        /* Now build entire control bar */
        return this.tag("div", //
            {
                "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
            }, content, true);
    }

    makeHorzControlGroup = (content) => {
        return this.tag("div", {
            "class": "horizontal layout"
        }, content, true);
    }

    makeRadioButton = (label, id) => {
        return this.tag("paper-radio-button", {
            "id": id,
            "name": id
        }, label);
    }

    /*
     * Returns true if the nodeId (see makeNodeId()) NodeInfo object has 'hasChildren' true
     */
    nodeHasChildren = (uid) => {
        var node = meta64.uidToNodeMap[uid];
        if (!node) {
            console.log("Unknown nodeId in nodeHasChildren: " + uid);
            return false;
        } else {
            return node.hasChildren;
        }
    }

    formatPath = (node) => {
        var path = node.path;

        /* we inject space in here so this string can wrap and not affect window sizes adversely, or need scrolling */
        path = path.replaceAll("/", " / ");
        var shortPath = path.length < 50 ? path : path.substring(0, 40) + "...";

        var noRootPath = shortPath;
        if (noRootPath.startsWith("/root")) {
            noRootPath = noRootPath.substring(0, 5);
        }

        var ret = meta64.isAdminUser ? shortPath : noRootPath;
        ret += " [" + node.primaryTypeName + "]";
        return ret;
    }

    wrapHtml = (text) => {
        return "<div>" + text + "</div>";
    }

    /*
     * Each page can show buttons at the top of it (not main header buttons but additional buttons just for that
     * page only, and this generates that content for that entire control bar.
     */
    renderMainPageControls = () => {
        var html = '';

        var hasContent = html.length > 0;
        if (hasContent) {
            util.setHtmlEnhanced("mainPageControls", html);
        }

        util.setVisibility("#mainPageControls", hasContent)
    }

    /*
     * Renders page and always also takes care of scrolling to selected node if there is one to scroll to
     */
    renderPageFromData = (data?: any) => {
        meta64.codeFormatDirty = false;
        console.log("render.renderPageFromData()");

        var newData = false;
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

        this.renderMainPageControls();
        meta64.treeDirty = false;

        if (newData) {
            meta64.uidToNodeMap = {};
            meta64.idToNodeMap = {};

            /*
             * I'm choosing to reset selected nodes when a new page loads, but this is not a requirement. I just
             * don't have a "clear selections" feature which would be needed so user has a way to clear out.
             */
            meta64.selectedNodes = {};

            meta64.initNode(data.node);
            meta64.setCurrentNodeData(data);
        }

        var propCount = meta64.currentNode.properties ? meta64.currentNode.properties.length : 0;

        if (this._debug) {
            console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
        }

        var output = '';
        var bkgStyle = this.getNodeBkgImageStyle(data.node);

        /*
         * NOTE: mainNodeContent is the parent node of the page content, and is always the node displayed at the to
         * of the page above all the other nodes which are its child nodes.
         */
        var mainNodeContent = this.renderNodeContent(data.node, true, true, true, false, true);

        //console.log("mainNodeContent: "+mainNodeContent);

        if (mainNodeContent.length > 0) {
            var uid = data.node.uid;
            var cssId = uid + "_row";
            var buttonBar = "";
            var editNodeButton = "";
            var createSubNodeButton = "";
            var replyButton = "";

            // console.log("data.node.path="+data.node.path);
            // console.log("isNonOwnedCommentNode="+props.isNonOwnedCommentNode(data.node));
            // console.log("isNonOwnedNode="+props.isNonOwnedNode(data.node));

            var createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, data.node);
            var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, data.node);
            var publicAppend = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, data.node);

            /*
             * Show Reply button if this is a publicly appendable node and not created by current user,
             * or having been added as comment by current user
             */

            if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
                replyButton = this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.replyToComment('" + data.node.uid + "');" //
                }, //
                    "Reply");
            }

            if (meta64.editMode && cnst.NEW_ON_TOOLBAR && edit.isInsertAllowed(data.node)) {
                createSubNodeButton = this.tag("paper-button", {
                    // "id" : "addNodeButtonId" + node.uid,
                    "raised": "raised",
                    "onClick": "edit.createSubNode('" + uid + "');"
                }, "Add");
            }

            /* Add edit button if edit mode and this isn't the root */
            if (edit.isEditAllowed(data.node)) {

                /* Construct Create Subnode Button */
                editNodeButton = this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.runEditNode('" + uid + "');"
                }, "Edit");
            }

            /* Construct Create Subnode Button */
            var focusNode = meta64.getHighlightedNode();
            var selected = focusNode && focusNode.uid === uid;
            // var rowHeader = this.buildRowHeader(data.node, true, true);

            if (createSubNodeButton || editNodeButton || replyButton) {
                buttonBar = this.makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
            }

            var content = this.tag("div", {
                "class": (selected ? "mainNodeContentStyle active-row" : "mainNodeContentStyle inactive-row"),
                "onClick": "nav.clickOnNodeRow(this, '" + uid + "');",
                "id": cssId
            },//
                buttonBar + mainNodeContent);

            $("#mainNodeContent").show();
            $("#mainNodeContent").html(content);
        } else {
            $("#mainNodeContent").hide();
        }

        // console.log("update status bar.");
        view.updateStatusBar();

        // console.log("rendering page controls.");
        this.renderMainPageControls();

        var rowCount = 0;
        if (data.children) {
            var childCount = data.children.length;
            // console.log("childCount: " + childCount);
            /*
             * Number of rows that have actually made it onto the page to far. Note: some nodes get filtered out on
             * the client side for various reasons.
             */
            var rowCount = 0;

            for (var i = 0; i < data.children.length; i++) {
                var node = data.children[i];
                var row = this.generateRow(i, node, newData, childCount, rowCount);
                if (row.length != 0) {
                    output += row;
                    rowCount++;
                }
            }
        }

        if (edit.isInsertAllowed(data.node)) {
            if (rowCount == 0 && !meta64.isAnonUser) {
                output = this._getEmptyPagePrompt();
            }
        }

        util.setHtmlEnhanced("listView", output);

        if (meta64.codeFormatDirty) {
            prettyPrint();
        }

        /*
         * TODO-3: Instead of calling screenSizeChange here immediately, it would be better to set the image sizes
         * exactly on the attributes of each image, as the HTML text is rendered before we even call
         * setHtmlEnhancedById, so that images always are GUARANTEED to render correctly immediately.
         */
        meta64.screenSizeChange();

        if (!meta64.getHighlightedNode()) {
            view.scrollToTop();
        } else {
            view.scrollToSelectedNode();
        }
    }

    generateRow = (i, node, newData, childCount, rowCount) => {

        if (meta64.isNodeBlackListed(node))
            return "";

        if (newData) {
            meta64.initNode(node);

            if (this._debug) {
                console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
            }
        }

        rowCount++; // warning: this is the local variable/parameter
        var row = this.renderNodeAsListItem(node, i, childCount, rowCount);
        // console.log("row[" + rowCount + "]=" + row);
        return row;
    }

    getUrlForNodeAttachment = (node) => {
        return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
    }

    /* see also: makeImageTag() */
    adjustImageSize = (node) => {

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
    makeImageTag = (node) => {
        var src = this.getUrlForNodeAttachment(node);
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
                var width = meta64.deviceWidth - 50;

                /*
                 * and set the height to the value it needs to be at for same w/h ratio (no image stretching)
                 */
                var height = width * node.height / node.width;

                return this.tag("img", {
                    "src": src,
                    "id": node.imgId,
                    "width": width + "px",
                    "height": height + "px"
                }, null, false);
            }
            /* Image does fit on screen so render it at it's exact size */
            else {
                return this.tag("img", {
                    "src": src,
                    "id": node.imgId,
                    "width": node.width + "px",
                    "height": node.height + "px"
                }, null, false);
            }
        } else {
            return this.tag("img", {
                "src": src,
                "id": node.imgId
            }, null, false);
        }
    }

    /*
     * creates HTML tag with all attributes/values specified in attributes object, and closes the tag also if
     * content is non-null
     */
    tag = (tag?: any, attributes?: any, content?: any, closeTag?: any) => {

        /* default parameter values */
        if (typeof (closeTag) === 'undefined')
            closeTag = true;

        /* HTML tag itself */
        var ret = "<" + tag;

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

    makeTextArea = (fieldName, fieldId) => {
        return this.tag("paper-textarea", {
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    }

    makeEditField = (fieldName, fieldId) => {
        return this.tag("paper-input", {
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    }

    makePasswordField = (fieldName, fieldId) => {
        return this.tag("paper-input", {
            "type": "password",
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    }

    makeButton = (text, id, callback) => {
        var attribs = {
            "raised": "raised",
            "id": id
        };

        if (callback != undefined) {
            attribs["onClick"] = callback;
        }

        return this.tag("paper-button", attribs, text, true);
    }

    /*
     * domId is id of dialog being closed.
     */
    makeBackButton = (text, id, domId, callback) => {

        if (callback === undefined) {
            callback = "";
        }

        return this.tag("paper-button", {
            "raised": "raised",
            "id": id,
            "onClick": "meta64.cancelDialog('" + domId + "');" + callback
        }, text, true);
    }

    allowPropertyToDisplay = (propName) => {
        if (!meta64.inSimpleMode())
            return true;
        return meta64.simpleModePropertyBlackList[propName] == null;
    }

    isReadOnlyProperty = (propName) => {
        return meta64.readOnlyPropertyList[propName];
    }

    isBinaryProperty = (propName) => {
        return meta64.binaryPropertyList[propName];
    }

    sanitizePropertyName = (propName: any) => {
        if (meta64.editModeOption === "simple") {
            return propName === jcrCnst.CONTENT ? "Content" : propName;
        } else {
            return propName;
        }
    }
}

if (!window["render"]) {
    var render: Render = new Render();
}
