import { util } from "./Util";
import { props } from "./Props";
import { render } from "./Render";
import { meta64 } from "./Meta64";
import { AudioPlayerDlg } from "./AudioPlayerDlg";
import { Factory } from "./Factory";
import * as I from "./Interfaces";
import { tag } from "./Tag";

/*
NOTE: The AudioPlayerDlg AND this singleton-ish class both share some state and cooperate

Reference: https://www.w3.org/2010/05/video/mediaevents.html
*/
class Podcast {
    player: HTMLAudioElement = null;
    startTimePending: number = null;

    private uid: string = null;
    private node: I.NodeInfo = null;
    private adSegments: I.AdSegment[] = null;

    private pushTimer: any = null;

    generateRSS(): void {
        util.ajax<I.GenerateRSSRequest, I.GenerateRSSResponse>("generateRSS", {
        }, podcast.generateRSSResponse);
    }

    private generateRSSResponse(): void {
        alert('rss complete.');
    }


    getMediaPlayerUrlFromNode(node: I.NodeInfo): string {
        let link: I.PropertyInfo = props.getNodeProperty("meta64:rssItemLink", node);
        if (link && link.value && util.contains(link.value.toLowerCase(), ".mp3")) {
            return link.value;
        }

        let uri: I.PropertyInfo = props.getNodeProperty("meta64:rssItemUri", node);
        if (uri && uri.value && util.contains(uri.value.toLowerCase(), ".mp3")) {
            return uri.value;
        }

        let encUrl: I.PropertyInfo = props.getNodeProperty("meta64:rssItemEncUrl", node);
        if (encUrl && encUrl.value) {
            let encType: I.PropertyInfo = props.getNodeProperty("meta64:rssItemEncType", node);
            if (encType && encType.value && util.startsWith(encType.value, "audio/")) {
                return encUrl.value;
            }
        }

        return null;
    }

    openPlayerDialog(_uid: string) {
        debugger;
        podcast.uid = _uid;
        podcast.node = meta64.uidToNodeMap[podcast.uid];

        if (podcast.node) {
            let mp3Url = podcast.getMediaPlayerUrlFromNode(podcast.node);
            if (mp3Url) {
                util.ajax<I.GetPlayerInfoRequest, I.GetPlayerInfoResponse>("getPlayerInfo", {
                    "url": mp3Url
                }, (res: I.GetPlayerInfoResponse) => {
                    podcast.parseAdSegmentUid(podcast.uid);

                    Factory.createDefault("AudioPlayerDlgImpl", (dlg: AudioPlayerDlg) => {
                        dlg.open();
                    }, { "sourceUrl": mp3Url, "nodeUid": podcast.uid, "startTimePending": res.timeOffset });
                });
            }
        }
    }

    private parseAdSegmentUid(_uid: string) {
        if (podcast.node) {
            let adSegs: I.PropertyInfo = props.getNodeProperty("ad-segments", podcast.node);
            if (adSegs) {
                podcast.parseAdSegmentText(adSegs.value);
            }
        }
        else throw "Unable to find node uid: " + podcast.uid;
    }

    private parseAdSegmentText(adSegs: string) {
        podcast.adSegments = [];

        let segList: string[] = adSegs.split("\n");
        for (let seg of segList) {
            let segTimes: string[] = seg.split(",");
            if (segTimes.length != 2) {
                console.log("invalid time range: " + seg);
                continue;
            }

            let beginSecs: number = podcast.convertToSeconds(segTimes[0]);
            let endSecs: number = podcast.convertToSeconds(segTimes[1]);

            podcast.adSegments.push(new I.AdSegment(beginSecs, endSecs));
        }
    }

