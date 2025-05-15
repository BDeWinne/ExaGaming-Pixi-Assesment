/// <reference types="pixi.js" />

export class Loader {
    static loadAssets(onComplete: () => void) {
        // @ts-ignore
        const loader = PIXI.Loader.shared;
        loader.add('spinButton', './assets/sprites/spin-button.png');
        // Agrega aquí más recursos si lo necesitas
        loader.load(() => onComplete());
    }
//@ts-ignore
    static getTexture(name: string): PIXI.Texture {
        // @ts-ignore
        return PIXI.Loader.shared.resources[name].texture;
    }
}