/// <reference types="pixi.js" />

import { SymbolView } from './SymbolView.js';
import { WinChecker } from './WinChecker.js';
import { SoundManager } from './SoundManager.js';

export class Reel {
    //@ts-ignore
    public container: PIXI.Container;
    private symbolViews: SymbolView[] = [];
    private reelStrip: string[];
    private symbolHeight: number;
    private reelLength: number;
    private position: number = 0;
    private spinning = false;
    private stopping = false;
    private spinStep: number;
    private spinDuration: number;
    private spinTime = 0;
    private winCallback: (() => void) | null = null;
    private stopCallback: (() => void) | null = null;
    private ease: number;

    constructor(
        reelStrip: string[],
        symbolHeight: number,
        reelLength: number,
        options: { spinStep?: number; spinDuration?: number; ease?: number } = {}
    ) {
        this.reelStrip = reelStrip;
        this.symbolHeight = symbolHeight;
        this.reelLength = reelLength;
        this.container = new PIXI.Container();
        this.spinStep = options.spinStep ?? 0.4;
        this.spinDuration = options.spinDuration ?? 3000;
        this.ease = options.ease ?? 0.2;

        for (let i = 0; i < reelLength + 1; i++) {
            const symbol = new SymbolView(reelStrip[i % reelStrip.length]);
            symbol.container.y = i * symbolHeight;
            this.container.addChild(symbol.container);
            this.symbolViews.push(symbol);
        }

        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(
            0,
            0,
            200, 
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
                SoundManager.stopSpin(); 
                SoundManager.playStop(); 
                if (WinChecker.isWin(this.reelStrip, Math.floor(this.position) % this.reelStrip.length, this.reelLength) && this.winCallback) {
                    SoundManager.playWin();
                    this.animateWinSymbols(); 
                    this.winCallback();
                } else if (this.stopCallback) {
                    this.stopCallback();
                }
            } else {
                this.position += diff * this.ease;
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

    private animateWinSymbols() {
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

    public destroy() {
        for (const symbol of this.symbolViews) {
            symbol.destroy();
        }
        this.container.removeChildren();
        this.container.destroy();
    }

    public getVisibleSymbols(): string[] {
        const baseIndex = Math.floor(this.position);
        const symbols: string[] = [];
        for (let i = 0; i < this.reelLength; i++) {
            let symbolIdx = (baseIndex + i) % this.reelStrip.length;
            if (symbolIdx < 0) symbolIdx += this.reelStrip.length;
            symbols.push(this.reelStrip[symbolIdx]);
        }
        return symbols;
    }
}