import { DialogBaseImpl } from "./DialogBaseImpl";
import { UploadFromFileDlg } from "./UploadFromFileDlg";
import { ConfirmDlg } from "./ConfirmDlg";
import { Factory } from "./Factory";
import { render } from "./Render";
import { cnst } from "./Constants";
import { attachment } from "./Attachment";
import { meta64 } from "./Meta64";
import { util } from "./Util";
import { tag } from "./Tag";

declare var postTargetUrl;

/* We could delete this file, but i want to keep it around a bit longer even though we now use Dropzone */
export default class UploadFromFileDlgImpl extends DialogBaseImpl implements UploadFromFileDlg {

    constructor() {
        super("UploadFromFileDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let header = this.makeHeader("Upload File Attachment");

        let uploadPathDisplay = "";

        if (cnst.SHOW_PATH_IN_DLGS) {
            uploadPathDisplay += tag.div({//
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
            let input = tag.input({
                "id": this.id("upload" + i + "FormInputId"),
                "type": "file",
                "name": "files"
            });

            /* wrap in DIV to force vertical align */
            formFields += tag.div({
                "style": "margin-bottom: 10px;"
            }, input);
        }

        formFields += tag.input({
            //todo-0: MAJOR EPIPHANY of design!!!!!!! as follows
            //I need to allow a property named "_id", and have ALL tags generate using Tags.ts-type wrapper in a helper function, and when it detects that
            //it should replace it with "id=this.id(myid)" so each render function needs an optional COMPONENT that can be specified which is defined to be
            //any gui-component that implements a this.id()
            "id": this.id("uploadFormNodeId"),
            "type": "hidden",
            "name": "nodeId"
        });

        /* boolean field to specify if we explode zip files onto the JCR tree */
        formFields += tag.input({
            "id": this.id("explodeZips"),
            "type": "hidden",
            "name": "explodeZips"
        });

        let form = render.tag("form", {
            "id": this.id("uploadForm"),
            "method": "POST",
            "enctype": "multipart/form-data",
            "data-ajax": "false" // NEW for multiple file upload support???
        }, formFields);

        uploadFieldContainer = tag.div({//
            "id": this.id("uploadFieldContainer")
        }, "<p>Upload from your computer</p>" + form);

        let uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow.bind(this));
        let backButton = this.makeCloseButton("Close", "closeUploadButton");
        let buttonBar = render.centeredButtonBar(uploadButton + backButton);

        return header + uploadPathDisplay + uploadFieldContainer + buttonBar;
    }

    hasAnyZipFiles = (): boolean => {
        let ret: boolean = false;
        for (let i = 0; i < 7; i++) {
            let inputElm: HTMLElement = this.elById("upload" + i + "FormInputId");

            if (inputElm && (<HTMLInputElement>inputElm).value !== null &&
                util.endsWith((<HTMLInputElement>inputElm).value.toLowerCase(), ".zip")) {
                return true;
            }
        }
        return ret;
    }

    uploadFileNow = (): void => {
        throw "UploadFromFileDlgImpl was never refactored after jquery  removal and is not being used";
        // //todo-0: most of my functions are not defined like this, but apparently this way of doing it,
        // //captures 'this' without using bind(this) on the funciton???? I say that becasue the code does work right?
        // let uploadFunc = (explodeZips) => {
        //     /* Upload form has hidden input element for nodeId parameter */
        //     this.elById("uploadFormNodeId").setAttribute("value", attachment.uploadNode.id);
        //     this.elById("explodeZips").setAttribute("value", explodeZips ? "true" : "false");
        //
        //     /*
        //      * This is the only place we do something differently from the normal 'util.json()' calls to the server, because
        //      * this is highly specialized here for form uploading, and is different from normal ajax calls.
        //      */
        //     let data = new FormData(<HTMLFormElement>(util.domElm("#" + this.id("uploadForm"))[0]));
        //
        //     let prms = $.ajax({
        //         url: postTargetUrl + "upload",
        //         data: data,
        //         cache: false,
        //         contentType: false,
        //         processData: false,
        //         type: 'POST'
        //     });
        //
        //     prms.done(function() {
        //         meta64.refresh();
        //     });
        //
        //     prms.fail(function() {
        //         util.showMessage("Upload failed.");
        //     });
        // };
        //
        // if (this.hasAnyZipFiles()) {
        //     Factory.createDefault("ConfirmDlgImpl", (dlg: ConfirmDlg) => {
        //         dlg.open();
        //     }, {
        //             "title": "Explode Zips?",
        //             "message": "Do you want Zip files exploded onto the tree when uploaded?",
        //             "buttonText": "Yes, explode zips",
        //             "yesCallback":
        //             function() {
        //                 uploadFunc(true);
        //             },
        //             "noCallback": function() {
        //                 uploadFunc(true);
        //             }
        //         });
        // }
        // else {
        //     uploadFunc(false);
        // }
    }

    init = (): void => {
        /* display the node path at the top of the edit page */
        this.setInnerHTML("uploadPathDisplay", "Path: " + render.formatPath(attachment.uploadNode));
    }
}
