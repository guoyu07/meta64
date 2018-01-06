console.log("DialogBase.ts");

import { Div } from "./widget/Div";
import { Comp } from "./widget/base/Comp";
import { Dialog } from "./widget/Dialog";
import { DialogBaseImpl } from "./DialogBaseImpl";
import { Factory } from "./Factory";
import { Meta64Intf as Meta64 } from "./intf/Meta64Intf";
import { UtilIntf as Util } from "./intf/UtilIntf";
import { TagIntf as View } from "./intf/TagIntf";
import { NavIntf as Nav } from "./intf/NavIntf";
import { PropsIntf as Props } from "./intf/PropsIntf";
import { EditIntf as Edit } from "./intf/EditIntf";
import { DomBindIntf as DomBind } from "./intf/DomBindIntf";
import { TagIntf as Tag } from "./intf/TagIntf";
import { RenderIntf as Render } from "./intf/RenderIntf";
import { Singletons } from "./Singletons";
import { PubSub } from "./PubSub";
import { Constants } from "./Constants";

declare var $;

let meta64: Meta64;
let util: Util;
let render: Render;
let tag: Tag;
let domBind: DomBind;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    meta64 = s.meta64;
    util = s.util;
    render = s.render;
    tag = s.tag;
    domBind = s.domBind;
});

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

    constructor(title: string) {
        super(title);
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
             * TODO. IMPORTANT: need to put code in to remove this dialog from the dom
             * once it's closed, but remember some dialogs will eventually be treated as singletons, meaning
             * they can STAY on the dom, but be invisible. None of this work is done yet.
             *
             * This createElement call is done with a DIV, here although it's really going to be a 'paper-dialog' when the render sets the innerHTML
             * on it, but we have to create first as a DIV because the DOM tree doesn't yet know about 'paper-dialog'
             */
            let myModal = $(this.renderHtml());
            $("body").append(myModal);

            myModal.modal({
                //i keep getting a permanent mouse block (ignored mouse) in the app and i'm trying to determine if it's this
                //backdrop by commenting out backdrop option for now.
                backdrop: "static",
                keyboard: true,
                focus: true,
                show: true
            });

            this.built = true;

            if (typeof this.init == 'function') {
                this.init();
            }
        });
    }

    /* todo-1: need to cleanup the registered IDs that are in maps for this dialog */
    //TypeScript has a limitation where => cannot be used on methods intended to be overridden,
    public cancel(): void {
        $("#" + this.getId()).modal('hide');

        /* todo-1: removing element immediately breaks the ability for JQuery to correctly remove the backdrop, so i'm just leaving it 
        orphaned for now, but probably adding a timer of a second or to will work, doing this call asynchronously plenty later */
        setTimeout(() => {
            $("#" + this.getId()).remove();

            if ($(".modal-dialog").length == 0) {
                /* this is ugly as hell, becasue it's not gonna work with dialogs on top of other dialogs, but this is a problem lots of others
                are having and not just us, so i will need to research more */
                $('.modal-backdrop').remove();
            }
        }, 500);
    }
}
