"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Comp.ts");
var React = require("react");
var ReactDOM = require("react-dom");
var Comp = (function (_super) {
    __extends(Comp, _super);
    function Comp(attribs, isReact) {
        if (isReact === void 0) { isReact = false; }
        var _this = _super.call(this, {}) || this;
        _this.isReact = isReact;
        _this.renderPending = false;
        _this.enabled = true;
        _this.visible = true;
        _this.setDomAttr = function (attrName, attrVal) {
            _this.whenElm(function (elm) {
                elm.setAttribute(attrName, attrVal);
                _this.attribs[attrName] = attrVal;
            });
        };
        _this.bindOnClick = function (callback) {
            domBind.addOnClick(_this.getId(), callback);
        };
        _this.removeAllChildren = function () {
            _this.children = [];
        };
        _this.getId = function () {
            return _this.attribs.id;
        };
        _this.getElement = function () {
            return document.querySelector("#" + _this.getId());
        };
        _this.whenElm = function (func) {
            domBind.whenElm(_this.getId(), func);
        };
        _this.setVisible = function (visible) {
            domBind.whenElm(_this.getId(), function (elm) {
                util.setElmDisplay(elm, visible);
            });
        };
        _this.setEnabled = function (enabled) {
            domBind.whenElm(_this.getId(), function (elm) {
                elm.disabled = !enabled;
            });
        };
        _this.setClass = function (clazz) {
            _this.attribs.class = clazz;
        };
        _this.setOnClick = function (onclick) {
            _this.attribs.onclick = onclick;
        };
        _this.renderToDom = function (elm) {
            if (_this.renderPending)
                return;
            elm = elm || _this.getElement();
            if (elm) {
                elm.innerHTML = _this.renderHtml();
                return;
            }
            _this.renderPending = true;
            domBind.whenElm(_this.getId(), function (elm) {
                elm.innerHTML = _this.renderHtml();
                _this.renderPending = false;
            });
        };
        _this.renderChildrenToDom = function (elm) {
            if (_this.renderPending)
                return;
            elm = elm || _this.getElement();
            if (elm) {
                elm.innerHTML = _this.renderChildren();
                return;
            }
            _this.renderPending = true;
            domBind.whenElm(_this.getId(), function (elm) {
                elm.innerHTML = _this.renderChildren();
                _this.renderPending = false;
            });
        };
        _this.setInnerHTML = function (html) {
            domBind.whenElm(_this.getId(), function (elm) {
                elm.innerHTML = html;
            });
        };
        _this.addChild = function (comp) {
            _this.children.push(comp);
        };
        _this.addChildren = function (comps) {
            _this.children.push.apply(_this.children, comps);
        };
        _this.setChildren = function (comps) {
            _this.children = comps || [];
        };
        _this.renderChildren = function () {
            if (_this.isReact) {
                throw "Don't call renderChildren on react component. Call reactRenderChildren instead.";
            }
            var html = "";
            util.forEachArrElm(_this.children, function (child, idx) {
                if (child) {
                    var childRender = child.renderHtml();
                    if (childRender) {
                        html += childRender;
                    }
                }
            });
            return html;
        };
        _this.reactRenderChildren = function () {
            if (!_this.isReact) {
                throw "Don't call reactRenderChildren on react component. Call renderChildren instead.";
            }
            var ret = [];
            util.forEachArrElm(_this.children, function (child, idx) {
                if (child) {
                    ret.push(child.reactRender());
                }
            });
            return ret;
        };
        _this.reactRender = function () {
            return null;
        };
        _this.renderHtml = function () {
            if (_this.isReact) {
                _this.whenElm(function () {
                    ReactDOM.render(_this.reactRender(), document.getElementById(_this.getId()));
                });
                return tag.div(_this.attribs, "");
            }
            else {
                return _this.renderChildren();
            }
        };
        _this.attribs = attribs || {};
        _this.children = [];
        var id = _this.attribs.id || "c" + Comp.nextGuid();
        _this.attribs.id = id;
        Comp.idToCompMap[id] = _this;
        return _this;
    }
    Comp.prototype.refreshState = function () {
        this.updateState();
        this.setVisible(this.visible);
        this.setEnabled(this.enabled);
        util.forEachArrElm(this.children, function (child, idx) {
            if (child) {
                child.refreshState();
            }
        });
    };
    Comp.prototype.setIsEnabledFunc = function (isEnabledFunc) {
        this.isEnabledFunc = isEnabledFunc;
    };
    Comp.prototype.setIsVisibleFunc = function (isVisibleFunc) {
        this.isVisibleFunc = isVisibleFunc;
    };
    Comp.prototype.updateState = function () {
        var ret = false;
        if (this.isEnabledFunc) {
            this.enabled = this.isEnabledFunc();
            ret = true;
        }
        if (this.isVisibleFunc) {
            this.visible = this.isVisibleFunc();
            ret = true;
        }
        return ret;
    };
    Comp.prototype.setVisibleIfAnyChildrenVisible = function () {
        var thisVisible = false;
        util.forEachArrElm(this.children, function (child, idx) {
            if (child) {
                if (child.visible) {
                    thisVisible = true;
                    return false;
                }
            }
        });
        this.setVisible(thisVisible);
    };
    Comp.nextGuid = function () {
        return ++Comp.guid;
    };
    Comp.findById = function (id) {
        return Comp.idToCompMap[id];
    };
    Comp.guid = 0;
    Comp.idToCompMap = {};
    return Comp;
}(React.Component));
exports.Comp = Comp;
//# sourceMappingURL=Comp.js.map