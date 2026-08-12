# WebGPU Memory Size Reference

## Scalar Types

| Type   | Size (bytes) |
|--------|-------------|
| f32    | 4           |
| i32    | 4           |
| u32    | 4           |
| f16    | 2           |

---

## Vector Types (Buffer Layout)

> ⚠️ `vec3` is padded to 16 bytes due to alignment

| Type          | Logical Size | Actual Size (bytes) |
|---------------|-------------|---------------------|
| vec2<f32>     | 8           | 8                   |
| vec3<f32>     | 12          | 16 ⚠️               |
| vec4<f32>     | 16          | 16                  |
| vec3<i32>     | 12          | 16 ⚠️               |

---

## Resolution → Memory (vec3 per pixel)

| Resolution       | Elements     | Memory Usage |
|------------------|-------------|--------------|
| 1024 × 1024      | 1,048,576   | ~16 MB       |
| 1920 × 1080      | 2,073,600   | ~32 MB       |
| 3840 × 2160 (4K) | 8,294,400   | ~128 MB      |

> Based on: `1 element = 16 bytes`

---

## Strings (Simulated on GPU)

| Encoding | Bytes per char |
|----------|----------------|
| ASCII / UTF-8 | 1        |
| UTF-16        | 2        |

### Fixed-size strings

| Example                  | Memory |
|--------------------------|--------|
| 32 chars × 1M entries    | ~32 MB |

---

## Dynamic String Layout

| Component       | Size                     |
|----------------|--------------------------|
| String data     | N bytes                  |
| Offsets (u32)   | count × 4 bytes          |

---

## Texture vs Buffer (vec3)

| Storage Type | Size per pixel | Notes |
|--------------|---------------|------|
| Buffer vec3  | 16 bytes      | padded |
| Texture RGB32F | 12 bytes*   | may align to 16 internally |

> *Driver-dependent alignment

---

## Quick Estimation Formula

```js
size_bytes = width * height * 16