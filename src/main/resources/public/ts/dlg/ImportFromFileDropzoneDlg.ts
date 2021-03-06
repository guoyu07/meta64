import { DialogBase } from "../DialogBase";
import { ConfirmDlg } from "./ConfirmDlg";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { TextContent } from "../widget/TextContent";
import { Div } from "../widget/Div";
import { Comp } from "../widget/base/Comp";
import { Form } from "../widget/Form";
import { Constants as cnst} from "../Constants";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

declare var Dropzone;

/* NOTE: This file will probably be extremely similar to UploadFromFileDropzoneDlgImpl, but I decided it was best to have
two separate classes rather than one single more complicated class that does botoh functions
*/
export class ImportFromFileDropzoneDlg extends DialogBase {

    hiddenInputContaier: Div;
    form: Form;
    uploadButton: Button;

    fileList: Object[] = null;
    dropzone: any = null;

    constructor() {
        super("Import File");
        this.buildGUI();
    }

    buildGUI = (): void => {

        this.setChildren([
            cnst.SHOW_PATH_IN_DLGS ? new TextContent("Path: " + S.edit.importTargetNode.path, "path-display-in-editor") : null,
            this.form = new Form({
                "action": S.util.getRpcPath() + "upload",
                "autoProcessQueue": false,
                "class": "dropzone"
            }),
            this.hiddenInputContaier = new Div(null, { "style": "display: none;" }),
            new ButtonBar([
                this.uploadButton = new Button("Import", this.upload),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    upload = (): void => {
        this.dropzone.processQueue();
    }

    configureDropZone = (): void => {

        let dlg = this;
        let config: Object = {
            url: S.util.getRpcPath() + "streamImport",
            // Prevents Dropzone from uploading dropped files immediately
            autoProcessQueue: false,
            paramName: "files",
            maxFilesize: 20, //<---- I assume this is in MB ?
            parallelUploads: 2,

            /* Not sure what's this is for, but the 'files' parameter on the server is always NULL, unless
            the uploadMultiple is false */
            uploadMultiple: false,
            addRemoveLinks: true,
            dictDefaultMessage: "Drag & Drop files here, or Click",
            hiddenInputContainer: "#" + this.hiddenInputContaier.getId(),

            init: function() {
                let dropzone = this; // closure

                this.on("addedfile", function() {
                    dlg.updateFileList(this);
                    dlg.runButtonEnablement(this);
                });

                this.on("removedfile", function() {
                    dlg.updateFileList(this);
                    dlg.runButtonEnablement(this);
                });

                this.on("sending", function(file, xhr, formData) {
                    formData.append("nodeId", S.edit.importTargetNode.id);
                });

                this.on("queuecomplete", function(file) {
                    dlg.cancel();
                    S.meta64.refresh();
                });
            }
        };

        this.dropzone = new Dropzone("#" + this.form.getId(), config);
    }

    updateFileList = (dropzoneEvt: any): void => {
        this.fileList = dropzoneEvt.getAddedFiles();
        this.fileList = this.fileList.concat(dropzoneEvt.getQueuedFiles());
    }

    runButtonEnablement = (dropzoneEvt: any): void => {
        let filesSelected = dropzoneEvt.getAddedFiles().length > 0 ||
            dropzoneEvt.getQueuedFiles().length > 0;
        this.uploadButton.setVisible(filesSelected);
    }

    init = (): void => {
        this.configureDropZone();
    }
}
