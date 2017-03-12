console.log("Menu`.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";
import { MenuItem } from "./MenuItem";
import { util } from "../Util";

export class Menu extends Comp {

    constructor(public name: string, menuItems: MenuItem[]) {
        super({
            "label": name,
            "selectable": ""
        });
        this.setChildren(menuItems);
    }

    //comes from original 'makeTopLevelMenu'
    render = (): string => {
        let paperItem = tag.menuItem({
            class: "menu-trigger"
        }, this.name);

        let internalItems = tag.menu({
            "class": "menu-content sublist my-menu-section",
            "selectable": ""
            //"multi": "multi"
        }, this.renderChildren());

        return tag.subMenu(this.attribs
            //{
            //"label": title,
            //"class": "meta64-menu-heading",
            //"class": "menu-content sublist"
            //}
            , paperItem + //"<paper-item class='menu-trigger'>" + title + "</paper-item>" + //
            internalItems);
    }
}
