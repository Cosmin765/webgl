// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {config} from './lib/common.js';

// math.gl classes
export {default as Vector2} from './classes/vector2.js';
export {default as Vector3} from './classes/vector3.js';
export {default as Vector4} from './classes/vector4.js';
export {default as Matrix3} from './classes/matrix3.js';
export {default as Matrix4} from './classes/matrix4.js';
export {default as Quaternion} from './classes/quaternion.js';

export {
  // math.gl global utility methods
  config,
  configure,
  formatValue,
  isArray,
  clone,
  equals,
  exactEquals,
  toRadians,
  toDegrees,
  // math.gl "GLSL"-style functions
  radians,
  degrees,
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  clamp,
  lerp,
  withEpsilon
} from './lib/common.js';

export {checkNumber} from './lib/validators.js';

export {default as _MathUtils} from './lib/math-utils.js';

export {default as SphericalCoordinates} from './classes/spherical-coordinates.js';
export {default as Pose} from './classes/pose.js';
export {default as Euler} from './classes/euler.js';

export {default as assert} from './lib/assert.js';

const globals = {
  // eslint-disable-next-line no-restricted-globals
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global
};

const global_ = globals.global || globals.self || globals.window;

// Make config avalable as global variable for access in debugger
// TODO - integrate with probe.gl (as soft dependency) to persist across reloades

// @ts-ignore error TS2339: Property 'mathgl' does not exist on type 'Window | Global
global_.mathgl = {
  config
};

// DEPRECATED
export {default as _SphericalCoordinates} from './classes/spherical-coordinates.js';
export {default as _Pose} from './classes/pose.js';
export {default as _Euler} from './classes/euler.js';
