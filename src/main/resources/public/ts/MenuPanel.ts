console.log("MenuPanel.ts");

export interface MenuPanel {
    renderHtml(): string;
    refreshState(): void;
}
