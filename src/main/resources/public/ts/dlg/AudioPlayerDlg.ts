console.log("running module: AudioPlayerDlg.js");

/* This is an audio player dialog that has ad-skipping technology provided by podcast.ts */
namespace m64 {
    export class AudioPlayerDlg extends DialogBase {

        constructor(private sourceUrl: string, private nodeUid: string, private startTimePending: number) {
            super("AudioPlayerDlg");
            console.log(`startTimePending in constructor: ${startTimePending}`);
            podcast.startTimePending = startTimePending;
        }

        /* When the dialog closes we need to stop and remove the player */
        public cancel() {
            super.cancel();
            let player = $("#" + this.id("audioPlayer"));
            if (player && player.length > 0) {
                /* for some reason the audio player needs to be accessed like it's an array */
                player[0].pause();
                player.remove();
            }
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            let header = this.makeHeader("Audio Player");

            let node: json.NodeInfo = meta64.uidToNodeMap[this.nodeUid];
            if (!node) {
                throw `unknown node uid: ${this.nodeUid}`;
            }

            let rssTitle: json.PropertyInfo = props.getNodeProperty("meta64:rssItemTitle", node);

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
                "ontimeupdate": `m64.podcast.onTimeUpdate('${this.nodeUid}', this);`,
                "oncanplay": `m64.podcast.onCanPlay('${this.nodeUid}', this);`,
                "controls": "controls",
                "preload" : "auto"
            };

            let player = render.tag("audio", playerAttribs);

            //Skipping Buttons
            let skipBack30Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": `m64.podcast.skip(-30, '${this.nodeUid}', this);`,
                "class": "standardButton"
            }, //
                "< 30s");

            let skipForward30Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": `m64.podcast.skip(30, '${this.nodeUid}', this);`,
                "class": "standardButton"
            }, //
                "30s >");

            let skipButtonBar = render.centeredButtonBar(skipBack30Button + skipForward30Button);

            //Speed Buttons
            let speedNormalButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.speed(1.0);",
                "class": "standardButton"
            }, //
                "Normal");

            let speed15Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.speed(1.5);",
                "class": "standardButton"
            }, //
                "1.5X");

            let speed2xButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.speed(2);",
                "class": "standardButton"
            }, //
                "2X");

            let speedButtonBar = render.centeredButtonBar(speedNormalButton + speed15Button + speed2xButton);

            //Dialog Buttons
            let pauseButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.pause();",
                "class": "standardButton"
            }, //
                "Pause");

            let playButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.play();",
                "class": "playButton"
            }, //
                "Play");

            //todo-0: even if this button appears to work, I need it to explicitly enforce the saving of the timevalue AND the removal of the AUDIO element from the DOM */
            let closeButton = this.makeButton("Close", "closeAudioPlayerDlgButton", this.closeBtn);

            let buttonBar = render.centeredButtonBar(playButton + pauseButton + closeButton);

            return header + description + player + skipButtonBar + speedButtonBar + buttonBar;
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
}
