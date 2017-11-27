console.log("NavIntf.ts");

import * as I from "../Interfaces";
import {Singletons} from "../Singletons";

export interface NavIntf {
    _UID_ROWID_PREFIX: string;

    mainOffset: number;
    endReached: boolean;

    ROWS_PER_PAGE: number;

    search(): void;
    searchTags(): void;
    searchFiles(): void;
    editMode(): void;
    login(): void;
    logout(): void;
    signup(): void;
    preferences(): void;
    openMainMenuHelp(): void;
    openRssFeedsNode(): void;
    browseSampleContent(): void;
    displayingHome(): boolean;
    parentVisibleToUser(): boolean;
    upLevelResponse(res: I.RenderNodeResponse, id): void;
    navUpLevel(): void;
    getSelectedDomElement(): HTMLElement;
    getSelectedPolyElement(): HTMLElement;
    clickOnNodeRow(uid: string): void;
    openNode(uid): void;
    toggleNodeSel(selected: boolean, uid: string): void;
    navPageNodeResponse(res: I.RenderNodeResponse): void;
    navHome(): void;
    navPublicHome(): void;
}
