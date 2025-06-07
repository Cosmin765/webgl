import * as mgl from "./../dependencies/Math_GL/index.js";


export default class Camera {
    translation = new mgl.Vector3();
    target: mgl.Vector3 = null;
    up = [ 0, 1, 0 ];
    rotation = new mgl.Vector3(0, 0, 0);

    get viewMatrix() {
        if (this.target !== null) {
            return new mgl.Matrix4()
                .lookAt(this.translation, this.target, this.up);
        } else {
            const transform = new mgl.Matrix4()
                .identity()
                .translate(this.translation)
                .rotateXYZ(this.rotation);
            transform.invert();
            return transform;
        }
    }
}
