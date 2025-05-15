/// <reference types="pixi.js" />
import { SymbolView } from './SymbolView.js';
import { WinChecker } from './WinChecker.js';
import { SoundManager } from './SoundManager.js';
export class Reel {
    constructor(reelStrip, symbolHeight, reelLength, options = {}) {
        var _a, _b, _c;
        this.symbolViews = [];
        this.position = 0;
        this.spinning = false;
        this.stopping = false;
        this.spinTime = 0;
        this.winCallback = null;
        this.stopCallback = null;
        this.reelStrip = reelStrip;
        this.symbolHeight = symbolHeight;
        this.reelLength = reelLength;
        this.container = new PIXI.Container();
        this.spinStep = (_a = options.spinStep) !== null && _a !== void 0 ? _a : 0.4;
        this.spinDuration = (_b = options.spinDuration) !== null && _b !== void 0 ? _b : 3000;
        this.ease = (_c = options.ease) !== null && _c !== void 0 ? _c : 0.2;
        for (let i = 0; i < reelLength + 1; i++) {
            const symbol = new SymbolView(reelStrip[i % reelStrip.length]);
            symbol.container.y = i * symbolHeight;
            this.container.addChild(symbol.container);
            this.symbolViews.push(symbol);
        }
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 200, symbolHeight * reelLength);
        mask.endFill();
        this.container.addChild(mask);
        this.container.mask = mask;
    }
    startSpin() {
        this.spinning = true;
        this.stopping = false;
        this.spinTime = 0;
        this.position = Math.floor(Math.random() * this.reelStrip.length);
    }
    stopSpin() {
        this.stopping = true;
    }
    onWin(cb) {
        this.winCallback = cb;
    }
    onStop(cb) {
        this.stopCallback = cb;
    }
    update(delta) {
        if (!this.spinning)
            return;
        this.spinTime += delta;
        if (!this.stopping && this.spinTime < this.spinDuration) {
            this.position -= this.spinStep;
        }
        else if (!this.stopping) {
            this.stopping = true;
        }
        if (this.stopping) {
            const target = Math.round(this.position);
            const diff = target - this.position;
            if (Math.abs(diff) < 0.02) {
                this.position = target;
                this.spinning = false;
                this.stopping = false;
                SoundManager.stopSpin();
                SoundManager.playStop();
                if (WinChecker.isWin(this.reelStrip, Math.floor(this.position) % this.reelStrip.length, this.reelLength) && this.winCallback) {
                    SoundManager.playWin();
                    this.animateWinSymbols();
                    this.winCallback();
                }
                else if (this.stopCallback) {
                    this.stopCallback();
                }
            }
            else {
                this.position += diff * this.ease;
            }
        }
        this.updateSymbols();
    }
    updateSymbols() {
        const baseIndex = Math.floor(this.position);
        const offset = this.position - baseIndex;
        for (let i = 0; i < this.symbolViews.length; i++) {
            let symbolIdx = (baseIndex + i) % this.reelStrip.length;
            if (symbolIdx < 0)
                symbolIdx += this.reelStrip.length;
            this.symbolViews[i].setLabel(this.reelStrip[symbolIdx]);
            this.symbolViews[i].container.y = (i - offset) * this.symbolHeight;
        }
    }
    animateWinSymbols() {
        const duration = 30;
        let frame = 0;
        const winningSymbols = this.symbolViews.slice(0, this.reelLength);
        const animate = () => {
            frame++;
            const progress = Math.min(frame / duration, 1);
            const scale = 1 + 0.3 * Math.sin(Math.PI * progress);
            const rotation = 2 * Math.PI * progress;
            for (const symbol of winningSymbols) {
                if (symbol.text) {
                    symbol.text.scale.set(scale);
                    symbol.text.rotation = rotation;
                }
            }
            if (progress >= 1) {
                for (const symbol of winningSymbols) {
                    if (symbol.text) {
                        symbol.text.scale.set(1);
                        symbol.text.rotation = 0;
                    }
                }
                PIXI.Ticker.shared.remove(animate);
            }
        };
        PIXI.Ticker.shared.add(animate);
    }
    destroy() {
        for (const symbol of this.symbolViews) {
            symbol.destroy();
        }
        this.container.removeChildren();
        this.container.destroy();
    }
    getVisibleSymbols() {
        const baseIndex = Math.floor(this.position);
        const symbols = [];
        for (let i = 0; i < this.reelLength; i++) {
            let symbolIdx = (baseIndex + i) % this.reelStrip.length;
            if (symbolIdx < 0)
                symbolIdx += this.reelStrip.length;
            symbols.push(this.reelStrip[symbolIdx]);
        }
        return symbols;
    }
}
