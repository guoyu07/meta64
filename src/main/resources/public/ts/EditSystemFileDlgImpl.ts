console.log("EditSystemFileDlgImpl.ts");

import {DialogBaseImpl} from "./DialogBaseImpl";
import {EditSystemFileDlg} from "./EditSystemFileDlg";

export default class EditSystemFileDlgImpl extends DialogBaseImpl implements EditSystemFileDlg {
  //
  //   constructor(private fileName: string) {
  //       super("EditSystemFileDlg");
  //   }
  //
  //   /*
  //    * Returns a string that is the HTML content of the dialog
  //    */
  //   build = (): string => {
  //       let content: string = "<h2>File Editor: " + this.fileName + "</h2>";
  //
  //       let buttons = this.makeCloseButton("Save", "SaveFileButton", this.saveEdit)
  //           + this.makeCloseButton("Cancel", "CancelFileEditButton", this.cancelEdit);
  //       content += render.centeredButtonBar(buttons);
  //
  //       return content;
  //   }
  //
  //   saveEdit = (): void => {
  //       console.log("save.");
  //   }
  //
  //   cancelEdit = (): void => {
  //       console.log("cancel.");
  //   }
  //
  //   init = (): void => {
  //   }
}
