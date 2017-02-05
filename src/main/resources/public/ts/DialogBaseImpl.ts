console.log("DialogBaseImpl.ts");

import {meta64} from "./Meta64"
import {util} from "./Util";
import {render} from "./Render";
import {DialogBase} from "./DialogBase";

declare var Polymer;
declare var $;

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
export class DialogBaseImpl implements DialogBase {

    private horizCenterDlgContent: boolean = true;

    data: any;
    built: boolean;
    guid: string;

    constructor(protected domId: string) {
        this.data = {};

        /*
         * We register 'this' so we can do meta64.getObjectByGuid in onClick methods
         * on the dialog and be able to have 'this' available to the functions that are encoded in onClick methods
         * as strings.
         */
        meta64.registerDataObject(this);
        meta64.registerDataObject(this.data);
    }

    /* this method is called to initialize the content of the dialog when it's displayed, and should be the place where
    any defaults or values in for fields, etc. should be set when the dialog is displayed */
    init = (): void => {
    }

    closeEvent = (): void => {
    }

    build = (): string => {
        return ""
    };

    open = (): void => {
        let thiz = this;
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
                render.tag("div", {
                    //howto: example of how to center a div in another div. This div is the one being centered.
                    //The trick to getting the layout working was NOT setting this width to 100% even though somehow
                    //the layout does result in it being 100% i think.
                    "style": "margin: 0 auto; max-width: 800px;" //"margin: 0 auto; width: 800px;"
                },
                    this.build());
            util.setHtml(id, content);

            // let left = render.tag("div", {
            //     "display": "table-column",
            //     "style": "border: 1px solid black;"
            // }, "left");
            // let center = render.tag("div", {
            //     "display": "table-column",
            //     "style": "border: 1px solid black;"
            // }, this.build());
            // let right = render.tag("div", {
            //     "display": "table-column",
            //     "style": "border: 1px solid black;"
            // }, "right");
            //
            // let row = render.tag("div", { "display": "table-row" }, left + center + right);
            //
            // let table: string = render.tag("div",
            //     {
            //         "display": "table",
            //     }, row);
            //
            // util.setHtml(id, table);
        }
        else {
            /* todo-1: lookup paper-dialog-scrollable, for examples on how we can implement header and footer to build
            a much better dialog. */
            let content = this.build();
            // render.tag("div", {
            //     "class" : "main-dialog-content"
            // },
            // this.build());
            util.setHtml(id, content);
        }


        this.built = true;

        this.init();
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

        //var dialog = document.getElementById('loginDialog');
        node.addEventListener('iron-overlay-closed', function(customEvent) {
            //var id = (<any>customEvent.currentTarget).id;
            //console.log("****************** Dialog: " + id + " is closed!");
            thiz.closeEvent();
        });

        /*
        setting to zero margin immediately, and then almost immediately, and then afte 1.5 seconds
        is a really ugly hack, but I couldn't find the right style class or way of doing this in the google
        docs on the dialog class.
        */
        polyElm.node.style.margin = "0px";
        polyElm.node.refit();

        /* I'm doing this in desparation. nothing else seems to get rid of the margin */
        setTimeout(function() {
            polyElm.node.style.margin = "0px";
            polyElm.node.refit();
        }, 10);

