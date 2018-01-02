console.log("Menu.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { MenuItem } from "./MenuItem";
import { Div } from "./Div";
import { Anchor } from "./Anchor";
import { Ul } from "./Ul";
import { Li } from "./Li";

declare var tag, util;

export class Menu extends Comp {

    constructor(public name: string, menuItems: MenuItem[]) {
        super(null);
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

    //todo-1: I think instead of 'card' here i should try out just plain 'list-group' because the card is really not the appropriate thing here.
    renderHtml = (): string => {
        let menu =
            new Div(null, {
                class: "card"
            },
                [
                    new Div(null, {
                        "class": "card-header",
                        role: "tab",
                        id: "heading" + this.getId()
                    },
                        [
                            new Div(null, { 
                                "class": "mb-0"
                            },
                                [
                                    new Div(this.name, {
                                        "data-toggle": "collapse",
                                        "href": "#collapse" + this.getId(),
                                        "aria-expanded": "false",
                                        "aria-controls": "collapse" + this.getId(),
                                        //"role" : "button" //<--makes mouse cursor correct (didn't work. stackoverflow was wrong)
                                    })
                                ]
                            )
                        ]
                    ),
                    new Div(null, {
                        id: "collapse" + this.getId(),
                        "class": "collapse", // "collapse show",
                        role: "tabpanel",
                        "aria-labelledby": "heading" + this.getId(),
                        "data-parent": "#accordion"
                    },
                        [
                            new Div(null, {
                                "class": "card-body"
                            },
                                [
                                    new Div(null, {
                                        "class": "list-group flex-column"
                                    },
                                        this.children
                                    )
                                ]
                            )
                        ]
                    )
                ]
            );

        return menu.renderHtml();
    };
}
