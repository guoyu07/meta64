console.log("DialogBase.ts");

export interface DialogBase {
    init(): void;
    closeEvent(): void;
    render(): string;
    open(): void;
    cancel(): void;
    id(id): string;
}
