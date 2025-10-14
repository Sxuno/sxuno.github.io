/*
 * This file is part of Blender WebGPU Export.
 * Licensed under the GNU General Public License v3.0 or later.
 * See LICENSE.txt for details.
 */

engine.utils = engine.utils || {}
engine.utils.math = engine.utils.math || {}

engine.utils.math.mat4Identity = function () {
	return new Float32Array([
		1, 0, 0, 0, 
		0, 1, 0, 0, 
		0, 0, 1, 0, 
		0, 0, 0, 1
	])
}

engine.utils.math.mat4FromTranslation = function (t) {
	const m = engine.utils.math.mat4Identity()
	m[12] = t[0]
	m[13] = t[1]
	m[14] = t[2]
	return m
}

engine.utils.math.mat4FromScale = function (s) {
	const m = engine.utils.math.mat4Identity()
	m[0] = s[0]
	m[5] = s[1]
	m[10] = s[2]
	return m
}

engine.utils.math.mat4FromRotationXYZ = function (r) {
	const cx = Math.cos(r[0]), sx = Math.sin(r[0])
	const cy = Math.cos(r[1]), sy = Math.sin(r[1])
	const cz = Math.cos(r[2]), sz = Math.sin(r[2])

	const Rx = new Float32Array([
		1, 0, 0, 0,
		0, cx, sx, 0,
		0, -sx, cx, 0,
		0, 0, 0, 1
	])

	const Ry = new Float32Array([
		cy, 0, -sy, 0,
		0, 1, 0, 0,
		sy, 0, cy, 0,
		0, 0, 0, 1
	])

	const Rz = new Float32Array([
		cz, sz, 0, 0,
		-sz, cz, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	])

	return engine.utils.math.multiply(engine.utils.math.multiply(Rz, Ry), Rx)
}

engine.utils.math.multiply = function (a, b) {
  const out = new Float32Array(16)
  for (let i = 0; i < 4; i++) {       // row
    for (let j = 0; j < 4; j++) {     // column
      out[i + j * 4] =
        a[i + 0 * 4] * b[0 + j * 4] +
        a[i + 1 * 4] * b[1 + j * 4] +
        a[i + 2 * 4] * b[2 + j * 4] +
        a[i + 3 * 4] * b[3 + j * 4]
    }
  }
  return out
}

engine.utils.math.composeTRS = function (position, rotation, scale) {
	const t = engine.utils.math.mat4FromTranslation(position)
	const r = engine.utils.math.mat4FromRotationXYZ(rotation)
	const s = engine.utils.math.mat4FromScale(scale)
	return engine.utils.math.multiply(engine.utils.math.multiply(t, r), s)
}

engine.utils.math.perspective = function (fovY, aspect, near, far) {
	const f = 1.0 / Math.tan(fovY / 2)
	const nf = 1 / (near - far)
	return new Float32Array([
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (far + near) * nf, -1,
		0, 0, (2 * far * near) * nf, 0,
	])
}

engine.utils.math.mat4InverseUniform = function (m) {
	// Only works with scale 1 or uniform
	const r00 = m[0], r01 = m[1], r02 = m[2]
	const r10 = m[4], r11 = m[5], r12 = m[6]
	const r20 = m[8], r21 = m[9], r22 = m[10]

	const tx = m[12], ty = m[13], tz = m[14]

	const t0 = -(r00 * tx + r10 * ty + r20 * tz)
	const t1 = -(r01 * tx + r11 * ty + r21 * tz)
	const t2 = -(r02 * tx + r12 * ty + r22 * tz)

	return [
		r00, r01, r02, 0,
		r10, r11, r12, 0,
		r20, r21, r22, 0,
		t0,  t1,  t2,  1
	]
}