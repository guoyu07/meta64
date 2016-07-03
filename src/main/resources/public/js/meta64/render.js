console.log("running module: render.js");
var Render = (function () {
    function Render() {
        this._debug = false;
    }
    Render.prototype._getEmptyPagePrompt = function () {
        return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
    };
    Render.prototype._renderBinary = function (node) {
        if (node.binaryIsImage) {
            return this.makeImageTag(node);
        }
        else {
            var anchor = render.tag("a", {
                "href": render.getUrlForNodeAttachment(node)
            }, "[Download Attachment]");
            return render.tag("div", {
                "class": "binary-link"
            }, anchor);
        }
    };
    Render.prototype.buidPage = function (pg, data) {
        console.log("buildPage: pg.domId=" + pg.domId);
        if (!pg.built || data) {
            pg.build(data);
            pg.built = true;
        }
        if (pg.init) {
            pg.init(data);
        }
    };
    Render.prototype.buildRowHeader = function (node, showPath, showName) {
        var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        var headerText = "";
        if (cnst.SHOW_PATH_ON_ROWS) {
            headerText += "<div class='path-display'>Path: " + this.formatPath(node) + "</div>";
        }
        headerText += "<div>";
        if (commentBy) {
            var clazz = (commentBy === meta64.userName) ? "created-by-me" : "created-by-other";
            headerText += "<span class='" + clazz + "'>Comment By: " + commentBy + "</span>";
        }
        else if (node.createdBy) {
            var clazz = (node.createdBy === meta64.userName) ? "created-by-me" : "created-by-other";
            headerText += "<span class='" + clazz + "'>Created By: " + node.createdBy + "</span>";
        }
        headerText += "<span id='ownerDisplay" + node.uid + "'></span>";
        if (node.lastModified) {
            headerText += "  Mod: " + node.lastModified;
        }
        headerText += "</div>";
        if (showName && !showPath && node.name) {
            headerText += "Name: " + node.name + " [uid=" + node.uid + "]";
        }
        headerText = this.tag("div", {
            "class": "header-text"
        }, headerText);
        return headerText;
    };
    Render.prototype.injectCodeFormatting = function (content) {
        if (content.contains("<code")) {
            meta64.codeFormatDirty = true;
            content = this.encodeLanguages(content);
            content = content.replaceAll("</code>", "</pre>");
        }
        return content;
    };
    Render.prototype.injectSubstitutions = function (content) {
        return content.replaceAll("{{locationOrigin}}", window.location.origin);
    };
    Render.prototype.encodeLanguages = function (content) {
        var langs = ["js", "html", "htm", "css"];
        for (var i = 0; i < langs.length; i++) {
            content = content.replaceAll("<code class=\"" + langs[i] + "\">", "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
        }
        content = content.replaceAll("<code>", "<pre class='prettyprint'>");
        return content;
    };
    Render.prototype.renderNodeContent = function (node, showPath, showName, renderBinary, rowStyling, showHeader) {
        var ret = this.getTopRightImageTag(node);
        ret += showHeader ? this.buildRowHeader(node, showPath, showName) : "";
        if (meta64.showProperties) {
            var properties = props.renderProperties(node.properties);
            if (properties) {
                ret += properties;
            }
        }
        else {
            var contentProp = props.getNodeProperty(jcrCnst.CONTENT, node);
            if (contentProp) {
                var jcrContent = props.renderProperty(contentProp);
                jcrContent = "<div>" + jcrContent + "</div>";
                if (jcrContent.length > 0) {
                    if (meta64.serverMarkdown) {
                        jcrContent = this.injectCodeFormatting(jcrContent);
                        jcrContent = this.injectSubstitutions(jcrContent);
                        if (rowStyling) {
                            ret += this.tag("div", {
                                "class": "jcr-content"
                            }, jcrContent);
                        }
                        else {
                            ret += this.tag("div", {
                                "class": "jcr-root-content"
                            }, "<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"
                                + jcrContent);
                        }
                    }
                    else {
                        if (rowStyling) {
                            ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                            ret += this.tag("script", {
                                "type": "text/markdown"
                            }, jcrContent);
                        }
                        else {
                            ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                            ret += this.tag("script", {
                                "type": "text/markdown"
                            }, "<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"
                                + jcrContent);
                        }
                        ret += "</div></marked-element>";
                    }
                }
                else {
                    ret += "<div>[No Content Text]</div>";
                    var properties = props.renderProperties(node.properties);
                    if (properties) {
                        ret += properties;
                    }
                }
            }
            else {
                if (node.path.trim() == "/") {
                    ret += "Root Node";
                }
                var properties = props.renderProperties(node.properties);
                if (properties) {
                    ret += properties;
                }
            }
        }
        if (renderBinary && node.hasBinary) {
            var binary = this._renderBinary(node);
            if (ret.contains(cnst.INSERT_ATTACHMENT)) {
                ret = ret.replaceAll(cnst.INSERT_ATTACHMENT, binary);
            }
            else {
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
    };
    Render.prototype.renderNodeAsListItem = function (node, index, count, rowCount) {
        var uid = node.uid;
        var canMoveUp = index > 0 && rowCount > 1;
        var canMoveDown = index < count - 1;
        var isRep = node.name.startsWith("rep:") ||
            node.path.contains("/rep:");
        var editingAllowed = props.isOwnedCommentNode(node);
        if (!editingAllowed) {
            editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                && !props.isNonOwnedNode(node);
        }
        var focusNode = meta64.getHighlightedNode();
        var selected = (focusNode && focusNode.uid === uid);
        var buttonBarHtmlRet = this.makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
        var bkgStyle = this.getNodeBkgImageStyle(node);
        var cssId = uid + "_row";
        return this.tag("div", {
            "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
            "onClick": "nav.clickOnNodeRow(this, '" + uid + "');",
            "id": cssId,
            "style": bkgStyle
        }, buttonBarHtmlRet + this.tag("div", {
            "id": uid + "_content"
        }, this.renderNodeContent(node, true, true, true, true, true)));
    };
    Render.prototype.showNodeUrl = function () {
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
    };
    Render.prototype.getTopRightImageTag = function (node) {
        var topRightImg = props.getNodePropertyVal('img.top.right', node);
        var topRightImgTag = "";
        if (topRightImg) {
            topRightImgTag = this.tag("img", {
                "src": topRightImg,
                "class": "top-right-image"
            }, "", false);
        }
        return topRightImgTag;
    };
    Render.prototype.getNodeBkgImageStyle = function (node) {
        var bkgImg = props.getNodePropertyVal('img.node.bkg', node);
        var bkgImgStyle = "";
        if (bkgImg) {
            bkgImgStyle = "background-image: url(" + bkgImg + ");";
        }
        return bkgImgStyle;
    };
    Render.prototype.centeredButtonBar = function (buttons, classes) {
        classes = classes || "";
        return this.tag("div", {
            "class": "horizontal center-justified layout " + classes
        }, buttons);
    };
    Render.prototype.buttonBar = function (buttons, classes) {
        classes = classes || "";
        return this.tag("div", {
            "class": "horizontal left-justified layout " + classes
        }, buttons);
    };
    Render.prototype.makeRowButtonBarHtml = function (node, canMoveUp, canMoveDown, editingAllowed) {
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
        if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
            replyButton = this.tag("paper-button", {
                "raised": "raised",
                "onClick": "edit.replyToComment('" + node.uid + "');"
            }, "Reply");
        }
        var buttonCount = 0;
        if (this.nodeHasChildren(node.uid)) {
            buttonCount++;
            openButton = this.tag("paper-button", {
                "class": "highlight-button",
                "raised": "raised",
                "onClick": "nav.openNode('" + node.uid + "');"
            }, "Open");
        }
        if (meta64.editMode) {
            var selected = meta64.selectedNodes[node.uid] ? true : false;
            buttonCount++;
            var css = selected ? {
                "id": node.uid + "_sel",
                "onClick": "nav.toggleNodeSel('" + node.uid + "');",
                "checked": "checked"
            } :
                {
                    "id": node.uid + "_sel",
                    "onClick": "nav.toggleNodeSel('" + node.uid + "');"
                };
            selButton = this.tag("paper-checkbox", css, "");
            if (cnst.NEW_ON_TOOLBAR && !commentBy) {
                buttonCount++;
                createSubNodeButton = this.tag("paper-button", {
                    "id": "addNodeButtonId" + node.uid,
                    "raised": "raised",
                    "onClick": "edit.createSubNode('" + node.uid + "');"
                }, "Add");
            }
            if (cnst.INS_ON_TOOLBAR && !commentBy) {
                buttonCount++;
                insertNodeButton = this.tag("paper-button", {
                    "id": "insertNodeButtonId" + node.uid,
                    "raised": "raised",
                    "onClick": "edit.insertNode('" + node.uid + "');"
                }, "Ins");
            }
        }
        if (meta64.editMode && editingAllowed) {
            buttonCount++;
            editNodeButton = this.tag("paper-button", {
                "raised": "raised",
                "onClick": "edit.runEditNode('" + node.uid + "');"
            }, "Edit");
            if (meta64.currentNode.childrenOrdered && !commentBy) {
                if (canMoveUp) {
                    buttonCount++;
                    moveNodeUpButton = this.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.moveNodeUp('" + node.uid + "');"
                    }, "Up");
                }
                if (canMoveDown) {
                    buttonCount++;
                    moveNodeDownButton = this.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.moveNodeDown('" + node.uid + "');"
                    }, "Dn");
                }
            }
        }
        var insertNodeTooltip = "";
        var addNodeTooltip = "";
        var allButtons = selButton + openButton + insertNodeButton + createSubNodeButton + insertNodeTooltip
            + addNodeTooltip + editNodeButton + moveNodeUpButton + moveNodeDownButton + replyButton;
        return allButtons.length > 0 ? this.makeHorizontalFieldSet(allButtons) : "";
    };
    Render.prototype.makeHorizontalFieldSet = function (content, extraClasses) {
        return this.tag("div", {
            "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
        }, content, true);
    };
    Render.prototype.makeHorzControlGroup = function (content) {
        return this.tag("div", {
            "class": "horizontal layout"
        }, content, true);
    };
    Render.prototype.makeRadioButton = function (label, id) {
        return this.tag("paper-radio-button", {
            "id": id,
            "name": id
        }, label);
    };
    Render.prototype.nodeHasChildren = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (!node) {
            console.log("Unknown nodeId in nodeHasChildren: " + uid);
            return false;
        }
        else {
            return node.hasChildren;
        }
    };
    Render.prototype.formatPath = function (node) {
        var path = node.path;
        path = path.replaceAll("/", " / ");
        var shortPath = path.length < 50 ? path : path.substring(0, 40) + "...";
        var noRootPath = shortPath;
        if (noRootPath.startsWith("/root")) {
            noRootPath = noRootPath.substring(0, 5);
        }
        var ret = meta64.isAdminUser ? shortPath : noRootPath;
        ret += " [" + node.primaryTypeName + "]";
        return ret;
    };
    Render.prototype.wrapHtml = function (text) {
        return "<div>" + text + "</div>";
    };
    Render.prototype.renderMainPageControls = function () {
        var html = '';
        var hasContent = html.length > 0;
        if (hasContent) {
            util.setHtmlEnhanced("mainPageControls", html);
        }
        util.setVisibility("#mainPageControls", hasContent);
    };
    Render.prototype.renderPageFromData = function (data) {
        meta64.codeFormatDirty = false;
        console.log("render.renderPageFromData()");
        var newData = false;
        if (!data) {
            data = meta64.currentNodeData;
        }
        else {
            newData = true;
        }
        if (!data || !data.node) {
            util.setVisibility("#listView", false);
            $("#mainNodeContent").html("No content is available here.");
            return;
        }
        else {
            util.setVisibility("#listView", true);
        }
        this.renderMainPageControls();
        meta64.treeDirty = false;
        if (newData) {
            meta64.uidToNodeMap = {};
            meta64.idToNodeMap = {};
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
        var mainNodeContent = this.renderNodeContent(data.node, true, true, true, false, true);
        if (mainNodeContent.length > 0) {
            var uid = data.node.uid;
            var cssId = uid + "_row";
            var buttonBar = "";
            var editNodeButton = "";
            var createSubNodeButton = "";
            var replyButton = "";
            var createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, data.node);
            var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, data.node);
            var publicAppend = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, data.node);
            if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
                replyButton = this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.replyToComment('" + data.node.uid + "');"
                }, "Reply");
            }
            if (meta64.editMode && cnst.NEW_ON_TOOLBAR && edit.isInsertAllowed(data.node)) {
                createSubNodeButton = this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.createSubNode('" + uid + "');"
                }, "Add");
            }
            if (edit.isEditAllowed(data.node)) {
                editNodeButton = this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.runEditNode('" + uid + "');"
                }, "Edit");
            }
            var focusNode = meta64.getHighlightedNode();
            var selected = focusNode && focusNode.uid === uid;
            if (createSubNodeButton || editNodeButton || replyButton) {
                buttonBar = this.makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
            }
            var content = this.tag("div", {
                "class": (selected ? "mainNodeContentStyle active-row" : "mainNodeContentStyle inactive-row"),
                "onClick": "nav.clickOnNodeRow(this, '" + uid + "');",
                "id": cssId
            }, buttonBar + mainNodeContent);
            $("#mainNodeContent").show();
            $("#mainNodeContent").html(content);
        }
        else {
            $("#mainNodeContent").hide();
        }
        view.updateStatusBar();
        this.renderMainPageControls();
        var rowCount = 0;
        if (data.children) {
            var childCount = data.children.length;
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
        meta64.screenSizeChange();
        if (!meta64.getHighlightedNode()) {
            view.scrollToTop();
        }
        else {
            view.scrollToSelectedNode();
        }
    };
    Render.prototype.generateRow = function (i, node, newData, childCount, rowCount) {
        if (meta64.isNodeBlackListed(node))
            return "";
        if (newData) {
            meta64.initNode(node);
            if (this._debug) {
                console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
            }
        }
        rowCount++;
        var row = this.renderNodeAsListItem(node, i, childCount, rowCount);
        return row;
    };
    Render.prototype.getUrlForNodeAttachment = function (node) {
        return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
    };
    Render.prototype.adjustImageSize = function (node) {
        var elm = $("#" + node.imgId);
        if (elm) {
            if (node.width && node.height) {
                if (node.width > meta64.deviceWidth - 80) {
                    elm.attr("width", "100%");
                    elm.attr("height", "auto");
                }
                else {
                    elm.attr("width", node.width);
                    elm.attr("height", node.height);
                }
            }
        }
    };
    Render.prototype.makeImageTag = function (node) {
        var src = this.getUrlForNodeAttachment(node);
        node.imgId = "imgUid_" + node.uid;
        if (node.width && node.height) {
            if (node.width > meta64.deviceWidth - 50) {
                var width = meta64.deviceWidth - 50;
                var height = width * node.height / node.width;
                return this.tag("img", {
                    "src": src,
                    "id": node.imgId,
                    "width": width + "px",
                    "height": height + "px"
                }, null, false);
            }
            else {
                return this.tag("img", {
                    "src": src,
                    "id": node.imgId,
                    "width": node.width + "px",
                    "height": node.height + "px"
                }, null, false);
            }
        }
        else {
            return this.tag("img", {
                "src": src,
                "id": node.imgId
            }, null, false);
        }
    };
    Render.prototype.tag = function (tag, attributes, content, closeTag) {
        if (typeof (closeTag) === 'undefined')
            closeTag = true;
        var ret = "<" + tag;
        if (attributes) {
            ret += " ";
            $.each(attributes, function (k, v) {
                if (v) {
                    if (v.contains("'")) {
                        ret += k + "=\"" + v + "\" ";
                    }
                    else {
                        ret += k + "='" + v + "' ";
                    }
                }
                else {
                    ret += k + " ";
                }
            });
        }
        if (closeTag) {
            ret += ">" + content + "</" + tag + ">";
        }
        else {
            ret += "/>";
        }
        return ret;
    };
    Render.prototype.makeTextArea = function (fieldName, fieldId) {
        return this.tag("paper-textarea", {
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    };
    Render.prototype.makeEditField = function (fieldName, fieldId) {
        return this.tag("paper-input", {
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    };
    Render.prototype.makePasswordField = function (fieldName, fieldId) {
        return this.tag("paper-input", {
            "type": "password",
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    };
    Render.prototype.makeButton = function (text, id, callback) {
        var attribs = {
            "raised": "raised",
            "id": id
        };
        if (callback != undefined) {
            attribs["onClick"] = callback;
        }
        return this.tag("paper-button", attribs, text, true);
    };
    Render.prototype.makeBackButton = function (text, id, domId, callback) {
        if (callback === undefined) {
            callback = "";
        }
        return this.tag("paper-button", {
            "raised": "raised",
            "id": id,
            "onClick": "meta64.cancelDialog('" + domId + "');" + callback
        }, text, true);
    };
    Render.prototype.allowPropertyToDisplay = function (propName) {
        if (!meta64.inSimpleMode())
            return true;
        return meta64.simpleModePropertyBlackList[propName] == null;
    };
    Render.prototype.isReadOnlyProperty = function (propName) {
        return meta64.readOnlyPropertyList[propName];
    };
    Render.prototype.isBinaryProperty = function (propName) {
        return meta64.binaryPropertyList[propName];
    };
    Render.prototype.sanitizePropertyName = function (propName) {
        if (meta64.editModeOption === "simple") {
            return propName === jcrCnst.CONTENT ? "Content" : propName;
        }
        else {
            return propName;
        }
    };
    return Render;
}());
if (!window["render"]) {
    var render = new Render();
}
//# sourceMappingURL=render.js.map