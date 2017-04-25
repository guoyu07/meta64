console.log("MenuPanel.ts");

export interface MenuPanel {
    render(): string;
    refreshState(): void;
}
