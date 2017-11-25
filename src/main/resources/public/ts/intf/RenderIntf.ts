console.log("RenderIntf.ts");

import * as I from "../Interfaces";
// import { MessageDlg } from "./dlg/MessageDlg";
// import { Comp } from "./widget/base/Comp";
// import { Button } from "./widget/Button";
 import { ButtonBar } from "../widget/ButtonBar";
// import { Checkbox } from "./widget/Checkbox";
 import { Div } from "../widget/Div";
// import { Span } from "./widget/Span";
import { Img } from "../widget/Img";
// import { Anchor } from "./widget/Anchor";
// import { Heading } from "./widget/Heading";
// import { VerticalDivs } from "./widget/VerticalDivs";
// import { Constants as cnst } from "./Constants";

export interface RenderIntf {
     postConstruct(_f: any) ;    

    /*
     * Important little method here. All GUI page/divs are created using this sort of specification here that they
     * all must have a 'build' method that is called first time only, and then the 'init' method called before each
     * time the component gets displayed with new information.
     *
     * If 'data' is provided, this is the instance data for the dialog
     * 
     * todo-0: wtf, there's a typo in this method name. how the hell is this working?
     */
    buidPage (pg, data): void ;

    buildRowHeader (node: I.NodeInfo, showPath: boolean, showName: boolean): Div ;

    injectSubstitutions (content: string): string ;

    /* after a property, or node is updated (saved) we can now call this method instead of refreshing the entire page
    which is what's done in most of the app, which is much less efficient and snappy visually */
    refreshNodeOnPage (node: I.NodeInfo): void ;
    /*
     * This is the function that renders each node in the main window. The rendering in here is very central to the
     * app and is what the user sees covering 90% of the screen most of the time. The "content* nodes.
     *
     * todo-1: Rather than having this node renderer itself be responsible for rendering all the different types
     * of nodes, need a more pluggable design, where rendering of different things is delegated to some
     * appropriate object/service
     */
    renderNodeContent (node: I.NodeInfo, showPath, showName, renderBin, rowStyling, showHeader): string ;

    renderJsonFileSearchResultProperty (jsonContent: string): string ;

    /*
     * This is the primary method for rendering each node (like a row) on the main HTML page that displays node
     * content. This generates the HTML for a single row/node.
     *
     * node is a NodeInfo.java JSON
     */
    renderNodeAsListItem (node: I.NodeInfo, index: number, count: number, rowCount: number): string ;
    showNodeUrl () ;

    getTopRightImageTag (node: I.NodeInfo): Img ;

    getNodeBkgImageStyle (node: I.NodeInfo): string ;

    centeredButtonBar (buttons?: string, classes?: string): string ;

    centerContent (content: string, width: number): string ;
    buttonBar (buttons: string, classes: string): string ;

    makeRowButtonBar (node: I.NodeInfo, canMoveUp: boolean, canMoveDown: boolean, editingAllowed: boolean): ButtonBar ;

    makeHorizontalFieldSet (content?: string, extraClasses?: string): string ;

    makeHorzControlGroup (content: string): string ;

    makeRadioButton (label: string, id: string): string ;

    /*
     * Returns true if the nodeId (see makeNodeId()) NodeInfo object has 'hasChildren' true
     */
    nodeHasChildren (uid: string): boolean ;
    /*
     * Renders page and always also takes care of scrolling to selected node if there is one to scroll to
     */
    renderPageFromData (data?: I.RenderNodeResponse, scrollToTop?: boolean): string ;
    firstPage (): void ;

    prevPage (): void ;

    nextPage (): void ;

    lastPage (): void ;

    generateRow (i: number, node: I.NodeInfo, newData: boolean, childCount: number, rowCount: number): string ;
    getUrlForNodeAttachment (node: I.NodeInfo): string ;

    /* see also: makeImageTag() */
    adjustImageSize (node: I.NodeInfo): void ;
    /* see also: adjustImageSize() */
    makeImageTag (node: I.NodeInfo): Img ;
    makeImageTag_original (node: I.NodeInfo) ;

    /*
     * creates HTML tag with all attributes/values specified in attributes object, and closes the tag also if
     * content is non-null.
     * 
     * todo-0: Is there a pure JS way (or i can use React) to render a Node like this? If the browser
     * has a function for creating an element like this it will perform MUCH better than us
     * building our own string here. Of course the fancy stuff hooking up functions would need to 
     * be pre-processed and still done by us here.
     */
    tag (tag: string, attributes?: Object, content?: string, closeTag?: boolean): string ;

    makeTextArea (fieldName: string, fieldId: string): string ;

    makeButton (text: string, id: string, callback: Function): string ;

    allowPropertyToDisplay (propName: string): boolean ;

    isReadOnlyProperty (propName: string): boolean ;

    isBinaryProperty (propName: string): boolean ;

    sanitizePropertyName (propName: string): string ;
}
