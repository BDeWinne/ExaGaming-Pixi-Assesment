export class WinChecker {
    static isWin(strip, baseIndex, reelLength) {
        const visible = [];
        for (let i = 0; i < reelLength; i++) {
            let idx = (baseIndex + i) % strip.length;
            if (idx < 0)
                idx += strip.length;
            visible.push(strip[idx]);
        }
        return visible.every(sym => sym === visible[0]);
    }
}
