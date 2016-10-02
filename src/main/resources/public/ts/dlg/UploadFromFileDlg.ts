console.log("running module: UploadFromFileDlg.js");

declare var Dropzone;

namespace m64 {
    export class UploadFromFileDlg extends DialogBase {

        constructor() {
            super("UploadFromFileDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            let header = this.makeHeader("Upload File Attachment");

            let uploadPathDisplay = "";

            if (cnst.SHOW_PATH_IN_DLGS) {
                uploadPathDisplay += render.tag("div", {//
                    "id": this.id("uploadPathDisplay"),
                    "class": "path-display-in-editor"
                }, "");
            }

            let uploadFieldContainer = "";
            let formFields = "";

            /*
             * For now I just hard-code in 7 edit fields, but we could theoretically make this dynamic so user can click 'add'
             * button and add new ones one at a time. Just not taking the time to do that yet.
             *
             * todo-0: This is ugly to pre-create these input fields. Need to make them able to add dynamically.
             * (Will do this modification once I get the drag-n-drop stuff working first)
             */
            for (let i = 0; i < 7; i++) {
                let input = render.tag("input", {
                    "id": this.id("upload" + i + "FormInputId"),
                    "type": "file",
                    "name": "files"
                }, "", true);

                /* wrap in DIV to force vertical align */
                formFields += render.tag("div", {
                    "style": "margin-bottom: 10px;"
                }, input);
            }

            formFields += render.tag("input", {
                "id": this.id("uploadFormNodeId"),
                "type": "hidden",
                "name": "nodeId"
            }, "", true);

            /* boolean field to specify if we explode zip files onto the JCR tree */
            formFields += render.tag("input", {
                "id": this.id("explodeZips"),
                "type": "hidden",
                "name": "explodeZips"
            }, "", true);

            let form = render.tag("form", {
                "id": this.id("uploadForm"),
                "method": "POST",
                "enctype": "multipart/form-data",
                "data-ajax": "false" // NEW for multiple file upload support???
            }, formFields);

            uploadFieldContainer = render.tag("div", {//
                "id": this.id("uploadFieldContainer")
            }, "<p>Upload from your computer</p>" + form);

            let uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
            let backButton = this.makeCloseButton("Close", "closeUploadButton");
            let buttonBar = render.centeredButtonBar(uploadButton + backButton);

            return header + uploadPathDisplay + uploadFieldContainer + buttonBar;
        }

        hasAnyZipFiles = (): boolean => {
            let ret: boolean = false;
            for (let i = 0; i < 7; i++) {
                let inputVal = $("#" + this.id("upload" + i + "FormInputId")).val();
                if (inputVal.toLowerCase().endsWith(".zip")) {
                    return true;
                }
            }
            return ret;
        }

        uploadFileNow = (): void => {

            let uploadFunc = (explodeZips) => {
                /* Upload form has hidden input element for nodeId parameter */
                $("#" + this.id("uploadFormNodeId")).attr("value", attachment.uploadNode.id);
                $("#" + this.id("explodeZips")).attr("value", explodeZips ? "true" : "false");

                /*
                 * This is the only place we do something differently from the normal 'util.json()' calls to the server, because
                 * this is highly specialized here for form uploading, and is different from normal ajax calls.
                 */
                let data = new FormData(<HTMLFormElement>($("#" + this.id("uploadForm"))[0]));

                let prms = $.ajax({
                    url: postTargetUrl + "upload",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST'
                });

                prms.done(function() {
                    meta64.refresh();
                });

                prms.fail(function() {
                    (new MessageDlg("Upload failed.")).open();
                });
            };

            if (this.hasAnyZipFiles()) {
                (new ConfirmDlg("Explode Zips?",
                    "Do you want Zip files exploded onto the tree when uploaded?",
                    "Yes, explode zips", //
                    //Yes function
                    function() {
                        uploadFunc(true);
                    },//
                    //No function
                    function() {
                        uploadFunc(false);
                    })).open();
            }
            else {
                uploadFunc(false);
            }
        }

        init = (): void => {
            /* display the node path at the top of the edit page */
            $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
        }
    }
}
