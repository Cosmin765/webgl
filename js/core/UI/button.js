import Sprite from "../sprite.js";
class Button extends Sprite {
    constructor(uri, handler) {
        super(uri);
        this.handler = () => console.log("Handler not implemented!");
        this.handler = handler;
    }
    clicked() {
        return true;
    }
}
export default Button;
//# sourceMappingURL=button.js.map