import { AudioPlayerDlg } from "../dlg/AudioPlayerDlg";
import * as I from "../Interfaces";

/*
NOTE: The AudioPlayerDlg AND this singleton-ish class both share some state and cooperate

Reference: https://www.w3.org/2010/05/video/mediaevents.html
*/
export interface PodcastIntf {
    
    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any) ;
    player: HTMLAudioElement ;
    startTimePending: number ;

    generateRSS(): void ;

    getMediaPlayerUrlFromNode(node: I.NodeInfo): string ;
    openPlayerDialog(_uid: string) ;

    restoreStartTime() ;

    onCanPlay(dlg: AudioPlayerDlg): void;

    onTimeUpdate(dlg: AudioPlayerDlg): void ;
    pushTimerFunction(): void ;

    //This podcast handling hack is only in this file temporarily
    pause(): void ;

    destroyPlayer(dlg: AudioPlayerDlg): void ;

    play(): void ;
    speed(rate: number): void;

    //This podcast handling hack is only in this file temporarily
    skip(delta: number): void ;

    savePlayerInfo(url: string, timeOffset: number): void ;
}
