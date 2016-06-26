console.log("running module: render.js");
var render = function () {
    var _debug = false;
    function _getEmptyPagePrompt() {
        return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
    }
    function _renderBinary(node) {
        if (node.binaryIsImage) {
            return _.makeImageTag(node);
        }
        else {
            var anchor = render.tag("a", {
                "href": render.getUrlForNodeAttachment(node)
            }, "[Download Attachment]");
            return render.tag("div", {
                "class": "binary-link"
            }, anchor);
        }
    }
    var _ = {
        buidPage: function (pg, data) {
            console.log("buildPage: pg.domId=" + pg.domId);
            if (!pg.built || data) {
                pg.build(data);
                pg.built = true;
            }
            if (pg.init) {
                pg.init(data);
            }
        },
        buildRowHeader: function (node, showPath, showName) {
            var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            var headerText = "";
            if (cnst.SHOW_PATH_ON_ROWS) {
                headerText += "<div class='path-display'>Path: " + _.formatPath(node) + "</div>";
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
            headerText = _.tag("div", {
                "class": "header-text"
            }, headerText);
            return headerText;
        },
        injectCodeFormatting: function (content) {
            if (content.contains("<code")) {
                meta64.codeFormatDirty = true;
                content = _.encodeLanguages(content);
                content = content.replaceAll("</code>", "</pre>");
            }
            return content;
        },
        injectSubstitutions: function (content) {
            return content.replaceAll("{{locationOrigin}}", window.location.origin);
        },
        encodeLanguages: function (content) {
            var langs = ["js", "html", "htm", "css"];
            for (var i = 0; i < langs.length; i++) {
                content = content.replaceAll("<code class=\"" + langs[i] + "\">", "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
            }
            content = content.replaceAll("<code>", "<pre class='prettyprint'>");
            return content;
        },
        renderNodeContent: function (node, showPath, showName, renderBinary, rowStyling, showHeader) {
            var ret = _.getTopRightImageTag(node);
            ret += showHeader ? _.buildRowHeader(node, showPath, showName) : "";
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
                            jcrContent = _.injectCodeFormatting(jcrContent);
                            jcrContent = _.injectSubstitutions(jcrContent);
                            if (rowStyling) {
                                ret += _.tag("div", {
                                    "class": "jcr-content"
                                }, jcrContent);
                            }
                            else {
                                ret += _.tag("div", {
                                    "class": "jcr-root-content"
                                }, "<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"
                                    + jcrContent);
                            }
                        }
                        else {
                            if (rowStyling) {
                                ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                                ret += _.tag("script", {
                                    "type": "text/markdown"
                                }, jcrContent);
                            }
                            else {
                                ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                                ret += _.tag("script", {
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
                var binary = _renderBinary(node);
                if (ret.contains(cnst.INSERT_ATTACHMENT)) {
                    ret = ret.replaceAll(cnst.INSERT_ATTACHMENT, binary);
                }
                else {
                    ret += binary;
                }
            }
            var tags = props.getNodePropertyVal(jcrCnst.TAGS, node);
            if (tags) {
                ret += _.tag("div", {
                    "class": "tags-content"
                }, "Tags: " + tags);
            }
            return ret;
        },
        renderNodeAsListItem: function (node, index, count, rowCount) {
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
            var buttonBarHtmlRet = _.makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
            var bkgStyle = _.getNodeBkgImageStyle(node);
            var cssId = uid + "_row";
            return _.tag("div", {
                "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
                "onClick": "nav.clickOnNodeRow(this, '" + uid + "');",
                "id": cssId,
                "style": bkgStyle
            }, buttonBarHtmlRet + _.tag("div", {
                "id": uid + "_content"
            }, _.renderNodeContent(node, true, true, true, true, true)));
        },
        showNodeUrl: function () {
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
        },
        getTopRightImageTag: function (node) {
            var topRightImg = props.getNodePropertyVal('img.top.right', node);
            var topRightImgTag = "";
            if (topRightImg) {
                topRightImgTag = _.tag("img", {
                    "src": topRightImg,
                    "class": "top-right-image"
                }, "", false);
            }
            return topRightImgTag;
        },
        getNodeBkgImageStyle: function (node) {
            var bkgImg = props.getNodePropertyVal('img.node.bkg', node);
            var bkgImgStyle = "";
            if (bkgImg) {
                bkgImgStyle = "background-image: url(" + bkgImg + ");";
            }
            return bkgImgStyle;
        },
        centeredButtonBar: function (buttons, classes) {
            classes = classes || "";
            return _.tag("div", {
                "class": "horizontal center-justified layout " + classes
            }, buttons);
        },
        buttonBar: function (buttons, classes) {
            classes = classes || "";
            return _.tag("div", {
                "class": "horizontal left-justified layout " + classes
            }, buttons);
        },
        makeRowButtonBarHtml: function (node, canMoveUp, canMoveDown, editingAllowed) {
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
                replyButton = _.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.replyToComment('" + node.uid + "');"
                }, "Reply");
            }
            var buttonCount = 0;
            if (_.nodeHasChildren(node.uid)) {
                buttonCount++;
                openButton = _.tag("paper-button", {
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
                selButton = _.tag("paper-checkbox", css, "");
                if (cnst.NEW_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    createSubNodeButton = _.tag("paper-button", {
                        "id": "addNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "edit.createSubNode('" + node.uid + "');"
                    }, "Add");
                }
                if (cnst.INS_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    insertNodeButton = _.tag("paper-button", {
                        "id": "insertNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "edit.insertNode('" + node.uid + "');"
                    }, "Ins");
                }
            }
            if (meta64.editMode && editingAllowed) {
                buttonCount++;
                editNodeButton = _.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.runEditNode('" + node.uid + "');"
                }, "Edit");
                if (meta64.currentNode.childrenOrdered && !commentBy) {
                    if (canMoveUp) {
                        buttonCount++;
                        moveNodeUpButton = _.tag("paper-button", {
                            "raised": "raised",
                            "onClick": "edit.moveNodeUp('" + node.uid + "');"
                        }, "Up");
                    }
                    if (canMoveDown) {
                        buttonCount++;
                        moveNodeDownButton = _.tag("paper-button", {
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
            return allButtons.length > 0 ? _.makeHorizontalFieldSet(allButtons) : "";
        },
        makeHorizontalFieldSet: function (content, extraClasses) {
            return _.tag("div", {
                "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
            }, content, true);
        },
        makeHorzControlGroup: function (content) {
            return _.tag("div", {
                "class": "horizontal layout"
            }, content, true);
        },
        makeRadioButton: function (label, id) {
            return _.tag("paper-radio-button", {
                "id": id,
                "name": id
            }, label);
        },
        nodeHasChildren: function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("Unknown nodeId in nodeHasChildren: " + uid);
                return false;
            }
            else {
                return node.hasChildren;
            }
        },
        formatPath: function (node) {
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
        },
        wrapHtml: function (text) {
            return "<div>" + text + "</div>";
        },
        renderMainPageControls: function () {
            var html = '';
            var hasContent = html.length > 0;
            if (hasContent) {
                util.setHtmlEnhanced("mainPageControls", html);
            }
            util.setVisibility("#mainPageControls", hasContent);
        },
        renderPageFromData: function (data) {
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
            _.renderMainPageControls();
            meta64.treeDirty = false;
            if (newData) {
                meta64.uidToNodeMap = {};
                meta64.idToNodeMap = {};
                meta64.selectedNodes = {};
                meta64.initNode(data.node);
                meta64.setCurrentNodeData(data);
            }
            var propCount = meta64.currentNode.properties ? meta64.currentNode.properties.length : 0;
            if (_debug) {
                console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
            }
            var output = '';
            var bkgStyle = _.getNodeBkgImageStyle(data.node);
            var mainNodeContent = _.renderNodeContent(data.node, true, true, true, false, true);
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
                    replyButton = _.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.replyToComment('" + data.node.uid + "');"
                    }, "Reply");
                }
                if (meta64.editMode && cnst.NEW_ON_TOOLBAR && edit.isInsertAllowed(data.node)) {
                    createSubNodeButton = _.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.createSubNode('" + uid + "');"
                    }, "Add");
                }
                if (edit.isEditAllowed(data.node)) {
                    editNodeButton = _.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.runEditNode('" + uid + "');"
                    }, "Edit");
                }
                var focusNode = meta64.getHighlightedNode();
                var selected = focusNode && focusNode.uid === uid;
                if (createSubNodeButton || editNodeButton || replyButton) {
                    buttonBar = _.makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
                }
                var content = _.tag("div", {
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
            _.renderMainPageControls();
            var rowCount = 0;
            if (data.children) {
                var childCount = data.children.length;
                var rowCount = 0;
                for (var i = 0; i < data.children.length; i++) {
                    var node = data.children[i];
                    var row = _.generateRow(i, node, newData, childCount, rowCount);
                    if (row.length != 0) {
                        output += row;
                        rowCount++;
                    }
                }
            }
            if (edit.isInsertAllowed(data.node)) {
                if (rowCount == 0 && !meta64.isAnonUser) {
                    output = _getEmptyPagePrompt();
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
        },
        generateRow: function (i, node, newData, childCount, rowCount) {
            if (meta64.isNodeBlackListed(node))
                return "";
            if (newData) {
                meta64.initNode(node);
                if (_debug) {
                    console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
                }
            }
            rowCount++;
            var row = _.renderNodeAsListItem(node, i, childCount, rowCount);
            return row;
        },
        getUrlForNodeAttachment: function (node) {
            return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
        },
        adjustImageSize: function (node) {
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
        },
        makeImageTag: function (node) {
            var src = _.getUrlForNodeAttachment(node);
            node.imgId = "imgUid_" + node.uid;
            if (node.width && node.height) {
                if (node.width > meta64.deviceWidth - 50) {
                    var width = meta64.deviceWidth - 50;
                    var height = width * node.height / node.width;
                    return _.tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": width + "px",
                        "height": height + "px"
                    }, null, false);
                }
                else {
                    return _.tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": node.width + "px",
                        "height": node.height + "px"
                    }, null, false);
                }
            }
            else {
                return _.tag("img", {
                    "src": src,
                    "id": node.imgId
                }, null, false);
            }
        },
        tag: function (tag, attributes, content, closeTag) {
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
        },
        makeTextArea: function (fieldName, fieldId) {
            return _.tag("paper-textarea", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        },
        makeEditField: function (fieldName, fieldId) {
            return _.tag("paper-input", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        },
        makePasswordField: function (fieldName, fieldId) {
            return _.tag("paper-input", {
                "type": "password",
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        },
        makeButton: function (text, id, callback) {
            var attribs = {
                "raised": "raised",
                "id": id
            };
            if (callback != undefined) {
                attribs["onClick"] = callback;
            }
            return _.tag("paper-button", attribs, text, true);
        },
        makeBackButton: function (text, id, domId, callback) {
            if (callback === undefined) {
                callback = "";
            }
            return _.tag("paper-button", {
                "raised": "raised",
                "id": id,
                "onClick": "meta64.cancelDialog('" + domId + "');" + callback
            }, text, true);
        },
        allowPropertyToDisplay: function (propName) {
            if (!meta64.inSimpleMode())
                return true;
            return meta64.simpleModePropertyBlackList[propName] == null;
        },
        isReadOnlyProperty: function (propName) {
            return meta64.readOnlyPropertyList[propName];
        },
        isBinaryProperty: function (propName) {
            return meta64.binaryPropertyList[propName];
        },
        sanitizePropertyName: function (propName) {
            if (meta64.editModeOption === "simple") {
                return propName === jcrCnst.CONTENT ? "Content" : propName;
            }
            else {
                return propName;
            }
        }
    };
    console.log("Module ready: render.js");
    return _;
}();
//# sourceMappingURL=render.js.map