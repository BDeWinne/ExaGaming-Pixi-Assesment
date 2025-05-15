/// <reference types="pixi.js" />
import { Reel } from './Reel.js';
import { ReelStrip } from './ReelStrip.js';
import { SoundManager } from './SoundManager.js';
import { UI } from './UI.js';
import { Loader } from './Loader.js';
// @ts-ignore
const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

const REEL_STRIP = ReelStrip.getDefaultStrip();
const SYMBOL_HEIGHT = 100;
const REEL_LENGTH = 3;

const reel = new Reel(REEL_STRIP, SYMBOL_HEIGHT, REEL_LENGTH);

reel.container.x = app.screen.width / 2 - 100;
reel.container.y = app.screen.height / 2 - (SYMBOL_HEIGHT * REEL_LENGTH) / 2;
app.stage.addChild(reel.container);

Loader.loadAssets(() => {
    const spinButton = UI.createSpinButton(app, () => {
        spinButton.setEnabled(false);
        SoundManager.playSpin();
        reel.startSpin();
    });

    reel.onWin(() => {
        UI.showWinMessage(app);
        setTimeout(() => {
            spinButton.setEnabled(true);
        }, 1500); // Debe coincidir con la duración del mensaje de win
    });

    reel.onStop(() => {
        spinButton.setEnabled(true);
    });

    app.ticker.add(() => {
        reel.update(app.ticker.elapsedMS);
    });

    SoundManager.init();
});
