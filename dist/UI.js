/// <reference types="pixi.js" />
import { Loader } from './Loader.js';
export class UI {
    // @ts-ignore
    static createSpinButton(app, onClick) {
        const texture = Loader.getTexture('spinButton');
        // @ts-ignore
        const button = new PIXI.Sprite(texture);
        button.anchor.set(0.5);
        button.scale.set(0.5);
        button.x = app.screen.width / 2;
        button.y = app.screen.height - 100;
        button.interactive = true;
        button.buttonMode = true;
        button.cursor = 'pointer';
        button.on('pointertap', onClick);
        app.stage.addChild(button);
        // Método para habilitar/deshabilitar visualmente el botón
        button.setEnabled = (enabled) => {
            button.interactive = enabled;
            button.buttonMode = enabled;
            button.alpha = enabled ? 1 : 0.5;
            button.cursor = enabled ? 'pointer' : 'not-allowed';
            // Si quieres un tooltip visual, puedes agregar un PIXI.Text cerca del botón aquí
        };
        return button;
    }
    // @ts-ignore
    static showWinMessage(app) {
        // @ts-ignore
        const winText = new PIXI.Text('You Win!', {
            fontSize: 64,
            fill: 0x00cc00,
            fontWeight: 'bold',
            stroke: 0xffffff,
            strokeThickness: 6,
            align: 'center'
        });
        const MESSEGE_Y_OFFSET = -200;
        winText.anchor.set(0.5);
        winText.x = app.screen.width / 2;
        winText.y = app.screen.height / 2 + MESSEGE_Y_OFFSET;
        winText.zIndex = 1000;
        app.stage.addChild(winText);
        setTimeout(() => {
            app.stage.removeChild(winText);
            winText.destroy();
        }, 1500);
    }
}
