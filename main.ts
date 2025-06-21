import Renderer from "./core/renderer.js";
import { UniformType } from "./core/types.js";
import Drawable from "./core/drawable.js";
import { loadObj, hsvToRgb, degToRad } from "./core/utils.js";
import Button from "./core/UI/button.js";
import Input from "./core/input.js";

window.onload = main;

let drawable: Drawable = new Drawable();

async function main() {
    await setup();

    const chair = new Drawable(await loadObj("./assets/obj/chair.obj"));
    chair.supplyUniform("color", [ 1, 0, 1, 1 ]);
    Renderer.scene.addChild(chair);
    chair.translate([ 0, 0.5, 0 ]);
    
    const cup = new Drawable(await loadObj("./assets/obj/cup.obj"));
    cup.supplyUniform("color", [ 1, 1, 0, 1 ]);
    Renderer.scene.addChild(cup);

    const button = new Button("./assets/button.png", () => console.log(this));
    Renderer.UI.addChild(button);
    button.translate([ 2, -5, 0 ]);

    Renderer.scene.rotate([ 1, 0, 0 ]);

    Renderer.loop((delta: number) => {
        Renderer.scene.rotate([ 0, 0.01, 0 ]);
    });
}

async function setup() {
    await Renderer.init();

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
    Input.setHandlers([
        [ "w", (delta: number) => drawable.rotation.x -= 2 * delta ],
        [ "a", (delta: number) => drawable.rotation.y -= 2 * delta ],
        [ "s", (delta: number) => drawable.rotation.x += 2 * delta ],
        [ "d", (delta: number) => drawable.rotation.y += 2 * delta ],

        [ "ArrowUp", (delta: number) => drawable.translation.y += 10 * delta ],
        [ "ArrowLeft", (delta: number) => drawable.translation.x -= 10 * delta ],
        [ "ArrowDown", (delta: number) => drawable.translation.y -= 10 * delta ],
        [ "ArrowRight", (delta: number) => drawable.translation.x += 10 * delta ],

        [ " ", () => {
            angle += 1;
            angle %= 360;

            const color = hsvToRgb(degToRad(angle), 1, 1).map(el => el / 255);
            drawable.supplyUniform("color", color);
        } ],
    ]);
}