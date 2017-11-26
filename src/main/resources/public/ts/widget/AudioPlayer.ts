console.log("AudioPlayer.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag;

//references:
//http://www.w3schools.com/tags/ref_av_dom.asp
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
export class AudioPlayer extends Comp {

    constructor(public attribs: Object) {
        super(attribs);
    }

    getAudioElement(): HTMLAudioElement {
        return <HTMLAudioElement>this.getElement();
    }

    renderHtml = (): string => {
        return tag.audio(this.attribs, this.renderChildren());
    }
}
