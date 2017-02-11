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
        let player = document.querySelector("#" + this.id("audioPlayer"));
        if (player !== null) {
            /* for some reason the audio player needs to be accessed like it's an array */
            (<any>player[0]).pause();
            player.remove();
        }
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        let header = this.makeHeader("Audio Player");

        let node: I.NodeInfo = meta64.uidToNodeMap[this.nodeUid];
        if (!node) {
            throw `unknown node uid: ${this.nodeUid}`;
        }

        let rssTitle: I.PropertyInfo = props.getNodeProperty("meta64:rssItemTitle", node);

        /* This is where I need a short name of the media being played */
        let description = render.tag("p", {
        }, rssTitle.value);

        //references:
        //http://www.w3schools.com/tags/ref_av_dom.asp
        //https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
        let playerAttribs: any = {
            "src": this.sourceUrl,
            "id": this.id("audioPlayer"),
            "style": "width: 100%; padding:0px; margin-top: 0px; margin-left: 0px; margin-right: 0px;",
            "ontimeupdate": `podcast.onTimeUpdate('${this.nodeUid}', this);`,
            "oncanplay": `podcast.onCanPlay('${this.nodeUid}', this);`,
            "controls": "controls",
            "preload": "auto"
        };

        let player = render.tag("audio", playerAttribs);

        //Skipping Buttons
        let skipBack30Button = this.makeButton("< 30s", "skipBackButton", this.skipBack30Button);
        let skipForward30Button = this.makeButton("30s >", "skipForwardButton", this.skipForward30Button);
        let skipButtonBar = render.centeredButtonBar(skipBack30Button + skipForward30Button);

        //Speed Buttons
        let speedNormalButton = this.makeButton("Normal", "normalSpeedButton", this.normalSpeedButton);
        let speed15Button = this.makeButton("1.5X", "speed15Button", this.speed15Button);
        let speed2Button = this.makeButton("2X", "speed2Button", this.speed2Button);
        let speedButtonBar = render.centeredButtonBar(speedNormalButton + speed15Button + speed2Button);

        //Dialog Buttons
        let pauseButton = this.makeButton("Pause", "pauseButton", this.pauseButton);
        let playButton = this.makeButton("Play", "playButton", this.playButton, "playButton");
        //todo-1: even if this button appears to work, I need it to explicitly enforce the saving of the time value AND the removal of the AUDIO element from the DOM */
        let closeButton = this.makeButton("Close", "closeAudioPlayerDlgButton", this.closeBtn);

        let buttonBar = render.centeredButtonBar(playButton + pauseButton + closeButton);

        return header + description + player + skipButtonBar + speedButtonBar + buttonBar;
    }

    pauseButton = (): void => {
        podcast.pause();
    }

    playButton = (): void => {
        podcast.play();
    }

    speed2Button = (): void => {
        podcast.speed(2);
    }

    speed15Button = (): void => {
        podcast.speed(1.5);
    }

    normalSpeedButton = (): void => {
        podcast.speed(1.0);
    }

    skipBack30Button = (): void => {
        podcast.skip(-30);
    }

    skipForward30Button = (): void => {
        podcast.skip(30);
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
