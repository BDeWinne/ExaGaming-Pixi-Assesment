# ExaGaming Pixi Assessment

## How to Run

1. Open the `index.html` file in a web browser (double-click or right-click → "Open with...").
2. Enjoy!

> **PS:** You can also use a local server, e.g. with `npx serve`.

---

## Short Logic Explanation (Class Overview)

- **Reel**: Handles the animation, spinning logic, stopping, symbol arrangement, and win detection for the slot machine reel. Exposes methods to start/stop spinning and register win/stop callbacks.
- **SymbolView**: Represents a single symbol on the reel. Responsible for rendering the symbol's graphics and label, and updating its appearance when the symbol changes.
- **UI**: Provides static methods to create and manage UI elements such as the spin button, restart button, and win message.
- **SpinButton**: Custom class extending `PIXI.Sprite` that encapsulates all behavior and visuals for the spin button, including positioning, interactivity, and visual feedback.
- **Loader**: Handles loading of assets required for the game before initialization.
- **SoundManager**: Manages playback and stopping of sound effects for spinning, stopping, and winning.
- **WinChecker**: Contains logic to determine if the current reel state is a winning combination.
- **App.ts**: Entry point that initializes the PIXI application, sets up the reel and UI, handles user interaction, and manages responsive layout.

---

**Brian De Winne - 05/15/2025**
