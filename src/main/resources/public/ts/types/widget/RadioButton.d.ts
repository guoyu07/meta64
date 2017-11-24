import { Comp } from "./base/Comp";
export declare class RadioButton extends Comp {
    label: string;
    checked: boolean;
    constructor(label: string, checked: boolean);
    setChecked(checked: boolean): void;
    getChecked(): boolean;
    renderHtml: () => string;
}
