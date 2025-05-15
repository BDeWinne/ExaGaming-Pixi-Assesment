/// <reference types="pixi.js" />
import { Loader } from './Loader.js';
import { SoundManager } from './SoundManager.js';

export class SpinButton extends PIXI.Sprite {
    // @ts-ignore
    private app: PIXI.Application;
// @ts-ignore
    constructor(texture: PIXI.Texture, app: PIXI.Application, onClick: () => void) {
        super(texture);
        this.app = app;
        this.anchor.set(0.5);
        this.scale.set(0.5);
        this.updatePosition();
        this.interactive = true;
        this.buttonMode = true;
        this.cursor = 'pointer';

        this.on('pointerdown', () => {
            this.scale.set(0.55);
            this.alpha = 0.85;
        });
        this.on('pointerup', () => {
            this.scale.set(0.5);
            this.alpha = 1;
        });
        this.on('pointerupoutside', () => {
            this.scale.set(0.5);
            this.alpha = 1;
        });

        this.on('pointertap', onClick);
        app.stage.addChild(this);
    }
// @ts-ignore
    updatePosition(reelContainer?: PIXI.Container) {
        this.x = this.app.screen.width / 2;
        if (reelContainer) {
            // Anclar justo debajo del reel, con un margen
            const margin = 40;
            this.y = reelContainer.y + reelContainer.height + margin;
        } else {
            // Fallback si no hay reel
            const minY = this.height / 2 + 10;
            const maxY = this.app.screen.height - this.height / 2 - 10;
            this.y = Math.max(minY, Math.min(maxY, this.app.screen.height - 100));
        }
    }

    setEnabled(enabled: boolean) {
        this.interactive = enabled;
        this.buttonMode = enabled;
        this.alpha = enabled ? 1 : 0.5;
        this.cursor = enabled ? 'pointer' : 'not-allowed';
    }
}

export class UI {
    static readonly WIN_DURATION: number = 2000;
//@ts-ignore
    static createSpinButton(app: PIXI.Application, onClick: () => void): SpinButton {
        const texture = Loader.getTexture('spinButton');
        return new SpinButton(texture, app, onClick);
    }

    static createRestartButton(onClick: () => void): HTMLButtonElement {
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.style.position = 'absolute';
        restartButton.style.top = '20px';
        restartButton.style.right = '20px';
        restartButton.style.padding = '10px 20px';
        restartButton.style.fontSize = '16px';
        restartButton.addEventListener('click', onClick);
        document.body.appendChild(restartButton);
        return restartButton;
    }
//@ts-ignore
    static showWinMessage(app: PIXI.Application) {
        const MESSAGE_Y_OFFSET = -200;
        const winText = new PIXI.Text('You Win!', {
            fontSize: 64,
            fill: 0x00cc00,
            fontWeight: 'bold',
            stroke: 0xffffff,
            strokeThickness: 6,
            align: 'center'
        });
        winText.anchor.set(0.5);
        winText.x = app.screen.width / 2;
        winText.y = app.screen.height / 2 + MESSAGE_Y_OFFSET;
        winText.zIndex = 1000;
        app.stage.addChild(winText);

        setTimeout(() => {
            app.stage.removeChild(winText);
            winText.destroy();
            SoundManager.stopWin();
        }, UI.WIN_DURATION);
    }
//@ts-ignore
    static showCloseMessage(app: PIXI.Application) {
        const MESSAGE_Y_OFFSET = -200;
        const closeText = new PIXI.Text('CLOSE', {
            fontSize: 48,
            fill: 0xff2222,
            fontWeight: 'bold',
            stroke: 0xffffff,
            strokeThickness: 6,
            align: 'center'
        });
        closeText.anchor.set(0.5);
        closeText.x = app.screen.width / 2;
        closeText.y = app.screen.height / 2 + MESSAGE_Y_OFFSET;
        closeText.zIndex = 1000;
        app.stage.addChild(closeText);

        setTimeout(() => {
            app.stage.removeChild(closeText);
            closeText.destroy();
        }, 1200);
    }
}