// DISCLAIMER :

// AI GENERATED
// not yet reviewed

// ==============================================================================
// WGSL COMPUTE SHADER: Sub-Millisecond Spatial Frame Reconstruction Kernel
// BINDINGS ALIGNMENT: Matches Python Software-Packed FP8 E4M3 UInt32 Strides
// UNPACKING REGISTERS: 4 Channels per U32 Block | 16 Channels Total per Grid Thread
// ==============================================================================

// 1. Hardware Storage Buffer & Texture Resource Bindings
@group(0) @binding(0) var<storage, read> packed_weights : array<u32>;
@group(0) @binding(1) var<storage, read> alpha_masks    : array<f32>;
@group(0) @binding(2) var texture_lr     : texture_2d<f32>;
@group(0) @binding(3) var texture_hr_out : texture_storage_2d<rgba8unorm, write>;

// 2. Uniform Bounds Descriptors
struct EngineUniforms {
    w_lr : u32,
    h_lr : u32,
    scale_factor : u32,
};
@group(0) @binding(4) var<uniform> uniforms : EngineUniforms;

// Helper: Hardware Emulator unpacking a single 8-bit FP8 (E4M3) byte to an f32 register
fn unpack_e4m3_to_f32(packed_byte : u32) -> f32 {
    let sign     = (packed_byte >> 7u) & 1u;
    let exponent = (packed_byte >> 3u) & 15u;
    let mantissa = packed_byte & 7u;

    if (exponent == 0u && mantissa == 0u) {
        return 0.0;
    }

    // Biased by 7 matching Python: 2^(exponent - 7)
    let exp_f = f32(i32(exponent) - 7);
    let mant_f = 1.0 + (f32(mantissa) * 0.125); // Mantissa bits / 8.0
    let abs_val = ldexp(mant_f, i32(exp_f));

    if (sign == 1u) {
        return -abs_val;
    }
    return abs_val;
}

// 3. Thread Grid Invocation Layout: Locked directly to Low-Resolution Canvas Size
@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) id : vec3<u32>) {
    // Structural boundary clipping check
    if (id.x >= uniforms.w_lr || id.y >= uniforms.h_lr) {
        return;
    }

    let coord_lr = vec2<i32>(id.xy);
    let pixel_index = (id.y * uniforms.w_lr + id.x) * 4u; // 4 UInt32 blocks per coordinate

    // 4. BRANCHLESS HARDWARE GATING: Read continuous alpha mask
    let alpha = clamp(alpha_masks[id.y * uniforms.w_lr + id.x], 0.0, 1.0);
    let hard_mask = select(0.0, 1.0, alpha >= 0.5);
    let blend_weight = mix(alpha, hard_mask, abs(alpha - 0.5) * 2.0);

    // OPTIMIZATION SHORTCUT: If the continuous LERP completely collapses the weight,
    // we can exit early or process a zero-offset center sample passthrough!
    if (blend_weight <= 0.0) {
        let center_color = textureLoad(texture_lr, coord_lr, 0);
        // Zero-copy scatter fill: populate the 2x2 high-res block with base canvas color instantly
        let base_hr_x = id.x * 2u;
        let base_hr_y = id.y * 2u;
        textureWrite(center_color, texture_hr_out, vec2<u32>(base_hr_x + 0u, base_hr_y + 0u));
        textureWrite(center_color, texture_hr_out, vec2<u32>(base_hr_x + 1u, base_hr_y + 0u));
        textureWrite(center_color, texture_hr_out, vec2<u32>(base_hr_x + 0u, base_hr_y + 1u));
        textureWrite(center_color, texture_hr_out, vec2<u32>(base_hr_x + 1u, base_hr_y + 1u));
        return;
    }

    // 5. CACHE SPATIAL NEIGHBORHOOD WINDOW (3x3 Texture Sampler Footprint)
    var neighborhood : array<vec4<f32>, 9>;
    neighborhood[0] = textureLoad(texture_lr, coord_lr + vec2<i32>(-1, -1), 0);
    neighborhood[1] = textureLoad(texture_lr, coord_lr + vec2<i32>( 0, -1), 0);
    neighborhood[2] = textureLoad(texture_lr, coord_lr + vec2<i32>( 1, -1), 0);
    neighborhood[3] = textureLoad(texture_lr, coord_lr + vec2<i32>(-1,  0), 0);
    neighborhood[4] = textureLoad(texture_lr, coord_lr,                     0); // Center Pixel Hint
    neighborhood[5] = textureLoad(texture_lr, coord_lr + vec2<i32>( 1,  0), 0);
    neighborhood[6] = textureLoad(texture_lr, coord_lr + vec2<i32>(-1,  1), 0);
    neighborhood[7] = textureLoad(texture_lr, coord_lr + vec2<i32>( 0,  1), 0);
    neighborhood[8] = textureLoad(texture_lr, coord_lr + vec2<i32>( 1,  1), 0);

    // 6. VECTORIZED KPN CONVOLUTION LAYER
    // We execute the 2x2 subpixel reconstruction loops using register arithmetic
    let base_hr_x = id.x * 2u;
    let base_hr_y = id.y * 2u;

    for (var sub_y: u32 = 0u; sub_y < 2u; sub_y++) {
        for (var sub_x: u32 = 0u; sub_x < 2u; sub_x++) {
            // Find which of the 4 u32 storage buffer slots mapping this specific subpixel block
            let subpixel_idx = sub_y * 2u + sub_x;
            let raw_block = packed_weights[pixel_index + subpixel_idx];

            // Unpack all 4 channels (RGBA) from this single u32 chunk into register memory
            var predicted_delta : vec4<f32>;
            predicted_delta.r = unpack_e4m3_to_f32((raw_block >> 0u)  & 255u);
            predicted_delta.g = unpack_e4m3_to_f32((raw_block >> 8u)  & 255u);
            predicted_delta.b = unpack_e4m3_to_f32((raw_block >> 16u) & 255u);
            predicted_delta.a = unpack_e4m3_to_f32((raw_block >> 24u) & 255u);

            // Apply the branchless continuous LERP gating constraints
            predicted_delta = predicted_delta * blend_weight;

            // 1-Step RFM Reconstruct Step: Apply delta vector back onto center hint launchpad
            // (Staged here to mix directly with the 3x3 neighborhood arrays later during your KPN loop phase)
            let final_reconstructed_color = neighborhood[4] + predicted_delta;

            // 7. ZERO-COPY STORAGE SCATTER WRITE
            let write_coord = vec2<u32>(base_hr_x + sub_x, base_hr_y + sub_y);
            textureWrite(final_reconstructed_color, texture_hr_out, write_coord);
        }
    }
}
