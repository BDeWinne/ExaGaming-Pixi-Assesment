/// <reference types="pixi.js" />


const SYMBOL_COLORS: Record<string, number> = {
    '🍒': 0xffcccc,
    '🍋': 0xffff99,
    '🍊': 0xffcc66,
    '🔔': 0xffee88,
    '⭐': 0xffffcc,
};

export class SymbolView {
    // @ts-ignore
    public container: PIXI.Container;
    private label: string = '';

    constructor(label: string) {
        // @ts-ignore
        this.container = new PIXI.Container();
        this.setLabel(label);
    }

    setLabel(label: string) {
        if (this.label === label) return;
        this.label = label;
        this.container.removeChildren();
        // @ts-ignore
        const graphics = new PIXI.Graphics();
        const color = SYMBOL_COLORS[label] ?? 0xffffff;
        graphics.beginFill(color);
        graphics.drawRoundedRect(0, 0, 200, 90, 10);
        graphics.endFill();
        this.container.addChild(graphics);
// @ts-ignore
        const text = new PIXI.Text(label, { fontSize: 40, fill: 0x000000 });
        text.anchor.set(0.5);
        text.x = 100;
        text.y = 45;
        this.container.addChild(text);
    }
}