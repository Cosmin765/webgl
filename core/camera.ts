import * as mgl from "./../dependencies/Math_GL/index.js";


export default class Camera {
    translation = new mgl.Vector3();
    target: mgl.Vector3 = null;
    up = [ 0, 1, 0 ];
    rotation = new mgl.Quaternion();

    translate(offset: Iterable<number>) {
        this.translation.add(offset);
        return this;
    }

    rotate(deltaPitch: number, deltaYaw: number) {
        const pitchQuat = new mgl.Quaternion().fromAxisRotation([1, 0, 0], deltaPitch);
        const yawQuat = new mgl.Quaternion().fromAxisRotation([0, 1, 0], deltaYaw);
        this.rotation = yawQuat.multiply(this.rotation, null).multiply(pitchQuat, null);
        return this;
    }

    get viewMatrix() {
        if (this.target !== null) {
            return new mgl.Matrix4()
                .lookAt(this.translation, this.target, this.up);
        } else {
            const rotationMatrix = new mgl.Matrix4()
                .fromQuaternion(this.rotation);

            const transform = new mgl.Matrix4()
                .translate(this.translation)
                .multiplyRight(rotationMatrix);

            const viewMatrix = transform.invert();
            return viewMatrix;
        }
    }

    get forward() {
        return new mgl.Vector3(0, 0, -1)
            .transformByQuaternion(this.rotation);
    }

    get backward() {
        return new mgl.Vector3(0, 0, 1)
            .transformByQuaternion(this.rotation);
    }

    get right() {
        return new mgl.Vector3(1, 0, 0)
            .transformByQuaternion(this.rotation);
    }

    get left() {
        return new mgl.Vector3(-1, 0, 0)
            .transformByQuaternion(this.rotation);
    }
}
