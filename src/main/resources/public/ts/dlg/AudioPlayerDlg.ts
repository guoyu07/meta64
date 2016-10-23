console.log("running module: AudioPlayerDlg.js");

/* This is an audio player dialog that has ad-skipping technology provided by podcast.ts */
namespace m64 {
    export class AudioPlayerDlg extends DialogBase {

        constructor(private sourceUrl: string, private nodeUid: string, private startTimePending: number) {
            super("AudioPlayerDlg");
            console.log("startTimePending in constructor: " + startTimePending);
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

            /* This is where I need a short name of the media being played */
            let description = "";
            // render.tag("p", {
            //  }, "Source: " + this.sourceUrl);

            let playerAttribs: any = {
                "src": this.sourceUrl,
                "id": this.id("audioPlayer"),
                "style": "width: 90%;",
                "ontimeupdate": "m64.podcast.onTimeUpdate('" + this.nodeUid + "', this);",
                "oncanplay": "m64.podcast.onCanPlay('" + this.nodeUid + "', this);",
                "controls": "controls"
            };

            let player = render.tag("audio", playerAttribs);

            //Skipping Buttons
            let skipBack30Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.skip(-30, '" + this.nodeUid + "', this);"
            }, //
                "< 30s");

            let skipForward30Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.skip(30, '" + this.nodeUid + "', this);"
            }, //
                "30s >");

            let skipButtonBar = render.centeredButtonBar(skipBack30Button + skipForward30Button);

            //Speed Buttons
            let speedNormalButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.speed(1.0);"
            }, //
                "Normal Speed");

            let speed15Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.speed(1.5);"
            }, //
                "1.5X");

            let speed2xButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.speed(2);"
            }, //
                "2X");

            let speedButtonBar = render.centeredButtonBar(speedNormalButton + speed15Button + speed2xButton);

            //Dialog Buttons
            let pauseButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.pause();"
            }, //
                "Pause");

            let playButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.play();"
            }, //
                "Play");

            //todo-0: even if this button appears to work, I need it to explicitly enforce the saving of the timevalue AND the removel of the AUDIO element from the DOM */
            let closeButton = this.makeButton("Close", "closeAudioPlayerDlgButton", this.closeBtn);

            let buttonBar = render.centeredButtonBar(playButton + pauseButton + closeButton);

            return header + description + player + skipButtonBar + speedButtonBar + buttonBar;
        }

        closeBtn = (): void => {
            debugger;
            podcast.destroyPlayer(this);
        }

        init = (): void => {
        }
    }
}
