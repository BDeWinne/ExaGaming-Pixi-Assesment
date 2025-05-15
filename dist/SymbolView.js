/// <reference types="pixi.js" />
const SYMBOL_COLORS = {
    '🍒': 0xffcccc,
    '🍋': 0xffff99,
    '🍊': 0xffcc66,
    '🔔': 0xffee88,
    '⭐': 0xffffcc,
};
export class SymbolView {
    constructor(label) {
        this.label = '';
        this.container = new PIXI.Container();
        this.setLabel(label);
    }
    setLabel(label) {
        var _a;
        if (this.label === label)
            return;
        this.label = label;
        this.container.removeChildren();
        const graphics = new PIXI.Graphics();
        const color = (_a = SYMBOL_COLORS[label]) !== null && _a !== void 0 ? _a : 0xffffff;
        graphics.beginFill(color);
        graphics.drawRoundedRect(0, 0, 200, 90, 10);
        graphics.endFill();
        this.container.addChild(graphics);
        const text = new PIXI.Text(label, { fontSize: 40, fill: 0x000000 });
        text.anchor.set(0.5);
        text.x = 100;
        text.y = 45;
        this.container.addChild(text);
        this.text = text; // <-- Guarda referencia al texto
    }
    destroy() {
        this.container.removeChildren();
        this.container.destroy();
    }
}
