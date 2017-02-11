console.log("DialogBase.ts");

export interface DialogBase {
    init(): void;
    closeEvent(): void;
    build(): string;
    open(): void;
    cancel();
    id(id): string;
    elById(id): any;
    makePasswordField(text: string, id: string): string;
    makeEditField(fieldName: string, id: string);
    makeMessageArea(message: string, id?: string): string;
    makeButton(text: string, id: string, callback: any, ctx?: any): string;
    makeCloseButton(text: string, id: string, callback?: any, ctx?: any, initiallyVisible?: boolean, delayCloseCallback?: number): string;
    bindEnterKey(id: string, callback: any): void;
    setInputVal(id: string, val: string): void;
    getInputVal(id: string): string;
    setHtml(text: string, id: string): void;
    makeRadioButton(label: string, id: string): string;
    makeCheckBox(label: string, id: string, initialState: boolean): string;
    makeHeader(text: string, id?: string, centered?: boolean): string;
    focus(id: string): void;
}
