console.log("running module: UploadFromFileDropzoneDlg.js");

declare var Dropzone;

namespace m64 {
    export class UploadFromFileDropzoneDlg extends DialogBase {

        constructor() {
            super("UploadFromFileDropzoneDlg");
        }

        build = (): string => {
            let header = this.makeHeader("Upload File Attachment");

            let uploadPathDisplay = "";

            if (cnst.SHOW_PATH_IN_DLGS) {
                uploadPathDisplay += render.tag("div", {//
                    "id": this.id("uploadPathDisplay"),
                    "class": "path-display-in-editor"
                }, "");
            }

            //let uploadFieldContainer = "";
            let formFields = "";

            console.log("Upload Action URL: " + postTargetUrl + "upload");

            let hiddenInputContainer = render.tag("div", {
                "id": this.id("hiddenInputContainer"),
                "style": "display: none;"
            }, "");

            let form = render.tag("form", {
                "action": postTargetUrl + "upload",
                "autoProcessQueue": false,
                /* Note: we also have some styling in meta64.css for 'dropzone' */
                "class": "dropzone",
                "id": this.id("dropzone-form-id")
            }, "");

            let uploadButton = this.makeCloseButton("Upload", "uploadButton", null, null, false);
            let backButton = this.makeCloseButton("Close", "closeUploadButton");
            let buttonBar = render.centeredButtonBar(uploadButton + backButton);

            return header + uploadPathDisplay + form /*uploadFieldContainer */ + hiddenInputContainer + buttonBar;
        }

        configureDropZone = (): void => {

            /* I haven't taken the explodeZips option code from UploadFromFileDlg.ts yet, to put
            in this new dropzone class, but will do that sometime. For now the feature of exploding zip
            will juse not be enabled */
            let explodeZips: boolean = false;

            let thiz = this;
            let config: Object = {
                url: postTargetUrl + "upload",
                // Prevents Dropzone from uploading dropped files immediately
                autoProcessQueue: false,
                paramName: "files",
                maxFilesize: 2,
                parallelUploads: 10,

                /* Not sure what's this is for, but the 'files' parameter on the server is always NULL, unless
                the uploadMultiple is false */
                uploadMultiple: false,
                addRemoveLinks: true,
                dictDefaultMessage: "Drag & Drop files here, or Click",
                hiddenInputContainer: "#" + thiz.id("hiddenInputContainer"),

                /*
                This doesn't work at all. Dropzone apparently claims to support this but doesn't.
                See the "sending" function below, where I ended up passing these parameters.
                headers : {
                    "nodeId" : attachment.uploadNode.id,
                    "explodeZips" : explodeZips ? "true" : "false"
                },
                */

                init: function() {
                    let dropzone = this; // closure
                    var submitButton = document.querySelector("#" + thiz.id("uploadButton"));
                    if (!submitButton) {
                        console.log("Unable to get upload button.");
                    }

                    submitButton.addEventListener("click", function(e) {
                        //e.preventDefault();
                        dropzone.processQueue();
                    });

                    this.on("addedfile", function() {
                        thiz.runButtonEnablement(this);
                    });

                    this.on("removedfile", function() {
                        thiz.runButtonEnablement(this);
                    });

                    this.on("sending", function(file, xhr, formData) {
                        formData.append("nodeId", attachment.uploadNode.id);
                        formData.append("explodeZips", explodeZips ? "true" : "false");
                    });

                    this.on("queuecomplete", function(file) {
                        meta64.refresh();
                    });
                }
            };

            $("#" + this.id("dropzone-form-id")).dropzone(config);
        }

        runButtonEnablement = (dropzoneEvt: any): void => {
            if (dropzoneEvt.getAddedFiles().length > 0 ||
                dropzoneEvt.getQueuedFiles().length > 0) {
                $("#" + this.id("uploadButton")).show();
            }
            else {
                $("#" + this.id("uploadButton")).hide();
            }
        }

        init = (): void => {
            /* display the node path at the top of the edit page */
            $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));

            this.configureDropZone();
        }
    }
}
