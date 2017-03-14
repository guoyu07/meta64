console.log("AudioPlayerDlg.ts");

import {DialogBase} from "./DialogBase";

export interface AudioPlayerDlg extends DialogBase {
    getAudioElement() : HTMLAudioElement;
}
