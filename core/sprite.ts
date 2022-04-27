import Drawable from "./drawable.js";
import Renderer from "./renderer.js";
import { loadImage } from "./utils.js";

class Sprite extends Drawable {
    image: HTMLImageElement;
    texture: WebGLTexture = Renderer.gl.createTexture();

    constructor(uri: string) {
        super({ // drawData
            positionData: new Float32Array([
                -1, 1, 0,
                -1, -1, 0,
                1, -1, 0,
                1, -1, 0,
                1, 1, 0,
                -1, 1, 0,
            ]),
            texCoord: new Float32Array([
                0, 0,
                0, 1,
                1, 1,
                1, 1,
                1, 0,
                0, 0
            ])
        });

        this.supplyUniform("isSprite", true);
        loadImage(uri).then(img => this.image = img);

        Renderer.gl.activeTexture(Renderer.gl.TEXTURE0 + 0);
        Renderer.gl.bindTexture(Renderer.gl.TEXTURE_2D, this.texture);

        Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_WRAP_S, Renderer.gl.CLAMP_TO_EDGE);
        Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_WRAP_T, Renderer.gl.CLAMP_TO_EDGE);
        Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MIN_FILTER, Renderer.gl.NEAREST);
        Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MAG_FILTER, Renderer.gl.NEAREST);
    }

    protected override renderCustom() {
        if(!this.image) {
            return;
        }

        Renderer.gl.disable(Renderer.gl.DEPTH_TEST);
        Renderer.gl.bindVertexArray(this.vao);

        // ****** Prolly some optimisation can be done with these ******

        // const imageLocation = Renderer.uniformLoc("image");
        // gl.uniform1i(imageLocation, 0);

        // gl.activeTexture(gl.TEXTURE0 + 0);
        // gl.bindTexture(gl.TEXTURE_2D, this.texture);

        Renderer.gl.texImage2D(Renderer.gl.TEXTURE_2D, 0, Renderer.gl.RGBA, Renderer.gl.RGBA, Renderer.gl.UNSIGNED_BYTE, this.image);
        Renderer.gl.drawArrays(Renderer.gl.TRIANGLES, 0, 6);
    }
}

export default Sprite;