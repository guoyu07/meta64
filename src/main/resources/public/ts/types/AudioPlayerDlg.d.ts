import { DialogBase } from "./DialogBase";
import { AudioPlayer } from "./widget/AudioPlayer";
export declare class AudioPlayerDlg extends DialogBase {
    audioPlayer: AudioPlayer;
    private sourceUrl;
    private nodeUid;
    private startTimePending;
    private node;
    constructor(args: Object);
    buildGUI: () => void;
    getAudioElement(): HTMLAudioElement;
    cancel(): void;
    pauseButton: () => void;
    playButton: () => void;
    speed2Button: () => void;
    speed15Button: () => void;
    normalSpeedButton: () => void;
    skipBack30Button: () => void;
    skipForward30Button: () => void;
    closeEvent: () => void;
    closeBtn: () => void;
    init: () => void;
}
