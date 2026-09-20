/*
 * This file is part of WebGPU-Engine.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org.
 */
engine.utils.math = (function() {

	// =======
	// PRIVATE
	// =======

	// type allocations // note: allocations outputs are pointer
	let _vec2 = new Float32Array(2)
	let _vec3 = new Float32Array(3)
	let _vec4 = new Float32Array(4)
	let _mat2 = new Float32Array(4)
	let _mat3 = new Float32Array(9)
	let _mat4 = new Float32Array(16)

	// ======
	// PUBLIC
	// ======

	// vector 2D
	const vec2 = {
		add : (a, b) => {
			_vec2[0] = a[0] + b[0]
			_vec2[1] = a[1] + b[1]
		},
		subtract : (a, b) => {
			_vec2[0] = a[0] - b[0]
			_vec2[1] = a[1] - b[1]			
		}
	}
	// vector 3D
	const vec3 = {
		add : (a, b) => {
			_vec3[0] = a[0] + b[0]
			_vec3[1] = a[1] + b[1]
			_vec3[2] = a[2] + b[2]
		},
		subtract : (a, b) => {
			_vec3[0] = a[0] - b[0]
			_vec3[1] = a[1] - b[1]
			_vec3[2] = a[2] - b[2]
		},
		normalize : (vector) => {},
		dot : (a, b) => {},
		cross : (a, b) => {},
		length : (vector) => {},
		distance : (a, b) => {},
		forward : (vector) => {},
		lerp : () => {},
		slerp : () => {},
		clamp : () => {},
		negate : () => {},
		abs : () => {},
		floor : () => {},
		ceil : () => {},
		round : () => {},
		sign : () => {},
	}
	// vector 4D
	const vec4 = {
		add : (a, b) => {
			_vec4[0] = a[0] + b[0]
			_vec4[1] = a[1] + b[1]
			_vec4[2] = a[2] + b[2]
			_vec4[3] = a[3] + b[3]
			return _vec4
		},
		subtract : (a, b) => {
			_vec4[0] = a[0] - b[0]
			_vec4[1] = a[1] - b[1]
			_vec4[2] = a[2] - b[2]
			_vec4[3] = a[3] - b[3]
			return _vec4
		}
	}
	// rotation
	const rot = {
		euler: {},
		quat: {}
	}
	// 2D linear transformation
	const mat2 = {
		identity : () => {
			// Column 0
			_mat2[0] = 1
			_mat2[1] = 0
			// Column 1
			_mat2[2] = 0
			_mat2[3] = 1
			return _mat2
		},
		multiply : (a, b) => {
			// Column-Major configuration
			let _mat2 = new Float32Array(4)
			// Column 0
			_mat2[0] = a[0] * b[0] + a[2] * b[1]
			_mat2[1] = a[1] * b[0] + a[3] * b[1]
			// Column 1
			_mat2[2] = a[0] * b[2] + a[2] * b[3]
			_mat2[3] = a[1] * b[2] + a[3] * b[3]
			return _mat2
		}
	}
	// 3D linear transformation
	const mat3 = {
		identity : () => {
			// Column 0
			_mat3[0] = 1
			_mat3[1] = 0
			_mat3[2] = 0
			// Column 1
			_mat3[3] = 0
			_mat3[4] = 1
			_mat3[5] = 0
			// Column 2
			_mat3[6] = 0
			_mat3[7] = 0
			_mat3[8] = 1
			return _mat3
		},
		multiply : (a, b) => {
			// Column-Major configuration
			// Column 0
			_mat3[0] = a[0] * b[0] + a[3] * b[1] + a[6] * b[2]
			_mat3[1] = a[1] * b[0] + a[4] * b[1] + a[7] * b[2]
			_mat3[2] = a[2] * b[0] + a[5] * b[1] + a[8] * b[2]
			// Column 1
			_mat3[3] = a[0] * b[3] + a[3] * b[4] + a[6] * b[5]
			_mat3[4] = a[1] * b[3] + a[4] * b[4] + a[7] * b[5]
			_mat3[5] = a[2] * b[3] + a[5] * b[4] + a[8] * b[5]
			// Column 2
			_mat3[6] = a[0] * b[6] + a[3] * b[7] + a[6] * b[8]
			_mat3[7] = a[1] * b[6] + a[4] * b[7] + a[7] * b[8]
			_mat3[8] = a[2] * b[6] + a[5] * b[7] + a[8] * b[8]
			return _mat3
		}
	}
	// projective transformation
	const mat4 = {
		identity : () => {
			// Column 0
			_mat4[0] = 1
			_mat4[1] = 0
			_mat4[2] = 0
			_mat4[3] = 0
			// Column 1
			_mat4[4] = 0
			_mat4[5] = 1
			_mat4[6] = 0
			_mat4[7] = 0
			// Column 2
			_mat4[8] = 0
			_mat4[9] = 0
			_mat4[10] = 1
			_mat4[11] = 0
			// Column 3
			_mat4[12] = 0
			_mat4[13] = 0
			_mat4[14] = 0
			_mat4[15] = 1
			return _mat4
		},
		fromTranslation : (translation) => {
			const m = engine.utils.math.mat4.identity()
			m[12] = translation[0]
			m[13] = translation[1]
			m[14] = translation[2]
			return m
		},
		fromScale : (scale) => {
			const m = engine.utils.math.mat4.identity()
			m[0] = scale[0]
			m[5] = scale[1]
			m[10] = scale[2]
			return m
		},
		fromRotationXYZ : (rotation) => {
			const cx = Math.cos(rotation[0]), sx = Math.sin(rotation[0])
			const cy = Math.cos(rotation[1]), sy = Math.sin(rotation[1])
			const cz = Math.cos(rotation[2]), sz = Math.sin(rotation[2])
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
			return engine.utils.math.mat4.multiply(engine.utils.math.mat4.multiply(Rz, Ry), Rx)
		},
		multiply : (a, b /* , out */) => { // todo rethink allocation logic ( typed arrays )
			// Column-Major configuration
			let _mat4 = new Float32Array(16) // saveguard pointer passing 
			// Column 0
			_mat4[0]  = a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3]
			_mat4[1]  = a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3]
			_mat4[2]  = a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3]
			_mat4[3]  = a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3]
			// Column 1
			_mat4[4]  = a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7]
			_mat4[5]  = a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7]
			_mat4[6]  = a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7]
			_mat4[7]  = a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7]
			// Column 2
			_mat4[8]  = a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11]
			_mat4[9]  = a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11]
			_mat4[10] = a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11]
			_mat4[11] = a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11]
			// Column 3
			_mat4[12] = a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15]
			_mat4[13] = a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15]
			_mat4[14] = a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15]
			_mat4[15] = a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
			return _mat4
		},
		composeTRS : (position, rotation, scale) => {
			const t = engine.utils.math.mat4.fromTranslation(position)
			const r = engine.utils.math.mat4.fromRotationXYZ(rotation)
			const s = engine.utils.math.mat4.fromScale(scale)
			return engine.utils.math.mat4.multiply(engine.utils.math.mat4.multiply(t, r), s)
		},
		inversePerspective : (fovY, aspect, near, far) => { // old depht 0, 1
			const f = 1.0 / Math.tan(fovY / 2)
			const nf = 1 / (near - far)
			return new Float32Array([
				f / aspect, 0, 0, 0,
				0, f, 0, 0,
				0, 0, (far + near) * nf, -1,
				0, 0, (2 * far * near) * nf, 0,
			])
		},
		inversePerspectiveRZ : (fovY, aspect, near, far) => { // reverse Z // note : consider herachical depth
			const f = 1.0 / Math.tan(fovY / 2)
			const nf = 1.0 / (far - near)
			return new Float32Array([
				f / aspect, 0, 0, 0,
				0, f, 0, 0,
				0, 0, near * nf, -1,
				0, 0, (far * near) * nf, 0,
			])
		},
		inverseUniform : (mat) => { // Only works with scale 1 or uniform
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
	}
	// nDimensional structure
	const tensor = {}
	// model level operations
	const transformer = {}

	// ======
	// EXPORT
	// ======

	// DECLARE VAR
	let math = {
		vec2,
		vec3,
		vec4,
		rot,
		mat2,
		mat3,
		mat4,
	}
	// CONDITIONAL
	// RETURN VAR
	return math
})()