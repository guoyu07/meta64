console.log("Tag.ts");

import { util } from "./Util";
import { render } from "./Render";
import { domBind } from "./DomBind";

/* Eventually I will have ALL tags defined here, so they are decoupled from their rendering details, and
fully pluggable. The goal here is not only clean code but full decoupling FROM Polymer.
*/
export class Tag {

    img(attr: Object): string {
        return render.tag("img", attr, null, false);
    }

    a(attr: Object, content: string): string {
        return render.tag("a", attr, content);
    }

    table(attr: Object, content: string): string {
        return render.tag("table", attr, content);
    }

    tr(attr: Object, content: string): string {
        return render.tag("tr", attr, content);
    }

    td(attr: Object, content: string): string {
        return render.tag("tr", attr, content);
    }

    div(attr?: Object, content?: string): string {
        return render.tag("div", attr, content || "", true);
    }

    h2(attr?: Object, content?: string): string {
        return render.tag("h2", attr, content, true);
    }

    span(attr?: Object, content?: string): string {
        return render.tag("span", attr, content, true);
    }

    legend(attr?: Object, content?: string): string {
        return render.tag("legend", attr, content, true);
    }

    textarea(attr?: Object): string {
        return render.tag("paper-textarea", attr, "", true);
    }

    dialog(attr: Object, content: string): string {
        return render.tag("paper-dialog", attr, content, true);
    }

    /* We encapsulate/decouple here smartly so that if there's an 'icon' property, we automatically use an paper-icon-button instead of
    a plain paper-button */
    button(attr?: Object, text?: string): string {
        let tagName = (<any>attr).icon ? "paper-icon-button" : "paper-button";
        return render.tag(tagName, attr, text, true);
    }

    radioButton(attr?: Object, text?: string): string {
        // domBind.addOnChange((<any>attr).id, (event) => {
        //     console.log("checkbox ID: " + (<any>attr).id + " checked=" + (<any>event.target).checked  + ". Proof of id: " + event.target.getAttribute("id"));
        // });
        return render.tag("paper-radio-button", attr, text);
    }

    radioGroup(attr?: Object, content?: string): string {
        return render.tag("paper-radio-group", attr, content);
    }

    input(attr?: Object): string {
        return render.tag("paper-input", attr, "", true);
    }

    checkbox(attr?: Object): string {
        // domBind.addOnChange((<any>attr).id, (event) => {
        //     console.log("checkbox ID: " + (<any>attr).id + " checked=" + (<any>event.target).checked + ". Proof of id: " + event.target.getAttribute("id"));
        // });

        let ret = render.tag("paper-checkbox", attr, "", false);

        if ((<any>attr).label) {
            ret += render.tag("label", {
                "for": (<any>attr).id
            }, (<any>attr).label, true);
        }
        return this.span(null, ret);
    }

    progress(attr?: Object): string {
        return render.tag("paper-progress", attr);
    }

    item(attr?: Object, content?: string): string {
        return render.tag("paper-item", attr, content, true);
    }

    menu(attr?: Object, content?: string): string {
        return render.tag("paper-menu", attr, content, true);
    }

    subMenu(attr?: Object, content?: string): string {
        return render.tag("paper-submenu", attr, content, true);
    }

    form(attr: Object, content: string): string {
        return render.tag("form", attr, content);
    }

    dlgSectionHeading(name: string): string {
        return `<h3>${name}</h3>`;
    }
}

export let tag: Tag = new Tag();
export default tag;
