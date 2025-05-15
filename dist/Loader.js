/// <reference types="pixi.js" />
export class Loader {
    static loadAssets(onComplete) {
        const loader = PIXI.Loader.shared;
        loader.add('spinButton', './assets/sprites/spin-button.png');
        loader.load(() => onComplete());
    }
    //@ts-ignore
    static getTexture(name) {
        return PIXI.Loader.shared.resources[name].texture;
    }
}
