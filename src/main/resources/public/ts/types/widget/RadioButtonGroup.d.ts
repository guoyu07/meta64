import { Comp } from "./base/Comp";
import { RadioButton } from "./RadioButton";
export declare class RadioButtonGroup extends Comp {
    constructor(initialButtons?: RadioButton[]);
    renderHtml: () => string;
}
