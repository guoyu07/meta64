console.log("running module: DialogBase.js");

namespace m64 {
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
    export class DialogBase {

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

        build = (): string => {
            return ""
        };

        open = (): void => {

            /*
             * get container where all dialogs are created (true polymer dialogs)
             */
            var modalsContainer = util.polyElm("modalsContainer");

            /* suffix domId for this instance/guid */
            var id = this.id(this.domId);

            /*
             * TODO. IMPORTANT: need to put code in to remove this dialog from the dom
             * once it's closed, AND that same code should delete the guid's object in
             * map in this module
             */
            var node = document.createElement("paper-dialog");

            //NOTE: This works, but is an example of what NOT to do actually. Instead always
            //set these properties on the 'polyElm.node' below.
            //node.setAttribute("with-backdrop", "with-backdrop");

            node.setAttribute("id", id);
            modalsContainer.node.appendChild(node);

            // todo-3: put in CSS now
            node.style.border = "3px solid gray";

            Polymer.dom.flush(); // <---- is this needed ? todo-3
            Polymer.updateStyles();

            var content = this.build();
            util.setHtmlEnhanced(id, content);
            this.built = true;

            this.init();
            console.log("Showing dialog: " + id);

            /* now open and display polymer dialog we just created */
            var polyElm = util.polyElm(id);

            //After the TypeScript conversion I noticed having a modal flag will cause
            //an infinite loop (completely hang) Chrome browser, but this issue is most likely
            //not related to TypeScript at all, but i'm just mention TS just in case, because
            //that's when I noticed it. Dialogs are fine but not a dialog on top of another dialog, which is
            //the case where it hangs if model=true
            //polyElm.node.modal = true;

            polyElm.node.refit();
            polyElm.node.constrain();
            polyElm.node.center();
            polyElm.node.open();
        }

        /* todo: need to cleanup the registered IDs that are in maps for this dialog */
        cancel = (): void => {
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
            if (id.contains("_dlgId")) {
                return id;
            }
            return id + "_dlgId" + this.data.guid;
        }

        makePasswordField = (text: string, id: string): string => {
            return render.makePasswordField(text, this.id(id));
        }

        makeEditField = (fieldName: string, id: string) => {
            id = this.id(id);
            return render.tag("paper-input", {
                "name": id,
                "label": fieldName,
                "id": id
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
        makeButton = (text: string, id: string, callback: any, ctx?: any): string => {
            var attribs = {
                "raised": "raised",
                "id": this.id(id)
            };

            if (callback != undefined) {
                attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
            }

            return render.tag("paper-button", attribs, text, true);
        }

        makeCloseButton = (text: string, id: string, callback?: any, ctx?: any): string => {

            var attribs = {
                "raised": "raised",
                // warning: this dialog-confirm is required (logic fails without)
                "dialog-confirm": "dialog-confirm",
                "id": this.id(id)
            };

            if (callback != undefined) {
                attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
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

        makeCheckBox = (label: string, id: string, initialState:boolean): string => {
            id = this.id(id);

            var attrs = {
                //"onClick": "m64.meta64.getObjectByGuid(" + this.guid + ").publicCommentingChanged();",
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
                "class": "dialog-header " + (centered ? "horizontal center-justified layout" : "")
            };

            //add id if one was provided
            if (id) {
                attrs["id"] = this.id(id);
            }

            return render.tag("h2", attrs, text);
        }

        focus = (id: string): void => {
            if (!id.startsWith("#")) {
                id = "#" + id;
            }
            id = this.id(id);
            setTimeout(function() {
                $(id).focus();
            }, 1000);
        }
    }
}
