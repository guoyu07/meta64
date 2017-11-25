console.log("TagImpl.ts");

/* Eventually I will have ALL tags defined here, so they are decoupled from their rendering details, and
fully pluggable. The goal here is not only clean code but full decoupling FROM Polymer.
*/
export interface TagIntf {

    postConstruct(_f : any) ;

    img (attr: Object): string ;

    a (attr: Object, content: string): string ;

    table (attr: Object, content: string): string ;

    tr (attr: Object, content: string): string ;

    td (attr: Object, content: string): string;

    div (attr?: Object, content?: string): string ;

    heading (level: number, content: string): string ;

    //todo-1: remove this and use heading() always instead
    h2 (attr?: Object, content?: string): string ;

    span (attr?: Object, content?: string): string ;

    legend (attr?: Object, content?: string): string ;

    textarea (attr?: Object): string ;

    dialog (attr: Object, content: string): string ;

    /* We encapsulate/decouple here smartly so that if there's an 'icon' property, we automatically use an paper-icon-button instead of
    a plain paper-button,

    todo-1: actually this is bad. What we need is the ability to also show a 'paper-button' that has an icon next to the text! Is this possible in polymer?
    */
    button (attr?: Object, text?: string): string ;

    radioButton (attr?: Object, text?: string): string ;

    radioGroup (attr?: Object, content?: string): string ;

    input (attr?: Object): string ;

    checkbox (attr?: Object): string ;

    audio (attr: Object, content: string): string ;

    progress (attr?: Object): string ;

    menuItem (attr?: Object, content?: string): string ;

    menu (attr?: Object, content?: string): string ;

    subMenu (attr?: Object, content?: string): string ;

    form (attr: Object, content: string): string ;

    dlgSectionHeading (name: string): string ;
}
