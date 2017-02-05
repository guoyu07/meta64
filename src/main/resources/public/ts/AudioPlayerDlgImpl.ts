console.log("AudioPlayerDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { AudioPlayerDlg } from "./AudioPlayerDlg";
import { podcast } from "./Podcast";
import { meta64 } from "./Meta64";
import { render } from "./Render";
import { props } from "./Props";
import * as I from "./Interfaces";

/* This is an audio player dialog that has ad-skipping technology provided by podcast.ts */
export default class AudioPlayerDlgImpl extends DialogBaseImpl implements AudioPlayerDlg {

    private sourceUrl: string;
    private nodeUid: string;
    private startTimePending: number;

    constructor(args: Object) {
        super("AudioPlayerDlg");

        this.sourceUrl = (<any>args).sourceUrl;
        this.nodeUid = (<any>args).nodeUid;
        this.startTimePending = (<any>args).startTimePending;

        console.log(`startTimePending in constructor: ${this.startTimePending}`);
        podcast.startTimePending = this.startTimePending;
    }

    /* When the dialog closes we need to stop and remove the player */
    public cancel() {
        super.cancel();
        let player = $("#" + this.id("audioPlayer"));
        if (player && player.length > 0) {
            /* for some reason the audio player needs to be accessed like it's an array */
            (<any>player[0]).pause();
            player.remove();
        }
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        throw "onclicks, not defined";

        //     let header = this.makeHeader("Audio Player");
        //
        //     let node: I.NodeInfo = meta64.uidToNodeMap[this.nodeUid];
        //     if (!node) {
        //         throw `unknown node uid: ${this.nodeUid}`;
        //     }
        //
        //     let rssTitle: I.PropertyInfo = props.getNodeProperty("meta64:rssItemTitle", node);
        //
        //     /* This is where I need a short name of the media being played */
        //     let description = render.tag("p", {
        //     }, rssTitle.value);
        //
        //     //references:
        //     //http://www.w3schools.com/tags/ref_av_dom.asp
        //     //https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
        //     let playerAttribs: any = {
        //         "src": this.sourceUrl,
        //         "id": this.id("audioPlayer"),
        //         "style": "width: 100%; padding:0px; margin-top: 0px; margin-left: 0px; margin-right: 0px;",
        //         "ontimeupdate": `podcast.onTimeUpdate('${this.nodeUid}', this);`,
        //         "oncanplay": `podcast.onCanPlay('${this.nodeUid}', this);`,
        //         "controls": "controls",
        //         "preload": "auto"
        //     };
        //
        //     let player = render.tag("audio", playerAttribs);
        //
        //     //Skipping Buttons
        //     let skipBack30Button = render.tag("paper-button", {
        //         "raised": "raised",
        //         "onClick": `podcast.skip(-30, '${this.nodeUid}', this);`,
        //         "class": "standardButton"
        //     }, //
        //         "< 30s");
        //
        //     let skipForward30Button = render.tag("paper-button", {
        //         "raised": "raised",
        //         "onClick": `podcast.skip(30, '${this.nodeUid}', this);`,
        //         "class": "standardButton"
        //     }, //
        //         "30s >");
        //
        //     let skipButtonBar = render.centeredButtonBar(skipBack30Button + skipForward30Button);
        //
        //     //Speed Buttons
        //     let speedNormalButton = render.tag("paper-button", {
        //         "raised": "raised",
        //         "onClick": "podcast.speed(1.0);",
        //         "class": "standardButton"
        //     }, //
        //         "Normal");
        //
        //     let speed15Button = render.tag("paper-button", {
        //         "raised": "raised",
        //         "onClick": "podcast.speed(1.5);",
        //         "class": "standardButton"
        //     }, //
        //         "1.5X");
        //
        //     let speed2xButton = render.tag("paper-button", {
        //         "raised": "raised",
        //         "onClick": "podcast.speed(2);",
        //         "class": "standardButton"
        //     }, //
        //         "2X");
        //
        //     let speedButtonBar = render.centeredButtonBar(speedNormalButton + speed15Button + speed2xButton);
        //
        //     //Dialog Buttons
        //     let pauseButton = render.tag("paper-button", {
        //         "raised": "raised",
        //         "onClick": "podcast.pause();",
        //         "class": "standardButton"
        //     }, //
        //         "Pause");
        //
        //     let playButton = render.tag("paper-button", {
        //         "raised": "raised",
        //         "onClick": "podcast.play();",
        //         "class": "playButton"
        //     }, //
        //         "Play");
        //
        //     //todo-0: even if this button appears to work, I need it to explicitly enforce the saving of the timevalue AND the removal of the AUDIO element from the DOM */
        //     let closeButton = this.makeButton("Close", "closeAudioPlayerDlgButton", this.closeBtn);
        //
        //     let buttonBar = render.centeredButtonBar(playButton + pauseButton + closeButton);
        //
        //     return header + description + player + skipButtonBar + speedButtonBar + buttonBar;
    }

    closeEvent = (): void => {
        podcast.destroyPlayer(null);
    }

    closeBtn = (): void => {
        podcast.destroyPlayer(this);
    }

    init = (): void => {
    }
}
