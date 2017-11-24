import { DialogBase } from "./DialogBase";
import { ConfirmDlg } from "./ConfirmDlg";
import { Header } from "./widget/Header";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { TextContent } from "./widget/TextContent";
import { Div } from "./widget/Div";
import { Comp } from "./widget/base/Comp";
import { Form } from "./widget/Form";
import { Constants as cnst} from "./Constants";

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, util, attachment, render;  

declare var Dropzone;
declare var postTargetUrl;

export class UploadFromFileDropzoneDlg extends DialogBase {

    hiddenInputContaier: Div;
    form: Form;
    uploadButton: Button;

    fileList: Object[] = null;
    zipQuestionAnswered: boolean = false;
    explodeZips: boolean = false;
    dropzone: any = null;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Upload File"),
            cnst.SHOW_PATH_IN_DLGS ? new TextContent("Path: " + attachment.uploadNode.path, "path-display-in-editor") : null,
            this.form = new Form({
                "action": postTargetUrl + "upload",
                "autoProcessQueue": false,
                "class": "dropzone"
            }),
            this.hiddenInputContaier = new Div(null, { "style": "display: none;" }),
            new ButtonBar([
                this.uploadButton = new Button("Upload", this.upload),
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
            url: postTargetUrl + "upload",
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

            init: function () {
                let dropzone = this; // closure

                this.on("addedfile", function () {
                    dlg.updateFileList(this);
                    dlg.runButtonEnablement(this);
                });

                this.on("removedfile", function () {
                    dlg.updateFileList(this);
                    dlg.runButtonEnablement(this);
                });

                this.on("sending", function (file, xhr, formData) {
                    formData.append("nodeId", attachment.uploadNode.id);
                    formData.append("explodeZips", dlg.explodeZips ? "true" : "false");
                    dlg.zipQuestionAnswered = false;
                });

                this.on("queuecomplete", function (file) {
                    dlg.cancel();
                    meta64.refresh();
                });
            }
        };

        this.dropzone = new Dropzone("#" + this.form.getId(), config);
    }

    updateFileList = (dropzoneEvt: any): void => {
        this.fileList = dropzoneEvt.getAddedFiles();
        this.fileList = this.fileList.concat(dropzoneEvt.getQueuedFiles());

        /* Detect if any ZIP files are currently selected, and ask user the question about whether they
        should be extracted automatically during the upload, and uploaded as individual nodes
        for each file */
        if (!this.zipQuestionAnswered && this.hasAnyZipFiles()) {
            this.zipQuestionAnswered = true;
            new ConfirmDlg({
                "title": "Explode Zips?",
                "message": "Do you want Zip files exploded onto the tree when uploaded?",
                "buttonText": "Yes, explode zips",
                "yesCallback": () => {
                    this.explodeZips = true;
                },
                "noCallback": () => {
                    this.explodeZips = false;
                }
            }).open();
        }
    }

    hasAnyZipFiles = (): boolean => {
        let ret: boolean = false;
        for (let file of this.fileList) {
            if (util.endsWith(file["name"].toLowerCase(), ".zip")) {
                return true;
            }
        }
        return ret;
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
