import { Comp } from "./base/Comp";
export declare class AudioPlayer extends Comp {
    attribs: Object;
    constructor(attribs: Object);
    getAudioElement(): HTMLAudioElement;
    renderHtml: () => string;
}
