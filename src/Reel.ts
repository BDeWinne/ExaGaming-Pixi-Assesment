/// <reference types="pixi.js" />

import { SymbolView } from './SymbolView.js';
import { WinChecker } from './WinChecker.js';
import { SoundManager } from './SoundManager.js';

export class Reel {
    // @ts-ignore
    public container: PIXI.Container;
    private symbolViews: SymbolView[] = [];
    private reelStrip: string[];
    private symbolHeight: number;
    private reelLength: number;
    private position: number = 0;
    private spinning = false;
    private stopping = false;
    private spinStep = 0.4;
    private spinDuration = 3000;
    private spinTime = 0;
    private winCallback: (() => void) | null = null;
    private stopCallback: (() => void) | null = null;

    constructor(reelStrip: string[], symbolHeight: number, reelLength: number, forced = false) {
        this.reelStrip = reelStrip;
        this.symbolHeight = symbolHeight;
        this.reelLength = reelLength;
        // @ts-ignore
        this.container = new PIXI.Container();

        for (let i = 0; i < reelLength + 1; i++) {
            const symbol = new SymbolView(reelStrip[i % reelStrip.length]);
            symbol.container.y = i * symbolHeight;
            this.container.addChild(symbol.container);
            this.symbolViews.push(symbol);
        }

        // --- MÁSCARA ---
        // @ts-ignore
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(
            0,
            0,
            200, // ancho del reel (ajusta si tu símbolo es más ancho)
            symbolHeight * reelLength
        );
        mask.endFill();
        this.container.addChild(mask);
        this.container.mask = mask;
    }

    public startSpin() {
        this.spinning = true;
        this.stopping = false;
        this.spinTime = 0;
        this.position = Math.floor(Math.random() * this.reelStrip.length);
    }

    public stopSpin() {
        this.stopping = true;
    }

    public onWin(cb: () => void) {
        this.winCallback = cb;
    }

    public onStop(cb: () => void) {
        this.stopCallback = cb;
    }

    public update(delta: number) {
        if (!this.spinning) return;

        this.spinTime += delta;
        if (!this.stopping && this.spinTime < this.spinDuration) {
            this.position -= this.spinStep;
        } else if (!this.stopping) {
            this.stopping = true;
        }

        if (this.stopping) {
            const target = Math.round(this.position);
            const diff = target - this.position;
            if (Math.abs(diff) < 0.02) {
                this.position = target;
                this.spinning = false;
                this.stopping = false;
                SoundManager.stopSpin(); // <--- Detén el sonido de spin aquí
                SoundManager.playStop(); // Sonido al frenar el reel
                if (WinChecker.isWin(this.reelStrip, Math.floor(this.position) % this.reelStrip.length, this.reelLength) && this.winCallback) {
                    SoundManager.playWin(); // Sonido de win
                    this.winCallback();
                } else if (this.stopCallback) {
                    this.stopCallback();
                }
            } else {
                this.position += diff * 0.2;
            }
        }

        this.updateSymbols();
    }

    private updateSymbols() {
        const baseIndex = Math.floor(this.position);
        const offset = this.position - baseIndex;
        for (let i = 0; i < this.symbolViews.length; i++) {
            let symbolIdx = (baseIndex + i) % this.reelStrip.length;
            if (symbolIdx < 0) symbolIdx += this.reelStrip.length;
            this.symbolViews[i].setLabel(this.reelStrip[symbolIdx]);
            this.symbolViews[i].container.y = (i - offset) * this.symbolHeight;
        }
    }
}