import {DialogBase} from "../DialogBase";

/*
NOTE: This dialog is not yet converted to new Widget Architecture (see ChangePasswordDlgImpl.ts for a working example of the
new architecture)
*/
export class SearchFilesDlg extends DialogBase {
  //
  //   constructor(private lucene: boolean) {
  //       super("SearchFilesDlg");
  //   }
  //
  //   /*
  //    * Returns a string that is the HTML content of the dialog
  //    */
  //   render = (): string => {
  //       var header = this.makeHeader("Search Files");
  //
  //       var instructions = this.makeMessageArea("Enter some text to find.");
  //       var formControls = this.makeEditField("Search", "searchText");
  //
  //       var searchButton = this.makeCloseButton("Search", "searchButton", this.searchTags.bind(this));
  //       var backButton = this.makeCloseButton("Close", "cancelSearchButton");
  //       var buttonBar = render.centeredButtonBar(searchButton + backButton);
  //
  //       var content = header + instructions + formControls + buttonBar;
  //       this.bindEnterKey("searchText", this.searchNodes)
  //       return content;
  //   }
  //
  //   searchTags = (): void => {
  //       return this.searchProperty(jcrCnst.TAGS);
  //   }
  //
  //   searchProperty = (searchProp: any) => {
  //       if (!util.ajaxReady("searchFiles")) {
  //           return;
  //       }
  //
  //       // until i get better validation
  //       var node = meta64.getHighlightedNode();
  //       if (!node) {
  //           (new MessageDlg("No node is selected to search under.")).open();
  //           return;
  //       }
  //
  //       // until better validation
  //       var searchText = this.getInputVal("searchText");
  //       if (util.emptyString(searchText)) {
  //           (new MessageDlg("Enter search text.")).open();
  //           return;
  //       }
  //
  //       let nodeId: string = null;
  //       let selNode: NodeInfo = meta64.getHighlightedNode();
  //       if (selNode) {
  //           nodeId = selNode.id;
  //       }
  //
  //       util.json<FileSearchRequest, FileSearchResponse>("fileSearch", {
  //           "nodeId": nodeId,
  //           "reindex": false,
  //           "searchText": searchText
  //       }, srch.searchFilesResponse, srch);
  //   }
  //
  //   init = (): void => {
  //       util.delayedFocus(this.id("searchText"));
  //   }
}
