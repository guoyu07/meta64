console.log("Tag.ts");

import { Factory } from "./Factory";
import { RenderIntf as Render } from "./intf/RenderIntf";
import { TagIntf } from "./intf/TagIntf";
import { Singletons } from "./Singletons";
import { PubSub } from "./PubSub";
import { Constants } from "./Constants";

let render: Render;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    render = s.render;
});

/* Eventually I will have ALL tags defined here, so they are decoupled from their rendering details, and
fully pluggable. The goal here is not only clean code but full decoupling FROM Polymer.
*/
export class Tag implements TagIntf {

    img = (attr: Object): string => {
        return render.tag("img", attr, null, false);
    }

    a = (attr: Object, content: string): string => {
        return render.tag("a", attr, content);
    }

    table = (attr: Object, content: string): string => {
        return render.tag("table", attr, content);
    }

    tr = (attr: Object, content: string): string => {
        return render.tag("tr", attr, content);
    }

    td = (attr: Object, content: string): string => {
        return render.tag("td", attr, content);
    }

    div = (attr?: Object, content?: string): string => {
        return render.tag("div", attr, content || "", true);
    }

    heading = (level: number, content: string): string => {
        return render.tag("h" + level, null, content, true);
    }

    //todo-1: remove this and use heading() always instead
    h2 = (attr?: Object, content?: string): string => {
        return render.tag("h2", attr, content, true);
    }

    ul = (attr?: Object, content?: string): string => {
        return render.tag("ul", attr, content, true);
    }

    li = (attr?: Object, content?: string): string => {
        return render.tag("li", attr, content, true);
    }

    span = (attr?: Object, content?: string): string => {
        return render.tag("span", attr, content, true);
    }

    legend = (attr?: Object, content?: string): string => {
        return render.tag("legend", attr, content, true);
    }

    textarea = (attr?: Object, text : string = ""): string => {
        return render.tag("textarea", attr, text, true);
    }

    dialog = (attr: Object, content: string): string => {
        return render.tag("div", attr, content, true);
    }

    button = (attr?: Object, text?: string): string => {
        return render.tag("button", attr, text, true);
    }

    radioButton = (attr?: Object, text?: string): string => {
        
        // domBind.addOnChange((<any>attr).id, (event) => {
        //     console.log("checkbox ID: " + (<any>attr).id + " checked=" + (<any>event.target).checked  + ". Proof of id: " + event.target.getAttribute("id"));
        // });
        let input = render.tag("input", attr, text);
        let labelHtml = null;
        if ((<any>attr).label) {
            labelHtml = render.tag("label", {
                //"for": (<any>attr).id
                "class": "form-check-label"
            }, input /* + (<any>attr).label */, true);
            return this.div({ "class": "form-check" }, labelHtml);
        }
        return this.div({ "class": "form-check" }, input);
    }

    input = (attr?: Object): string => {
        return render.tag("input", attr, "", true);
    }

    label = (text: string, attr?: Object): string => {
        return render.tag("label", attr, text, true);
    }

    checkbox = (attr?: Object): string => {
        // domBind.addOnChange((<any>attr).id, (event) => {
        //     console.log("checkbox ID: " + (<any>attr).id + " checked=" + (<any>event.target).checked + ". Proof of id: " + event.target.getAttribute("id"));
        // });

        // let ret = render.tag("checkbox", attr, "", false);

        // if ((<any>attr).label) {
        //     ret += render.tag("label", {
        //         "for": (<any>attr).id
        //     }, (<any>attr).label, true);
        // }
        // return this.span(null, ret);

        let input = render.tag("input", attr);
        let labelHtml = null;
        if ((<any>attr).label) {
            labelHtml = render.tag("label", {
                //"for": (<any>attr).id
                "class": "form-check-label"
            }, input + (<any>attr).label, true);
            return this.div({ "class": "form-check" }, labelHtml);
        }
        return this.div({ "class": "form-check" }, input);
    }

    audio = (attr: Object, content: string): string => {
        return render.tag("audio", attr, content);
    }

    progress = (attr?: Object): string => {
        return render.tag("div", attr);
    }

    form = (attr: Object, content: string): string => {
        return render.tag("form", attr, content);
    }

    dlgSectionHeading = (name: string): string => {
        return `<h3>${name}</h3>`;
    }
}
