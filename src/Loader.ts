/// <reference types="pixi.js" />

export class Loader {
    static loadAssets(onComplete: () => void) {
        const loader = PIXI.Loader.shared;
        loader.add('spinButton', './assets/sprites/spin-button.png');
        loader.load(() => onComplete());
    }
//@ts-ignore
    static getTexture(name: string): PIXI.Texture {
        return PIXI.Loader.shared.resources[name].texture;
    }
}