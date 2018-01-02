console.log("TagIntf.ts");

import {Singletons} from "../Singletons";

export interface TagIntf {
    img(attr: Object): string;
    a(attr: Object, content: string): string;
    table(attr: Object, content: string): string;
    tr(attr: Object, content: string): string;
    td(attr: Object, content: string): string;
    div(attr?: Object, content?: string): string;
    heading(level: number, content: string): string;
    h2(attr?: Object, content?: string): string;
    span(attr?: Object, content?: string): string;
    legend(attr?: Object, content?: string): string;
    textarea(attr?: Object): string;
    dialog(attr: Object, content: string): string;
    button(attr?: Object, text?: string): string;
    radioButton(attr?: Object, text?: string): string;
    radioGroup(attr?: Object, content?: string): string;
    input(attr?: Object): string;
    checkbox(attr?: Object): string;
    audio(attr: Object, content: string): string;
    progress(attr?: Object): string;
    form(attr: Object, content: string): string;
    dlgSectionHeading(name: string): string;
}
