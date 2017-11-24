import { Comp } from "./base/Comp";
export declare class Checkbox extends Comp {
    constructor(label?: string, checked?: boolean, _attribs?: Object);
    setChecked(checked: boolean): void;
    getChecked(): boolean;
    renderHtml: () => string;
}
