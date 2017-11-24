import { AudioPlayerDlg } from "./AudioPlayerDlg";
import * as I from "./Interfaces";
export declare class Podcast {
    postConstruct(_f: any): void;
    player: HTMLAudioElement;
    startTimePending: number;
    private uid;
    private node;
    private adSegments;
    private pushTimer;
    generateRSS: () => void;
    private generateRSSResponse;
    getMediaPlayerUrlFromNode: (node: I.NodeInfo) => string;
    openPlayerDialog: (_uid: string) => void;
    private parseAdSegmentUid;
    private parseAdSegmentText;
    private convertToSeconds;
    restoreStartTime: () => void;
    onCanPlay: (dlg: AudioPlayerDlg) => void;
    onTimeUpdate: (dlg: AudioPlayerDlg) => void;
    pushTimerFunction: () => void;
    pause: () => void;
    destroyPlayer: (dlg: AudioPlayerDlg) => void;
    play: () => void;
    speed: (rate: number) => void;
    skip: (delta: number) => void;
    savePlayerInfo: (url: string, timeOffset: number) => void;
    private setPlayerInfoResponse();
}
