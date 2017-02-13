console.log("Tag.ts");

import { util } from "./Util";
import { render } from "./Render";

/* Eventually I will have ALL tags defined here, so they are decoupled from their rendering details, and
basically pluggable.
*/
export class Tag {

    img = function(attr: Object): string {
        return render.tag("img", attr, null, false);
    }

    a = function(attr: Object, content:string): string {
        return render.tag("a", attr, content);
    }

    div = function(attr?: Object, content?:string): string {
        return render.tag("div", attr, content, true);
    }
}

export let tag: Tag = new Tag();
export default tag;