        /* I'm doing this in desparation. nothing else seems to get rid of the margin */
        setTimeout(function() {
            polyElm.node.style.margin = "0px";
            polyElm.node.refit();
        }, 1500);
    }

    /* todo: need to cleanup the registered IDs that are in maps for this dialog */
    public cancel() {
        debugger;
        var polyElm = util.polyElm(this.id(this.domId));
        polyElm.node.cancel();
    }

    /*
     * Helper method to get the true id that is specific to this dialog (i.e. guid
     * suffix appended)
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

    el = (id): any => {
        if (!util.startsWith(id, "#")) {
            return $("#" + this.id(id));
        }
        else {
            return $(this.id(id));
        }
    }

    makePasswordField = (text: string, id: string): string => {
        return render.makePasswordField(text, this.id(id));
    }

    makeEditField = (fieldName: string, id: string) => {
        id = this.id(id);
        return render.tag("paper-input", {
            "name": id,
            "label": fieldName,
            "id": id,
            "class": "meta64-input"
        }, "", true);
    }

    makeMessageArea = (message: string, id?: string): string => {
        var attrs = {
            "class": "dialog-message"
        };
        if (id) {
            attrs["id"] = this.id(id);
        }
        return render.tag("p", attrs, message);
    }

    // todo: there's a makeButton (and other similar methods) that don't have the
    // encodeCallback capability yet
    makeButton = (text: string, id: string, callback: any, ctx?: any, clazz?:string): string => {
        let attribs = {
            "raised": "raised",
            "id": this.id(id),
            "class": clazz || "standardButton"
        };

        if (callback != undefined) {
            attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
        }

        return render.tag("paper-button", attribs, text, true);
    }

    /* The reason delayCloseCallback is here is so that we can encode a button to popup a new dialog over the top of
    an existing dialog, and have that happen instantly, rather than letting it close, and THEN poping up a second dialog,
    becasue using the delay means that the one being hidden is not able to become hidden before the one comes up because
    that creates an uglyness. It's better to popup one right over the other and no flicker happens in that case. */
    makeCloseButton = (text: string, id: string, callback?: any, ctx?: any, initiallyVisible: boolean = true, delayCloseCallback: number = 0): string => {

        let attribs = {
            "raised": "raised",

            /* warning: this dialog-confirm will cause google polymer to close the dialog instantly when the button
             is clicked and sometimes we don't want that, like for example, when we open a dialog over another dialog,
             we don't want the instantaneous close and display of background. It creates a flicker effect.

            "dialog-confirm": "dialog-confirm",
            */

            "id": this.id(id),
            "class": "standardButton"
        };

        let onClick = "";

        if (callback != undefined) {
            onClick = meta64.encodeOnClick(callback, ctx);
        }

        onClick += meta64.encodeOnClick(this.cancel, this, null, delayCloseCallback);

        if (onClick) {
            attribs["onClick"] = onClick;
        }

        if (!initiallyVisible) {
            attribs["style"] = "display:none;"
        }

        return render.tag("paper-button", attribs, text, true);
    }

    bindEnterKey = (id: string, callback: any): void => {
        util.bindEnterKey(this.id(id), callback);
    }

    setInputVal = (id: string, val: string): void => {
        if (!val) {
            val = "";
        }
        util.setInputVal(this.id(id), val);
    }

    getInputVal = (id: string): string => {
        return util.getInputVal(this.id(id)).trim();
    }

    setHtml = (text: string, id: string): void => {
        util.setHtml(this.id(id), text);
    }

    makeRadioButton = (label: string, id: string): string => {
        id = this.id(id);
        return render.tag("paper-radio-button", {
            "id": id,
            "name": id
        }, label);
    }

    makeCheckBox = (label: string, id: string, initialState: boolean): string => {
        id = this.id(id);

        var attrs = {
            //"onClick": "meta64.getObjectByGuid(" + this.guid + ").publicCommentingChanged();",
            "name": id,
            "id": id
        };

        ////////////
        //             <paper-checkbox on-change="checkboxChanged">click</paper-checkbox>
        //
        //             checkboxChanged : function(event){
        //     if(event.target.checked) {
        //         console.log(event.target.value);
        //     }
        // }
        ////////////

        if (initialState) {
            attrs["checked"] = "checked";
        }

        let checkbox: string = render.tag("paper-checkbox", attrs, "", false);

        checkbox += render.tag("label", {
            "for": id
        }, label, true);

        return checkbox;
    }

    makeHeader = (text: string, id?: string, centered?: boolean): string => {
        var attrs = {
            "class": /*"dialog-header " +*/ (centered ? "horizontal center-justified layout" : "") + " dialog-header"
        };

        //add id if one was provided
        if (id) {
            attrs["id"] = this.id(id);
        }

        /* making this H2 tag causes google to drag in a bunch of its own styles and are hard to override */
        return render.tag("div", attrs, text);
    }

    focus = (id: string): void => {
        if (!util.startsWith(id, "#")) {
            id = "#" + id;
        }
        id = this.id(id);
        util.delayedFocus(id);
        // setTimeout(function() {
        //     $(id).focus();
        // }, 1000);
    }
}
