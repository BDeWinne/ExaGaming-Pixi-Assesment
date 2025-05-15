declare const PIXI: typeof import('pixi.js');
/// <reference types="pixi.js" />
import * as PIXIModule from 'pixi.js';
declare global {
    const PIXI: typeof PIXIModule;
}