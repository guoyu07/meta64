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

        let pushTimer: any = null;

        export let generateRSS = function(): void {
            util.json<json.GenerateRSSRequest, json.GenerateRSSResponse>("generateRSS", {
            }, generateRSSResponse);
        }

        let generateRSSResponse = function(): void {
            alert('rss complete.');
        }

        export let renderFeedNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";
            let title: json.PropertyInfo = props.getNodeProperty("meta64:rssFeedTitle", node);
            let desc: json.PropertyInfo = props.getNodeProperty("meta64:rssFeedDesc", node);
            let imgUrl: json.PropertyInfo = props.getNodeProperty("meta64:rssFeedImageUrl", node);

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
                    "style": "max-width: 200px;",
                    "src": imgUrl.value
                }, null, false);
            }

            return ret;
        }

        export let getMediaPlayerUrlFromNode = function(node: json.NodeInfo): string {
            let link: json.PropertyInfo = props.getNodeProperty("meta64:rssItemLink", node);
            if (link && link.value && link.value.toLowerCase().contains(".mp3")) {
                return link.value;
            }

            let uri: json.PropertyInfo = props.getNodeProperty("meta64:rssItemUri", node);
            if (uri && uri.value && uri.value.toLowerCase().contains(".mp3")) {
                return uri.value;
            }

            let encUrl: json.PropertyInfo = props.getNodeProperty("meta64:rssItemEncUrl", node);
            if (encUrl && encUrl.value) {
                let encType: json.PropertyInfo = props.getNodeProperty("meta64:rssItemEncType", node);
                if (encType && encType.value && encType.value.startsWith("audio/")) {
                    return encUrl.value;
                }
            }

            return null;
        }

        export let renderItemNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";
            let rssTitle: json.PropertyInfo = props.getNodeProperty("meta64:rssItemTitle", node);
            let rssDesc: json.PropertyInfo = props.getNodeProperty("meta64:rssItemDesc", node);
            let rssAuthor: json.PropertyInfo = props.getNodeProperty("meta64:rssItemAuthor", node);
            let rssLink: json.PropertyInfo = props.getNodeProperty("meta64:rssItemLink", node);
            let rssUri: json.PropertyInfo = props.getNodeProperty("meta64:rssItemUri", node);

            let entry: string = "";

            if (rssLink && rssLink.value && rssTitle && rssTitle.value) {
                entry += render.tag("a", {
                    "href": rssLink.value
                }, render.tag("h3", {}, rssTitle.value));
            }

            let playerUrl = getMediaPlayerUrlFromNode(node);
            if (playerUrl) {
                entry += render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.openPlayerDialog('" + node.uid + "');",
                    "class": "standardButton"
                }, //
                    "Play");
            }

            if (rssDesc && rssDesc.value) {
                entry += render.tag("p", {
                }, rssDesc.value);
            }

            if (rssAuthor && rssAuthor.value) {
                entry += render.tag("div", {
                }, "By: " + rssAuthor.value);
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

        export let propOrderingFeedNode = function(node: json.NodeInfo, properties: json.PropertyInfo[]): json.PropertyInfo[] {
            let propOrder: string[] = [//
                "meta64:rssFeedTitle",
                "meta64:rssFeedDesc",
                "meta64:rssFeedLink",
                "meta64:rssFeedUri",
                "meta64:rssFeedSrc",
                "meta64:rssFeedImageUrl"];

            return props.orderProps(propOrder, properties);
        }

        export let propOrderingItemNode = function(node: json.NodeInfo, properties: json.PropertyInfo[]): json.PropertyInfo[] {
            let propOrder: string[] = [//
                "meta64:rssItemTitle",
                "meta64:rssItemDesc",
                "meta64:rssItemLink",
                "meta64:rssItemUri",
                "meta64:rssItemAuthor"];

            return props.orderProps(propOrder, properties);
        }

        export let openPlayerDialog = function(_uid: string) {
            uid = _uid;
            node = meta64.uidToNodeMap[uid];

            if (node) {
                let mp3Url = getMediaPlayerUrlFromNode(node);
                if (mp3Url) {
                    util.json<json.GetPlayerInfoRequest, json.GetPlayerInfoResponse>("getPlayerInfo", {
                        "url": mp3Url
                    }, function(res: json.GetPlayerInfoResponse) {
                        parseAdSegmentUid(uid);
                        let dlg = new AudioPlayerDlg(mp3Url, uid, res.timeOffset);
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

        export let onTimeUpdate = function(uid: string, elm: any): void {
            if (!pushTimer) {
                /* ping server once every five minutes

                  pinging every 10 seconds, for running a test (todo-00: put back to 5*60*100 (5 minutes))
                */
                pushTimer = setInterval(pushTimerFunction, 10*1000);
            }
            //console.log("CurrentTime=" + elm.currentTime);
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

        /* todo-0: for production, boost this up to one minute */
        export let pushTimerFunction = function(): void {
            //console.log("pushTimer");
            /* the purpose of this timer is to be sure the browser session doesn't timeout while user is playing
            but if the media is paused we DO allow it to timeout. Othwerwise if user is listening to audio, we
            contact the server during this timer to update the time on the server AND keep session from timing out

            todo-0: would everything work if 'player' WAS the jquery object always.
            */
            if (player && !player.paused) {
                /* this safety check to be sure no hidden audio can still be playing should no longer be needed
                now that I have the close litener even on the dialog, but i'll leave this here anyway. Can't hurt. */
                if (!$(player).is(":visible")) {
                    console.log("closing player, because it was detected as not visible. player dialog get hidden?");
                    player.pause();
                }
                //console.log("Autosave player info.");
                savePlayerInfo(player.src, player.currentTime);
            }
        }

        //This podcast handling hack is only in this file temporarily
        export let pause = function(): void {
            if (player) {
                player.pause();
                savePlayerInfo(player.src, player.currentTime);
            }
        }

        export let destroyPlayer = function(dlg: AudioPlayerDlg): void {
            if (player) {
                player.pause();

                setTimeout(function() {
                    savePlayerInfo(player.src, player.currentTime);
                    let localPlayer = $(player);
                    player = null;
                    localPlayer.remove();

                    if (dlg) {
                        dlg.cancel();
                    }
                }, 750);
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

m64.meta64.renderFunctionsByJcrType["meta64:rssfeed"] = m64.podcast.renderFeedNode;
m64.meta64.renderFunctionsByJcrType["meta64:rssitem"] = m64.podcast.renderItemNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:rssfeed"] = m64.podcast.propOrderingFeedNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:rssitem"] = m64.podcast.propOrderingItemNode;
