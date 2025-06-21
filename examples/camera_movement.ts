import Renderer from "../core/renderer.js";
import { UniformType } from "../core/types.js";
import Drawable from "../core/drawable.js";
import { debug, loadObj } from "../core/utils.js";
import * as mgl from "../dependencies/Math_GL/index.js";
import Axes from "../core/UI/axes.js";
import * as cts from "../core/constants.js";
import Input from "../core/input.js";

window.onload = main;

async function main() {
    await setup();

    Renderer.scene.supplyUniform("shininess", [20]);

    const ground = new Drawable(await loadObj('../assets/obj/cube.obj'));
    ground.supplyUniform("useUniformColor", 1);
    ground.supplyUniform("color", [0.7, 0.7, 0.7, 1]);
    const groundWidth = 20;
    const groundHeight = 1;
    ground.scale([groundWidth, groundHeight, groundWidth]);
    ground.translate([0, -1, 0]);
    Renderer.scene.addChild(ground);

    const arrow = await Axes.load();
    arrow.translate([0, 3, 0]);
    Renderer.scene.addChild(arrow);
    // Renderer.UI.addChild(arrow);

    Renderer.camera.translation = new mgl.Vector3(0, 5, 20);
    Renderer.camera.rotate(-0.1, 0);
    // Renderer.camera.target = new mgl.Vector3(0, 0, 0);

    Renderer.loop((delta: number) => {
        // Renderer.scene.rotate([ 0, 1.5 * delta, 0 ]);
        Renderer.scene.supplyUniform("lightWorldPosition", Renderer.camera.translation);
        Renderer.scene.supplyUniform("viewWorldPosition", Renderer.camera.translation);
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
            { name: "lightWorldPosition", type: UniformType.VEC3 },
            { name: "shininess", type: UniformType.FLOAT },
            { name: "viewWorldPosition", type: UniformType.VEC3 },
        ]
    });

    Input.setHandlers([
        [ "w", (delta: number) => Renderer.camera.translate(Renderer.camera.forward.scale(10 * delta)) ],
        [ "a", (delta: number) => Renderer.camera.translate(Renderer.camera.left.scale(10 * delta)) ],
        [ "s", (delta: number) => Renderer.camera.translate(Renderer.camera.backward.scale(10 * delta)) ],
        [ "d", (delta: number) => Renderer.camera.translate(Renderer.camera.right.scale(10 * delta)) ],
        
        [ "o", (delta: number) => Renderer.camera.translation[1] += 10 * delta ],
        [ "p", (delta: number) => Renderer.camera.translation[1] -= 10 * delta ],

        [ "ArrowUp", (delta: number) => {
            const forwardNoVertical = Renderer.camera.forward;
            forwardNoVertical[1] = 0;
            forwardNoVertical.normalize();
            Renderer.camera.translate(forwardNoVertical.multiplyByScalar(10 * delta));
        } ],
        [ "ArrowLeft", (delta: number) => {
            const leftNoVertical = Renderer.camera.left;
            leftNoVertical[1] = 0;
            leftNoVertical.normalize();
            Renderer.camera.translate(leftNoVertical.multiplyByScalar(10 * delta));
        } ],
        [ "ArrowDown", (delta: number) => {
            const backwardNoVertical = Renderer.camera.backward;
            backwardNoVertical[1] = 0;
            backwardNoVertical.normalize();
            Renderer.camera.translate(backwardNoVertical.multiplyByScalar(10 * delta));
        } ],
        [ "ArrowRight", (delta: number) => {
            const rightNoVertical = Renderer.camera.right;
            rightNoVertical[1] = 0;
            rightNoVertical.normalize();
            Renderer.camera.translate(rightNoVertical.multiplyByScalar(10 * delta));
        } ],
    ]);

    Input.addMouseMovementHandler(e => {
        const factor = 500;
        Renderer.camera.rotate(-e.movementY / factor, -e.movementX / factor);
    });
}

export default main;
