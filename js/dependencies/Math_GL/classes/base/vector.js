import MathArray from './math-array.js';
import { checkNumber } from '../../lib/validators.js';
import assert from '../../lib/assert.js';
export default class Vector extends MathArray {
    get ELEMENTS() {
        assert(false);
        return 0;
    }
    // VIRTUAL METHODS
    copy(vector) {
        assert(false);
        return this;
    }
    // ACCESSORS
    get x() {
        return this[0];
    }
    set x(value) {
        this[0] = checkNumber(value);
    }
    get y() {
        return this[1];
    }
    set y(value) {
        this[1] = checkNumber(value);
    }
    // NOTE: `length` is a reserved word for Arrays, so we can't use `v.length()`
    // Offer `len` and `magnitude`
    len() {
        return Math.sqrt(this.lengthSquared());
    }
    magnitude() {
        return this.len();
    }
    lengthSquared() {
        let length = 0;
        for (let i = 0; i < this.ELEMENTS; ++i) {
            length += this[i] * this[i];
        }
        return length;
    }
    magnitudeSquared() {
        return this.lengthSquared();
    }
    distance(mathArray) {
        return Math.sqrt(this.distanceSquared(mathArray));
    }
    distanceSquared(mathArray) {
        let length = 0;
        for (let i = 0; i < this.ELEMENTS; ++i) {
            const dist = this[i] - mathArray[i];
            length += dist * dist;
        }
        return checkNumber(length);
    }
    dot(mathArray) {
        let product = 0;
        for (let i = 0; i < this.ELEMENTS; ++i) {
            product += this[i] * mathArray[i];
        }
        return checkNumber(product);
    }
    // MODIFIERS
    normalize() {
        const length = this.magnitude();
        if (length !== 0) {
            for (let i = 0; i < this.ELEMENTS; ++i) {
                this[i] /= length;
            }
        }
        return this.check();
    }
    // negate() {
    //   for (let i = 0; i < this.ELEMENTS; ++i) {
    //     this[i] = -this[i];
    //   }
    //   return this.check();
    // }
    // inverse() {
    //   for (let i = 0; i < this.ELEMENTS; ++i) {
    //     this[i] = 1 / this[i];
    //   }
    //   return this.check();
    // }
    multiply(...vectors) {
        for (const vector of vectors) {
            for (let i = 0; i < this.ELEMENTS; ++i) {
                this[i] *= vector[i];
            }
        }
        return this.check();
    }
    divide(...vectors) {
        for (const vector of vectors) {
            for (let i = 0; i < this.ELEMENTS; ++i) {
                this[i] /= vector[i];
            }
        }
        return this.check();
    }
    // THREE.js compatibility
    lengthSq() {
        return this.lengthSquared();
    }
    distanceTo(vector) {
        return this.distance(vector);
    }
    distanceToSquared(vector) {
        return this.distanceSquared(vector);
    }
    getComponent(i) {
        assert(i >= 0 && i < this.ELEMENTS, 'index is out of range');
        return checkNumber(this[i]);
    }
    setComponent(i, value) {
        assert(i >= 0 && i < this.ELEMENTS, 'index is out of range');
        this[i] = value;
        return this.check();
    }
    addVectors(a, b) {
        return this.copy(a).add(b);
    }
    subVectors(a, b) {
        return this.copy(a).subtract(b);
    }
    multiplyVectors(a, b) {
        return this.copy(a).multiply(b);
    }
    addScaledVector(a, b) {
        // @ts-ignore error TS2351: Cannot use 'new' with an expression whose type lacks a call or construct signature.
        return this.add(new this.constructor(a).multiplyScalar(b));
    }
}
//# sourceMappingURL=vector.js.map