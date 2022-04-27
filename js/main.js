var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Renderer from "./core/renderer.js";
import { UniformType } from "./core/types.js";
import Drawable from "./core/drawable.js";
import { loadObj, hsvToRgb, degToRad } from "./core/utils.js";
import Button from "./core/UI/button.js";
window.onload = main;
let drawable = new Drawable();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield setup();
        const chair = new Drawable(yield loadObj("./assets/obj/chair.obj"));
        chair.supplyUniform("color", [1, 0, 1, 1]);
        Renderer.scene.addChild(chair);
        chair.translate([0, 0.5, 0]);
        const cup = new Drawable(yield loadObj("./assets/obj/cup.obj"));
        cup.supplyUniform("color", [1, 1, 0, 1]);
        Renderer.scene.addChild(cup);
        const button = new Button("./assets/button.png", () => console.log(this));
        Renderer.UI.addChild(button);
        button.translate([2, -5, 0]);
        Renderer.scene.rotate([1, 0, 0]);
        Renderer.loop((delta) => {
            Renderer.scene.rotate([0, 0.01, 0]);
        });
    });
}
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Renderer.init();
        Renderer.initDataInfo({
            attribInfo: [
                { name: "position", size: 3, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
                { name: "color", size: 4, type: WebGL2RenderingContext.UNSIGNED_BYTE, normalized: true, stride: 0, offset: 0 },
                { name: "normal", size: 3, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
                { name: "texCoord", size: 2, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
            ],
            uniformInfo: [
                { name: "isSprite", type: UniformType.INT },
                { name: "projectionMatrix", type: UniformType.MAT4, transpose: false },
                { name: "lightDirReversed", type: UniformType.VEC3 },
                { name: "color", type: UniformType.VEC4 },
                { name: "viewMatrix", type: UniformType.MAT4, transpose: false },
                { name: "modelMatrix", type: UniformType.MAT4, transpose: false },
                { name: "modelMatrixLight", type: UniformType.MAT4, transpose: false },
            ]
        });
        let angle = 0;
        Renderer.setInputHandlers([
            ["w", (delta) => drawable.rotation.x -= 2 * delta],
            ["a", (delta) => drawable.rotation.y -= 2 * delta],
            ["s", (delta) => drawable.rotation.x += 2 * delta],
            ["d", (delta) => drawable.rotation.y += 2 * delta],
            ["ArrowUp", (delta) => drawable.translation.y += 10 * delta],
            ["ArrowLeft", (delta) => drawable.translation.x -= 10 * delta],
            ["ArrowDown", (delta) => drawable.translation.y -= 10 * delta],
            ["ArrowRight", (delta) => drawable.translation.x += 10 * delta],
            [" ", () => {
                    angle += 1;
                    angle %= 360;
                    const color = hsvToRgb(degToRad(angle), 1, 1).map(el => el / 255);
                    drawable.supplyUniform("color", color);
                }],
        ]);
    });
}
//# sourceMappingURL=main.js.map