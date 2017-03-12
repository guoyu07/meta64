console.log("MenuPanel.ts");

/* todo-0: really need Comp to be an interface too, but for now I just simulate that with the methods needed */
export interface MenuPanel {
    render(): string;

    refreshState(): void;
}
