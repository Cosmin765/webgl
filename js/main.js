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
import { checkKey, loadObj, hsv2rgb, deg2rad } from "./core/utils.js";
window.onload = main;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Renderer.init();
        const dataInfo = {
            attribInfo: [
                { name: "position", size: 3, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
                { name: "color", size: 4, type: WebGL2RenderingContext.UNSIGNED_BYTE, normalized: true, stride: 0, offset: 0 },
                { name: "normal", size: 3, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
            ],
            uniformInfo: [
                { name: "projectionMatrix", type: UniformType.MAT4, transpose: false },
                { name: "lightDirReversed", type: UniformType.VEC3 },
                { name: "color", type: UniformType.VEC4 },
                { name: "viewMatrix", type: UniformType.MAT4, transpose: false },
                { name: "modelMatrix", type: UniformType.MAT4, transpose: false },
                { name: "modelMatrixLight", type: UniformType.MAT4, transpose: false },
            ]
        };
        Renderer.initDataInfo(dataInfo);
        const generateFractal = (drawable, level) => {
            if (level === 0) {
                return;
            }
            const children = Array(6).fill(0).map(_ => new Drawable(drawable.drawData).scale(0.5));
            const spacing = 1000;
            children[0].translate([0, spacing, 0]);
            children[1].translate([spacing, 0, 0]);
            children[4].translate([0, 0, spacing]);
            children[2].translate([0, -spacing, 0]);
            children[3].translate([-spacing, 0, 0]);
            children[5].translate([0, 0, -spacing]);
            drawable.addChildren(children);
            for (const child of children) {
                generateFractal(child, level - 1);
            }
        };
        const rotateRecursive = (drawable, amount) => {
            drawable.rotation.y += amount;
            for (const child of drawable.children.values()) {
                rotateRecursive(child, amount);
            }
        };
        const drawData = yield loadObj("./assets/obj/cup.obj");
        const drawable = new Drawable(drawData);
        Renderer.scene.addChild(drawable);
        let angle = 0;
        const update = (delta) => {
            const color = hsv2rgb(deg2rad(angle), 1, 1).map(val => val / 255);
            drawable.supplyUniform("color", color);
            checkKey("w", () => drawable.rotation.x -= 2 * delta);
            checkKey("a", () => drawable.rotation.y -= 2 * delta);
            checkKey("s", () => drawable.rotation.x += 2 * delta);
            checkKey("d", () => drawable.rotation.y += 2 * delta);
            checkKey("ArrowUp", () => drawable.translation.y += 10 * delta);
            checkKey("ArrowLeft", () => drawable.translation.x -= 10 * delta);
            checkKey("ArrowDown", () => drawable.translation.y -= 10 * delta);
            checkKey("ArrowRight", () => drawable.translation.x += 10 * delta);
            checkKey(" ", () => {
                angle += 1;
                angle %= 360;
            });
            angle += 0.2;
            angle %= 360;
        };
        Renderer.loop(update);
    });
}
//# sourceMappingURL=main.js.map