    /* convert from fomrat "minutes:seconts" to absolute number of seconds
    *
    * todo-1: make this accept just seconds, or min:sec, or hour:min:sec, and be able to
    * parse any of them correctly.
    */
    private convertToSeconds(timeVal: string) {
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

    restoreStartTime() {
        /* makes player always start wherever the user last was when they clicked "pause" */
        if (podcast.player && podcast.startTimePending) {
            podcast.player.currentTime = podcast.startTimePending;
            podcast.startTimePending = null;
        }
    }

    onCanPlay(dlg: AudioPlayerDlg): void {
        podcast.player = dlg.getAudioElement();
        podcast.restoreStartTime();
        podcast.player.play();
    }

    onTimeUpdate(dlg: AudioPlayerDlg): void {
        //console.log("CurrentTime=" + elm.currentTime);
        podcast.player = dlg.getAudioElement();

        if (!podcast.pushTimer) {
            /* ping server once every five minutes */
            podcast.pushTimer = setInterval(podcast.pushTimerFunction, 5 * 60 * 1000);
        }

        /* todo-1: we call restoreStartTime upon loading of the component but it doesn't seem to have the effect doing anything at all
        and can't even update the slider displayed position, until playins is STARTED. Need to come back and fix this because users
        currently have the glitch of always hearing the first fraction of a second of video, which of course another way to fix
        would be by altering the volumn to zero until restoreStartTime has gone into effect */
        podcast.restoreStartTime();

        if (!podcast.adSegments) return;
        for (let seg of podcast.adSegments) {
            /* endTime of -1 means the rest of the media should be considered ADs */
            if (podcast.player.currentTime >= seg.beginTime && //
                (podcast.player.currentTime <= seg.endTime || seg.endTime < 0)) {

                /* jump to end of audio if rest is an add, with logic of -3 to ensure we don't
                go into a loop jumping to end over and over again */
                if (seg.endTime < 0 && podcast.player.currentTime < podcast.player.duration - 3) {
                    /* jump to last to seconds of audio, i'll do this instead of pausing, in case
                     there are is more audio automatically about to play, we don't want to halt it all */
                    podcast.player.loop = false;
                    podcast.player.currentTime = podcast.player.duration - 2;
                }
                /* or else we are in a comercial segment so jump to one second past it */
                else {
                    podcast.player.currentTime = seg.endTime + 1;
                }
                return;
            }
        }
    }

    pushTimerFunction(): void {
        //console.log("pushTimer");
        /* the purpose of this timer is to be sure the browser session doesn't timeout while user is playing
        but if the media is paused we DO allow it to timeout. Othwerwise if user is listening to audio, we
        contact the server during this timer to update the time on the server AND keep session from timing out

        todo-1: would everything work if 'player' WAS the jquery object always?
        */
        if (podcast.player && !podcast.player.paused) {
            /* this safety check to be sure no hidden audio can still be playing should no longer be needed
            now that I have the close litener even on the dialog, but i'll leave this here anyway. Can't hurt. */
            if (!util.isElmVisible(podcast.player)) {
                console.log("closing player, because it was detected as not visible. player dialog get hidden?");
                podcast.player.pause();
            }
            //console.log("Autosave player info.");
            podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);
        }
    }

    //This podcast handling hack is only in this file temporarily
    pause(): void {
        if (podcast.player) {
            podcast.player.pause();
            podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);
        }
    }

    destroyPlayer(dlg: AudioPlayerDlg): void {
        if (podcast.player) {
            console.log("player.pause()");
            podcast.player.pause();

            setTimeout(() => {
                console.log("savePlayerInfo");
                podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);

                //let localPlayer = podcast.player;
                podcast.player = null;
                //localPlayer.remove();

                if (dlg) {
                    dlg.cancel();
                }
            }, 250);
        }
    }

    play(): void {
        if (podcast.player) {
            podcast.player.play();
        }
    }

    speed(rate: number): void {
        if (podcast.player) {
            podcast.player.playbackRate = rate;
        }
    }

    //This podcast handling hack is only in this file temporarily
    skip(delta: number): void {
        if (podcast.player) {
            podcast.player.currentTime += delta;
        }
    }

    savePlayerInfo(url: string, timeOffset: number): void {
        if (meta64.isAnonUser) return;

        util.ajax<I.SetPlayerInfoRequest, I.SetPlayerInfoResponse>("setPlayerInfo", {
            "url": url,
            "timeOffset": timeOffset
        }, podcast.setPlayerInfoResponse);
    }

    private setPlayerInfoResponse(): void {
        //alert('save complete.');
    }
}
export let podcast: Podcast = new Podcast();
export default podcast;
