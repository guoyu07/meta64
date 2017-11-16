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

    /* Override refreshState for menus to simply make them visible based on whether any of the
    contained items are visible */
    refreshState(): void {
        /* first we all base refreshState() so that everything under this node gets update before we do the logic we need to do in here
        or else what we are doing definitely will not work */
        super.refreshState();
        super.setVisibleIfAnyChildrenVisible();
    }

    //comes from original 'makeTopLevelMenu'
    renderHtml = (): string => {
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
