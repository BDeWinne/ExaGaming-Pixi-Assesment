/// <reference types="pixi.js" />
export class SoundManager {
    static init() {
        // Espera hasta que PIXI.sound esté disponible
        if (!PIXI.sound) {
            setTimeout(() => SoundManager.init(), 50);
            return;
        }
        if (!PIXI.sound.exists('spin')) {
            PIXI.sound.add('spin', { url: './assets/sounds/spin.mp3', loop: true });
        }
        if (!PIXI.sound.exists('stop')) {
            PIXI.sound.add('stop', './assets/sounds/stop.mp3');
        }
        if (!PIXI.sound.exists('win')) {
            PIXI.sound.add('win', './assets/sounds/win.mp3');
        }
    }
    static playSpin() {
        PIXI.sound.play('spin', { loop: true });
    }
    static stopSpin() {
        PIXI.sound.stop('spin');
    }
    static playStop() {
        PIXI.sound.play('stop');
    }
    static playWin() {
        PIXI.sound.play('win');
    }
    static stopWin() {
        PIXI.sound.stop('win');
    }
}
