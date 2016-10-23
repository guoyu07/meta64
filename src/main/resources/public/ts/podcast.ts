console.log("running module: podcast.js");

/*
NOTE: The AudioPlayerDlg AND this singleton-ish class both share some state and cooperate

Reference: https://www.w3.org/2010/05/video/mediaevents.html
*/
namespace m64 {
    export namespace podcast {
        export let player: any = null;
        export let startTimePending: number = null;

        let uid: string = null;
        let node: json.NodeInfo = null;
        let adSegments: AdSegment[] = null;

        export let generateRSS = function(): void {
            util.json<json.GenerateRSSRequest, json.GenerateRSSResponse>("generateRSS", {
            }, generateRSSResponse);
        }

        let generateRSSResponse = function(): void {
            alert('rss complete.');
        }

        export let renderFeedNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";
            let title: json.PropertyInfo = props.getNodeProperty("rssFeedTitle", node);
            let desc: json.PropertyInfo = props.getNodeProperty("rssFeedDesc", node);
            let imgUrl: json.PropertyInfo = props.getNodeProperty("rssFeedImageUrl", node);

            let feed: string = "";
            if (title) {
                feed += render.tag("h2", {
                }, title.value);
            }
            if (desc) {
                feed += render.tag("p", {
                }, desc.value);
            }

            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, feed);
            } else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                },
                    feed);
            }

            if (imgUrl) {
                ret += render.tag("img", {
                    "style": "max-width: 300px;",
                    "src": imgUrl.value
                }, null, false);
            }

            return ret;
        }

        export let renderEntryNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";
            let rssTitle: json.PropertyInfo = props.getNodeProperty("rssEntryTitle", node);
            let rssDesc: json.PropertyInfo = props.getNodeProperty("rssEntryDesc", node);
            let rssAuthor: json.PropertyInfo = props.getNodeProperty("rssEntryAuthor", node);
            let rssLink: json.PropertyInfo = props.getNodeProperty("rssEntryLink", node);

            let entry: string = "";
            if (rssTitle) {
                entry += render.tag("h3", {
                }, rssTitle.value);
            }
            if (rssDesc) {
                entry += render.tag("p", {
                }, rssDesc.value);
            }
            if (rssAuthor && rssAuthor.value) {
                entry += render.tag("div", {
                }, "By: " + rssAuthor.value);
            }

            if (rssLink.value.toLowerCase().indexOf(".mp3") != -1) {
                entry += render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.openPlayerDialog('" + node.uid + "');"
                }, //
                    "Play");
            }
            else {
                entry += render.tag("a", {
                    "href": rssLink.value
                }, //
                    "Link");
            }

            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, entry);
            } else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                },
                    entry);
            }

            return ret;
        }

        export let openPlayerDialog = function(_uid: string) {
            uid = _uid;
            node = meta64.uidToNodeMap[uid];

            if (node) {
                let rssLink: json.PropertyInfo = props.getNodeProperty("rssEntryLink", node);
                if (rssLink && rssLink.value.toLowerCase().indexOf(".mp3") != -1) {
                    util.json<json.GetPlayerInfoRequest, json.GetPlayerInfoResponse>("getPlayerInfo", {
                        "url": rssLink.value
                    }, function(res: json.GetPlayerInfoResponse) {
                        parseAdSegmentUid(uid);
                        let dlg = new AudioPlayerDlg(rssLink.value, uid, res.timeOffset);
                        dlg.open();
                    });
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

        export let restoreStartTime = function() {
            /* makes player always start wherever the user last was when they clicked "pause" */
            if (player && startTimePending) {
                player.currentTime = startTimePending;
                startTimePending = null;
            }
        }

        export let onCanPlay = function(uid: string, elm: any): void {
            player = elm;
            restoreStartTime();
            player.play();
        }

        //This podcast handling hack is only in this file temporarily
        export let onTimeUpdate = function(uid: string, elm: any): void {
            console.log("CurrentTime=" + elm.currentTime);
            player = elm;

            /* todo-1: we call restoreStartTime upon loading of the component but it doesn't seem to have the effect doing anything at all
            and can't even update the slider displayed position, until playins is STARTED. Need to come back and fix this because users
            currently have the glitch of always hearing the first fraction of a second of video, which of course another way to fix
            would be by altering the volumn to zero until restoreStartTime has gone into effect */
            restoreStartTime();

            if (!adSegments) return;
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
        export let pause = function(): void {
            if (player) {
                player.pause();
                savePlayerInfo(player.src, player.currentTime);
            }
        }

        export let destroyPlayer = function(dlg:AudioPlayerDlg): void {
            if (player) {
                player.pause();

                setTimeout(function() {
                    savePlayerInfo(player.src, player.currentTime);
                    let localPlayer = $(player);
                    player = null;
                    localPlayer.remove();
                    dlg.cancel();
                }, 1000);
            }
        }

        export let play = function(): void {
            if (player) {
                player.play();
            }
        }

        export let speed = function(rate: number): void {
            if (player) {
                player.playbackRate = rate;
            }
        }

        //This podcast handling hack is only in this file temporarily
        export let skip = function(delta: number): void {
            if (player) {
                player.currentTime += delta;
            }
        }

        export let savePlayerInfo = function(url: string, timeOffset: number): void {
            if (meta64.isAnonUser) return;

            util.json<json.SetPlayerInfoRequest, json.SetPlayerInfoResponse>("setPlayerInfo", {
                "url": url,
                "timeOffset": timeOffset,
                "nodePath": node.path
            }, setPlayerInfoResponse);
        }

        let setPlayerInfoResponse = function(): void {
            //alert('save complete.');
        }
    }
}
