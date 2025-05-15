/// <reference types="pixi.js" />
import { Reel } from './Reel.js';
import { ReelStrip } from './ReelStrip.js';
import { SoundManager } from './SoundManager.js';
import { UI, SpinButton } from './UI.js';
import { Loader } from './Loader.js';

const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

const REEL_STRIP = ReelStrip.getDefaultStrip();
const SYMBOL_HEIGHT = 100;
const REEL_LENGTH = 3;

let reel: Reel;
let spinButton: SpinButton;

Loader.loadAssets(() => {
    reel = new Reel(REEL_STRIP, SYMBOL_HEIGHT, REEL_LENGTH, {
        spinStep: 0.3,        //spin velocity (more = faster)
        spinDuration: 3000,   // spin duration
        ease: 0.3            // easing factor
    });

    reel.container.x = app.screen.width / 2 - 100;
    reel.container.y = app.screen.height / 2 - (SYMBOL_HEIGHT * REEL_LENGTH) / 2;
    app.stage.addChild(reel.container);

    spinButton = UI.createSpinButton(app, () => {
        spinButton.setEnabled(false);
        SoundManager.playSpin();
        reel.startSpin();
    });
    spinButton.updatePosition(reel.container);

    reel.onWin(() => {
        UI.showWinMessage(app);
        setTimeout(() => {
            spinButton.setEnabled(true);
        }, UI.WIN_DURATION); 
    });

    reel.onStop(() => {
        spinButton.setEnabled(true);

        const symbols = reel.getVisibleSymbols();
        const hasPair = symbols.some((sym, idx) => symbols.indexOf(sym) !== idx);
        if (hasPair) {
            UI.showCloseMessage(app);
        }
    });

    app.ticker.add(() => {
        reel.update(app.ticker.elapsedMS);
    });

    SoundManager.init();

});

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);

    reel.container.x = app.screen.width / 2 - 100;
    reel.container.y = app.screen.height / 2 - (SYMBOL_HEIGHT * REEL_LENGTH) / 2;
    if (spinButton) {
        spinButton.updatePosition(reel.container);
    }
});

