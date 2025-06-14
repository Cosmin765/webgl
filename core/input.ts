import Renderer from "./renderer.js";


class Input {
    private static inputHandlers = new Map<string, (delta: number) => void>();
    private static keys = new Map<string, boolean>();

    static init() {
        addEventListener("keydown", e => this.keys.set(e.key, true));
        addEventListener("keyup", e => this.keys.set(e.key, false));

        Renderer.canvas.addEventListener("click", async () => {
            await Renderer.canvas.requestPointerLock();
        });
    }

    static addMouseMovementHandler(handler: (e: MouseEvent) => void) {
        document.addEventListener("pointerlockchange", e => {
            if (document.pointerLockElement === Renderer.canvas) {
                addEventListener("mousemove", handler);
            } else {
                removeEventListener("mousemove", handler);
            }
        });
    }

    static checkKey(key: string) {
        return this.keys.get(key) === true;
    }

    static addHandler(key: string, callback: (delta: number) => void) {
        this.inputHandlers.set(key, callback);
    }

    static removeHandler(key: string) {
        this.inputHandlers.delete(key);
    }

    static setHandlers(pairs: Iterable<[ string, (delta: number) => void ]>) {
        this.inputHandlers.clear();
        for(const [ key, callback ] of pairs) {
            this.addHandler(key, callback);
        }
    }

    static check(delta: number) {
        for(const [ key, callback ] of this.inputHandlers) {
            if (this.checkKey(key)) {
                callback(delta)
            }
        }
    }
}

export default Input;
