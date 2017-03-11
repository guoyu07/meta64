console.log("DialogBaseImpl.ts");

import { meta64 } from "./Meta64"
import { util } from "./Util";
import { render } from "./Render";
import { DialogBase } from "./DialogBase";
import { tag } from "./Tag";
import { Div } from "./widget/Div";
import { Comp } from "./widget/base/Comp";
import { domBind } from "./DomBind";

declare var Polymer;

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
export abstract class DialogBaseImpl implements DialogBase {
    private horizCenterDlgContent: boolean = true;

    data: any;
    built: boolean;
    guid: string;

    //todo-0: Eventually we can make this base class be an instance of Comp, as its base class, but for now, I'm just using
    //containment rather than composition, and letting this 'content' be the actual root element for the GUI of the dialog,
    //rather than haing this dialog itself be an instenace of Comp.
    //
    //Note: amaking this base class into a Comp-derived class will also eliminate a lot of methods in it (this.id, this.makeButton, etc)
    content: Div = new Div();

    constructor(protected domId: string) {
        this.data = {};
        this.data.guid = Comp.nextGuid();
    }

    getComponent(): Comp {
        return this.content;
    }

    /* this method is called to initialize the content of the dialog when it's displayed, and should be the place where
    any defaults or values in for fields, etc. should be set when the dialog is displayed */
    init = (): void => {
    }

    closeEvent = (): void => {
    }

    render = (): string => {
        if (this.getComponent()) {
            return this.getComponent().render();
        }
        throw "render method should overridden, unless component is available";
    };

    open = (): void => {
        /*
         * get container where all dialogs are created (true polymer dialogs)
         */
        let modalsContainer = util.polyElm("modalsContainer");

        /* suffix domId for this instance/guid */
        let id = this.id(this.domId);

        /*
         * TODO. IMPORTANT: need to put code in to remove this dialog from the dom
         * once it's closed, AND that same code should delete the guid's object in
         * map in this module
         */
        let node = document.createElement("paper-dialog");

        //NOTE: This works, but is an example of what NOT to do actually. Instead always
        //set these properties on the 'polyElm.node' below.
        //node.setAttribute("with-backdrop", "with-backdrop");

        node.setAttribute("id", id);
        modalsContainer.node.appendChild(node);

        // todo-3: put in CSS now
        node.style.border = "3px solid gray";

        Polymer.dom.flush(); // <---- is this needed ? todo-3
        Polymer.updateStyles();

        if (this.horizCenterDlgContent) {

            let content: string =
                tag.div({
                    //howto: example of how to center a div in another div. This div is the one being centered.
                    //The trick to getting the layout working was NOT setting this width to 100% even though somehow
                    //the layout does result in it being 100% i think.
                    "style": "margin: 0 auto; max-width: 800px;" //"margin: 0 auto; width: 800px;"
                },
                    this.render());
            util.setHtml(id, content);

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
        }
        else {
            /* todo-1: lookup paper-dialog-scrollable, for examples on how we can implement header and footer to build
            a much better dialog. */
            let content = this.render();
            // tag.div( {
            //     "class" : "main-dialog-content"
            // },
            // this.build());
            util.setHtml(id, content);
        }

        this.built = true;

        if (typeof this.init == 'function') {
            this.init();
        }
        console.log("Showing dialog: " + id);

        /* now open and display polymer dialog we just created */
        let polyElm = util.polyElm(id);

        /*
        i tried to tweak the placement of the dialog using fitInto, and it didn't work
        so I'm just using the paper-dialog CSS styling to alter the dialog size to fullscreen
        let ironPages = util.polyElm("mainIronPages");

        After the TypeScript conversion I noticed having a modal flag will cause
        an infinite loop (completely hang) Chrome browser, but this issue is most likely
        not related to TypeScript at all, but i'm just mention TS just in case, because
        that's when I noticed it. Dialogs are fine but not a dialog on top of another dialog, which is
        the case where it hangs if model=true
        */
        //polyElm.node.modal = true;

        //polyElm.node.refit();
        polyElm.node.noCancelOnOutsideClick = true;
        //polyElm.node.horizontalOffset = 0;
        //polyElm.node.verticalOffset = 0;
        //polyElm.node.fitInto = ironPages.node;
        //polyElm.node.constrain();
        //polyElm.node.center();
        polyElm.node.open();

        //let dialog = document.getElementById('loginDialog');
        node.addEventListener('iron-overlay-closed', (customEvent) => {
            //let id = (<any>customEvent.currentTarget).id;
            //console.log("****************** Dialog: " + id + " is closed!");
            this.closeEvent();
        });

        /*
        setting to zero margin immediately, and then almost immediately, and then afte 1.5 seconds
        is a really ugly hack, but I couldn't find the right style class or way of doing this in the google
        docs on the dialog class.
        */
        polyElm.node.style.margin = "0px";
        polyElm.node.refit();

        /* I'm doing this in desparation. nothing else seems to get rid of the margin */
        setTimeout(() => {
            polyElm.node.style.margin = "0px";
            polyElm.node.refit();
        }, 10);

        /* I'm doing this in desparation. nothing else seems to get rid of the margin */
        setTimeout(() => {
            polyElm.node.style.margin = "0px";
            polyElm.node.refit();
        }, 1500);
    }

    /* todo-1: need to cleanup the registered IDs that are in maps for this dialog */
    //TypeScript has a limitation where => cannot be used on methods intended to be overridden,
    public cancel(): void {
        let polyElm = util.polyElm(this.id(this.domId));
        polyElm.node.cancel();
    }

    /*
     * Helper method to get the true id that is specific to this dialog (i.e. guid
     * suffix appended)
     *
     * This will be totally replaced by Comp.getId() once we are fully converted to Widget architecture.
     */
    id = (id): string => {
        if (id == null)
            return null;

        /* if dialog already suffixed */
        if (util.contains(id, "_dlgId")) {
            return id;
        }
        return id + "_dlgId" + this.data.guid;
    }
}
