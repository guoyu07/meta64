console.log("DialogBase.ts");

/// <reference types="polymer" />

import { Div } from "./widget/Div";
import { Comp } from "./widget/base/Comp";
import { Dialog } from "./widget/Dialog";
import { DialogBaseImpl} from "./DialogBaseImpl";

declare var Polymer: polymer.PolymerStatic;

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, util, render, tag, domBind;  

/*
 * Base class for all dialog boxes.
 *
 * todo: when refactoring all dialogs to this new base-class design I'm always
 * creating a new dialog each time, so the next optimization will be to make
 * certain dialogs (indeed most of them) be able to behave as singletons once
 * they have been constructed where they merely have to be reshown and
 * repopulated to reopen one of them, and closing any of them is merely done by
 * making them invisible.
 */
export abstract class DialogBase extends Dialog implements DialogBaseImpl {

    built: boolean;

    constructor() {
        super(null);
    }

    /* this method is called to initialize the content of the dialog when it's displayed, and should be the place where
    any defaults or values in for fields, etc. should be set when the dialog is displayed */
    init = (): void => {
    }

    closeEvent = (): void => {
    }

    /* To open any dialog all we do is construct the object and call open(). Returns a promise that resolves when the dialog is 
    closed. */
    open = (): Promise<Dialog> => {
        return new Promise<Dialog>((resolve, reject) => {
            /*
             * get container where all dialogs are created (true polymer dialogs)
             *
             * I'm not sure i'm going to keep modalsContainer, but it works fine for now.
             */
            let modalsContainer = util.domElm("modalsContainer");
            modalsContainer.style.width = "100%";
            modalsContainer.style.height = "100%";

            /*
             * TODO. IMPORTANT: need to put code in to remove this dialog from the dom
             * once it's closed, but remember some dialogs will eventually be treated as singletons, meaning
             * they can STAY on the dom, but be invisible. None of this work is done yet.
             *
             * This createElement call is done with a DIV, here although it's really going to be a 'paper-dialog' when the render sets the innerHTML
             * on it, but we have to create first as a DIV because the DOM tree doesn't yet know about 'paper-dialog'
             */
            let node = document.createElement("div");

            //NOTE: This works, but is an example of what NOT to do actually. Instead always
            //set these properties on the 'polyElm.node' below.
            //node.setAttribute("with-backdrop", "with-backdrop");

            modalsContainer.appendChild(node);

            this.renderToDom(node);

            /* the 'flush' call is actually only needed before interrogating the DOM
            for things like height of components, etc */
            Polymer.dom.flush(); 
            Polymer.Base.updateStyles();

            // let left = tag.div( {
            //     "display": "table-column",
            //     "style": "border: 1px solid black;"
            // }, "left");
            // let center = tag.div( {
            //     "display": "table-column",
            //     "style": "border: 1px solid black;"
            // }, this.build());
            // let right = tag.div( {
            //     "display": "table-column",
            //     "style": "border: 1px solid black;"
            // }, "right");
            //
            // let row = tag.div( { "display": "table-row" }, left + center + right);
            //
            // let table: string = tag.div(
            //     {
            //         "display": "table",
            //     }, row);
            //
            // util.setHtml(id, table);

            this.built = true;

            if (typeof this.init == 'function') {
                this.init();
            }
            //console.log("Showing dialog: " + id);

            /* now open and display polymer dialog we just created */
            let polyElm = util.polyElm(this.getId());

            /*
            i tried to tweak the placement of the dialog using fitInto, and it didn't work
            so I'm just using the paper-dialog CSS styling to alter the dialog size to fullscreen
            let ironPages = util.polyElm("mainIronPages");
    
            After the TypeScript conversion I noticed having a modal flag (modal = true) will cause
            an infinite loop (completely hang) in Chrome browser, but this issue is most likely
            not related to TypeScript at all. I just mention TS just in case, because
            that's when I noticed it. Dialogs are fine but not a dialog on top of another dialog, which is
            the case where it hangs if modal=true
            */
            //polyElm.node.modal = true;

            //polyElm.node.refit();
            polyElm.node.noCancelOnOutsideClick = true;
            //polyElm.node.horizontalOffset = 0;
            //polyElm.node.verticalOffset = 0;
            //polyElm.node.fitInto = ironPages.node;
            //polyElm.node.constrain();
            //polyElm.node.center();
            polyElm.node.setAttribute("with-backdrop", "with-backdrop");
            polyElm.node.open();

            //let dialog = document.getElementById('loginDialog');
            node.addEventListener('iron-overlay-closed', (customEvent) => {
                //let id = (<any>customEvent.currentTarget).id;
                console.log("****************** Dialog: " + this.getId() + " is closed!");
                this.closeEvent();
                resolve(this);
            });
        });
    }

    /* todo-1: need to cleanup the registered IDs that are in maps for this dialog */
    //TypeScript has a limitation where => cannot be used on methods intended to be overridden,
    public cancel(): void {
        let polyElm = util.polyElm(this.getId());
        polyElm.node.cancel();

        let modalsContainer = util.domElm("modalsContainer");
        modalsContainer.style.width = "1px";
        modalsContainer.style.height = "1px";
    }
}
