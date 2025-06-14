import Renderer from "../core/renderer.js";
import { UniformType } from "../core/types.js";
import Drawable from "../core/drawable.js";
import { loadObj } from "../core/utils.js";
import * as mgl from "../dependencies/Math_GL/index.js";
import Axes from "../core/UI/axes.js";
import * as cts from "../core/constants.js";
import Input from "../core/input.js";

window.onload = main;

async function main() {
    await setup();

    const ground = new Drawable(await loadObj('../assets/obj/cube.obj'));
    ground.supplyUniform("useUniformColor", 1);
    ground.supplyUniform("color", cts.WHITE);
    const groundWidth = 5;
    const groundHeight = 1;
    ground.scale([groundWidth, groundHeight, groundWidth]);
    ground.translate([0, -1, 0]);
    Renderer.scene.addChild(ground);

    const arrow = await Axes.load();
    Renderer.scene.addChild(arrow);
    // Renderer.UI.addChild(arrow);

    Renderer.camera.translation = new mgl.Vector3(0, 5, 20);
    Renderer.camera.rotation[0] = -0.1;
    // Renderer.camera.target = new mgl.Vector3(0, 0, 0);

    Renderer.loop((delta: number) => {
        Renderer.scene.rotate([ 0, 1.5 * delta, 0 ]);
    });
}

async function setup() {
    await Renderer.init();
    await Input.init();

    Renderer.initDataInfo({
        attribInfo: [
            { name: "position", size: 3, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
            { name: "color", size: 4, type: WebGL2RenderingContext.UNSIGNED_BYTE, normalized: true, stride: 0, offset: 0 },
            { name: "normal", size: 3, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
            { name: "texCoord", size: 2, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
        ],
        uniformInfo: [
            { name: "isSprite", type: UniformType.INT },
            { name: "useUniformColor", type: UniformType.INT },
            { name: "projectionMatrix", type: UniformType.MAT4, transpose: false },
            { name: "lightDirReversed", type: UniformType.VEC3 },
            { name: "color", type: UniformType.VEC4 },
            { name: "viewMatrix", type: UniformType.MAT4, transpose: false },
            { name: "modelMatrix", type: UniformType.MAT4, transpose: false },
            { name: "modelMatrixLight", type: UniformType.MAT4, transpose: false },
        ]
    });

    Input.setHandlers([
        [ "w", (delta: number) => Renderer.camera.translate(Renderer.camera.forward.scale(10 * delta)) ],
        [ "a", (delta: number) => Renderer.camera.translate(Renderer.camera.left.scale(10 * delta)) ],
        [ "s", (delta: number) => Renderer.camera.translate(Renderer.camera.backward.scale(10 * delta)) ],
        [ "d", (delta: number) => Renderer.camera.translate(Renderer.camera.right.scale(10 * delta)) ],
        [ "o", (delta: number) => Renderer.camera.translation[1] += 10 * delta ],
        [ "p", (delta: number) => Renderer.camera.translation[1] -= 10 * delta ],

        [ "ArrowUp", (delta: number) => {} ],
        [ "ArrowLeft", (delta: number) => {} ],
        [ "ArrowDown", (delta: number) => {} ],
        [ "ArrowRight", (delta: number) => {} ],
    ]);

    Input.addMouseMovementHandler(e => {
        const factor = 500;
        Renderer.camera.rotate(-e.movementY / factor, -e.movementX / factor);
    });
}

export default main;
