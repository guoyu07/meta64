console.log("PodcastIntf.ts");

import { AudioPlayerDlg } from "../dlg/AudioPlayerDlg";
import * as I from "../Interfaces";
import {Singletons} from "../Singletons";

export interface PodcastIntf {
    player: HTMLAudioElement;
    startTimePending: number;
    generateRSS(): void;
    getMediaPlayerUrlFromNode(node: I.NodeInfo): string;
    openPlayerDialog(_uid: string);
    restoreStartTime();
    onCanPlay(dlg: AudioPlayerDlg): void;
    onTimeUpdate(dlg: AudioPlayerDlg): void;
    pushTimerFunction(): void;
    pause(): void;
    destroyPlayer(dlg: AudioPlayerDlg): void;
    play(): void;
    speed(rate: number): void;
    skip(delta: number): void;
    savePlayerInfo(url: string, timeOffset: number): void;
}
