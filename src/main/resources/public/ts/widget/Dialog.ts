console.log("Dialog.ts");

import * as React from 'react';
import { Comp } from "./base/Comp";
import { Div } from "../widget/Div";
import { CloserButton } from "../widget/CloserButton";
import { Heading } from "../widget/Heading";

declare var tag;

//ref: https://getbootstrap.com/docs/4.0/components/modal/

export class Dialog extends Comp {

  /* Due to limitation of bootstrap to only allow a single dialog at a time we have this stack
  that keeps track of which dialogs are open so that we can only show one of them at a time
  but have an entire stack 'live' at any given time. The impelementation of that stack logic is all
  contained in DialogBase.ts */
  public static stack: Dialog[] = [];

  constructor(private title: string, private sizeStyle: string="modal-lg") {
    //Note: we end up seeing ugly scrollbar overlap if we have less than 50px (significantly less) on the padding-right value.
    super({
      //"style": "margin:0 auto; padding-left:15px; padding-right:50px; max-width:900px; border:3px solid gray; with-backdrop:with-backdrop;",
      //"sourceClass": "Dialog"
    });
  }

  renderHtml = (): string => {
    let dlg = new Div(null, {
      class: "modal",
      tabindex: "-1",
      role: "dialog",
      "id": this.getId()
    },
      [
        new Div(null, {
          class: "modal-dialog "+this.sizeStyle, //modal-sm, modal-md, modal-lg
          role: "document"
        },
          [
            new Div(null, {
              class: "modal-content"
            },
              [
                new Div(null, {
                  class: "modal-header"
                },
                  [
                    new Heading(5, this.title, {
                      class: "modal-title",
                    }),
                    new CloserButton()
                  ]),
                new Div(null, {
                  class: "modal-body"
                }, this.children)
              ])
          ])
      ]);

    return dlg.renderHtml();
  }
}
