import { Comp } from "./base/Comp";
import { MenuItem } from "./MenuItem";
export declare class Menu extends Comp {
    name: string;
    constructor(name: string, menuItems: MenuItem[]);
    refreshState(): void;
    renderHtml: () => string;
}
