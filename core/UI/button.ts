import Sprite from "../sprite.js";

class Button extends Sprite {
    handler = () => console.log("Handler not implemented!");

    constructor(uri: string, handler: () => void) {
        super(uri);
        this.handler = handler;
    }

    clicked() {
        return true;
    }
}

export default Button;