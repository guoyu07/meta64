console.log("running module: AudioPlayerDlg.js");

/* This is an audio player dialog that has ad-skipping technology provided by podcast.ts */
namespace m64 {
    export class AudioPlayerDlg extends DialogBase {

        constructor(private sourceUrl: string, private nodeUid: string) {
            super("AudioPlayerDlg");
        }

        /* When the dialog closes we need to stop and remove the player */
        public cancel() {
            super.cancel();
            let player = $("#" + this.id("audioPlayer"));
            if (player.length > 0) {
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

            let description = render.tag("p", {

            }, "Source: " + this.sourceUrl);

            let player = render.tag("audio", {
                "src": this.sourceUrl,
                "id": this.id("audioPlayer"),
                "style": "width: 90%;",
                "ontimeupdate": "m64.podcast.podcastOnTimeUpdate('" + this.nodeUid + "', this);",
                "controls": "controls"
            });

            let skipButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.podcast30SecSkip('" + this.nodeUid + "', this);"
            }, //
                "30sec Skip");

            let closeButton = this.makeCloseButton("Close", "closeAudioPlayerDlgButton");

            let buttonBar = render.centeredButtonBar(skipButton + closeButton);
            return header + description + player + buttonBar;
        }

        init = (): void => {
        }
    }
}
