console.log("AudioPlayerDlg.ts");

import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Header } from "../widget/Header";
import { PasswordTextField } from "../widget/PasswordTextField";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextContent } from "../widget/TextContent";
import { AudioPlayer } from "../widget/AudioPlayer";
import { Form } from "../widget/Form";
import { UtilIntf } from "../intf/UtilIntf";
import { Singletons } from "../Singletons";
import { Constants } from "../Constants";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    S = s;
});


/* This is an audio player dialog that has ad-skipping technology provided by podcast.ts

NOTE: currently the add-skip feature is a proof of concept and it does functionally work, but croud sourcing
the collection of the time-offsets of the begin/end array of commercial segments has not yet been implemented.
*/
export class AudioPlayerDlg extends DialogBase {

    audioPlayer: AudioPlayer;

    private sourceUrl: string;
    private nodeUid: string;
    private startTimePending: number;
    private node: I.NodeInfo;

    constructor(args: Object) {
        super("Audio Player");

        console.log("Configuring AudioPlayer Dialog");
        this.sourceUrl = (<any>args).sourceUrl;
        this.nodeUid = (<any>args).nodeUid;
        this.startTimePending = (<any>args).startTimePending;

        this.node = S.meta64.uidToNodeMap[this.nodeUid];
        if (!this.node) {
            throw `unknown node uid: ${this.nodeUid}`;
        }

        console.log("AudioPlayer: url=" + this.sourceUrl);
        console.log(`startTimePending in constructor: ${this.startTimePending}`);
        S.podcast.startTimePending = this.startTimePending;

        console.log("AudioPlayer Dialog biuldGUI");
        this.buildGUI();
    }

    buildGUI = (): void => {
        let rssTitle: I.PropertyInfo = S.props.getNodeProperty("sn:rssItemTitle", this.node);

        this.setChildren([
            new Form(null, [
                //space is at a premium for mobile, so let's just not even show the header.
                //new Header("Audio Player"),
                new TextContent(rssTitle.value),
                this.audioPlayer = new AudioPlayer({
                    "src": this.sourceUrl,
                    "style": "width: 100%; border: 3px solid gray; padding:0px; margin-top: 0px; margin-left: 0px; margin-right: 0px;",
                    "ontimeupdate": () => { S.podcast.onTimeUpdate(this); },
                    "oncanplay": () => { S.podcast.onCanPlay(this); },
                    "controls": "controls",
                    "preload": "auto"
                }),
                new ButtonBar([
                    new Button("< 30s", this.skipBack30Button),
                    new Button("30s >", this.skipForward30Button)
                ]),
                new ButtonBar([
                    new Button("Normal", this.normalSpeedButton),
                    new Button("1.5X", this.speed15Button),
                    new Button("2X", this.speed2Button)
                ]),
                new ButtonBar([
                    new Button("Pause", this.pauseButton),
                    new Button("Play", this.playButton),
                    //todo-1: even if this button appears to work, I need it to explicitly enforce the saving of the time value AND the removal of the AUDIO element from the DOM */
                    new Button("Close", this.closeBtn)
                ])
            ])
        ]);
    }

    getAudioElement(): HTMLAudioElement {
        return this.audioPlayer.getAudioElement();
    }

    /* When the dialog closes we need to stop and remove the player */
    //TypeScript has a limitation that => cannot be used on overridden methods, so we have to be careful to use
    //bind(this) everywhere we need to call this 'cancel()'.
    cancel(): void {
        console.log("AudioPlayerDialog cancel()");
        //todo-1: need to check over, and document flow of this functiuon as it relates to calling "podcast.destroyPlayer(this);"
        super.cancel();
        let player = this.audioPlayer.getAudioElement();
        if (player) {

            /* audio player needs to be accessed like it's an array ?? Used to be the case, but checking again. */
            //(<any>player[0]).pause();
            console.log("player pause and remove");
            player.pause();
            player.remove();
        }
    }

    pauseButton = (): void => {
        S.podcast.pause();
    }

    playButton = (): void => {
        S.podcast.play();
    }

    speed2Button = (): void => {
        S.podcast.speed(2);
    }

    speed15Button = (): void => {
        S.podcast.speed(1.5);
    }

    normalSpeedButton = (): void => {
        S.podcast.speed(1.0);
    }

    skipBack30Button = (): void => {
        S.podcast.skip(-30);
    }

    skipForward30Button = (): void => {
        S.podcast.skip(30);
    }

    closeEvent = (): void => {
        S.podcast.destroyPlayer(null);
    }

    closeBtn = (): void => {
        S.podcast.destroyPlayer(this);
    }

    init = (): void => {
        this.audioPlayer.whenElm((elm) => {
            S.podcast.player = elm;
        });
    }
}
