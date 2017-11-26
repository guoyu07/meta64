console.log("RenderIntf.ts");

import * as I from "../Interfaces";
import { ButtonBar } from "../widget/ButtonBar";
import { Div } from "../widget/Div";
import { Img } from "../widget/Img";

export interface RenderIntf {
    postConstruct(_f: any);
    buidPage(pg, data): void;
    buildRowHeader(node: I.NodeInfo, showPath: boolean, showName: boolean): Div;
    injectSubstitutions(content: string): string;
    refreshNodeOnPage(node: I.NodeInfo): void;
    renderNodeContent(node: I.NodeInfo, showPath, showName, renderBin, rowStyling, showHeader): string;
    renderJsonFileSearchResultProperty(jsonContent: string): string;
    renderNodeAsListItem(node: I.NodeInfo, index: number, count: number, rowCount: number): string;
    showNodeUrl();
    getTopRightImageTag(node: I.NodeInfo): Img;
    getNodeBkgImageStyle(node: I.NodeInfo): string;
    centeredButtonBar(buttons?: string, classes?: string): string;
    centerContent(content: string, width: number): string;
    buttonBar(buttons: string, classes: string): string;
    makeRowButtonBar(node: I.NodeInfo, canMoveUp: boolean, canMoveDown: boolean, editingAllowed: boolean): ButtonBar;
    makeHorizontalFieldSet(content?: string, extraClasses?: string): string;
    makeHorzControlGroup(content: string): string;
    makeRadioButton(label: string, id: string): string;
    nodeHasChildren(uid: string): boolean;
    renderPageFromData(data?: I.RenderNodeResponse, scrollToTop?: boolean): string;
    firstPage(): void;
    prevPage(): void;
    nextPage(): void;
    lastPage(): void;
    generateRow(i: number, node: I.NodeInfo, newData: boolean, childCount: number, rowCount: number): string;
    getUrlForNodeAttachment(node: I.NodeInfo): string;
    adjustImageSize(node: I.NodeInfo): void;
    makeImageTag(node: I.NodeInfo): Img;
    makeImageTag_original(node: I.NodeInfo);
    tag(tag: string, attributes?: Object, content?: string, closeTag?: boolean): string;
    makeTextArea(fieldName: string, fieldId: string): string;
    makeButton(text: string, id: string, callback: Function): string;
    allowPropertyToDisplay(propName: string): boolean;
    isReadOnlyProperty(propName: string): boolean;
    isBinaryProperty(propName: string): boolean;
    sanitizePropertyName(propName: string): string;
}
