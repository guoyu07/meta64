console.log("running module: podcast.js");

/* NOTE: The AudioPlayerDlg AND this singleton-ish class both share some state and cooperate */
namespace m64 {
    export namespace podcast {
        export let player: any = null;

        let uid: string = null;
        let node: json.NodeInfo = null;
        let adSegments: AdSegment[] = null;

        export let openPlayerDialog = function(_uid: string) {
            uid = _uid;
            node = meta64.uidToNodeMap[uid];
            if (node) {
                let podcastProp: json.PropertyInfo = props.getNodeProperty("podcast", node);
                if (podcastProp) {
                  parseAdSegmentUid(uid);
                  let dlg = new AudioPlayerDlg(podcastProp.value, uid);
                  dlg.open();
                }
            }
        }

        let parseAdSegmentUid = function(_uid: string) {
            if (node) {
                let adSegs: json.PropertyInfo = props.getNodeProperty("ad-segments", node);
                if (adSegs) {
                    parseAdSegmentText(adSegs.value);
                }
            }
            else throw "Unable to find node uid: " + uid;
        }

        let parseAdSegmentText = function(adSegs: string) {
            adSegments = [];

            let segList: string[] = adSegs.split("\n");
            for (let seg of segList) {
                let segTimes: string[] = seg.split(",");
                if (segTimes.length != 2) {
                    console.log("invalid time range: " + seg);
                    continue;
                }

                let beginSecs: number = convertToSeconds(segTimes[0]);
                let endSecs: number = convertToSeconds(segTimes[1]);

                adSegments.push(new AdSegment(beginSecs, endSecs));
            }
        }

        /* convert from fomrat "minutes:seconts" to absolute number of seconds
        *
        * todo-0: make this accept just seconds, or min:sec, or hour:min:sec, and be able to
        * parse any of them correctly.
        */
        let convertToSeconds = function(timeVal: string) {
            /* end time is designated with asterisk by user, and represented by -1 in variables */
            if (timeVal == '*') return -1;
            let timeParts: string[] = timeVal.split(":");
            if (timeParts.length != 2) {
                console.log("invalid time value: " + timeVal);
                return;
            }
            let minutes = new Number(timeParts[0]).valueOf();
            let seconds = new Number(timeParts[1]).valueOf();
            return minutes * 60 + seconds;
        }

        //This podcast handling hack is only in this file temporarily
        export let podcastOnTimeUpdate = function(uid: string, elm: any): void {
            console.log("CurrentTime=" + elm.currentTime);
            player = elm;

            for (let seg of adSegments) {
                /* endTime of -1 means the rest of the media should be considered ADs */
                if (player.currentTime >= seg.beginTime && //
                    (player.currentTime <= seg.endTime || seg.endTime < 0)) {

                    /* jump to end of audio if rest is an add, with logic of -3 to ensure we don't
                    go into a loop jumping to end over and over again */
                    if (seg.endTime < 0 && player.currentTime < player.duration - 3) {
                        /* jump to last to seconds of audio, i'll do this instead of pausing, in case
                         there are is more audio automatically about to play, we don't want to halt it all */
                        player.loop = false;
                        player.currentTime = player.duration - 2;
                    }
                    /* or else we are in a comercial segment so jump to one second past it */
                    else {
                        player.currentTime = seg.endTime + 1
                    }
                    return;
                }
            }
        }

        //This podcast handling hack is only in this file temporarily
        export let podcastSpeed = function(rate:number): void {
            if (player) {
                player.playbackRate = rate;
            }
        }

        //This podcast handling hack is only in this file temporarily
        export let podcast30SecSkip = function(): void {
            if (player) {
                player.currentTime += 30;
            }
        }
    }
}
