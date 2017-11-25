console.log("NavIntf.ts");

import * as I from "../Interfaces";

export interface NavIntf {
    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f : any) 
    
    _UID_ROWID_PREFIX: string ;

    /* todo-1: eventually when we do paging for other lists, we will need a set of these variables for each list display (i.e. search, timeline, etc) */
    mainOffset: number;
    endReached: boolean ;

    /* todo-1: need to have this value passed from server rather than coded in TypeScript, however for now 
    this MUST match this.ROWS_PER_PAGE variable in TypeScript */
    ROWS_PER_PAGE: number ;

    search (): void ;
    searchTags (): void ;

    searchFiles (): void ;

    editMode (): void ;

    login (): void ;

    logout (): void ;

    signup (): void ;

    preferences (): void ;

    openMainMenuHelp (): void ;

    openRssFeedsNode (): void ;

    browseSampleContent (): void ;

    displayingHome (): boolean ;

    parentVisibleToUser (): boolean ;

    upLevelResponse (res: I.RenderNodeResponse, id): void ;

    navUpLevel (): void ;
    /*
     * turn of row selection DOM element of whatever row is currently selected
     */
    getSelectedDomElement (): HTMLElement ;
    /*
     * turn of row selection DOM element of whatever row is currently selected
     */
    getSelectedPolyElement (): HTMLElement ;
    clickOnNodeRow (uid: string): void ;

    openNode (uid): void ;

    toggleNodeSel (selected: boolean, uid: string): void ;
    navPageNodeResponse (res: I.RenderNodeResponse): void ;

    navHome (): void ;

    navPublicHome (): void ;
}
