precision highp float;

#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

varying vec2 uv;
uniform vec2 iResolution;
uniform sampler2D u_sampler;
uniform float frequency;
uniform vec2 iImageAspect;

// Simplex noise function
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Antialiased step function
float aastep(float threshold, float value) {
  #ifdef GL_OES_standard_derivatives
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
  #else
    return step(threshold, value);
  #endif  
}

// Halftone function
vec3 halftone(vec3 texcolor, vec2 st, float freq) {
  float n = 0.1*snoise(st*200.0);
  n += 0.05*snoise(st*400.0);
  n += 0.025*snoise(st*800.0);
  vec3 white = vec3(n*0.2 + 0.97);
  vec3 black = vec3(n + 0.1);

  // Perform a rough RGB-to-CMYK conversion
  vec4 cmyk;
  cmyk.xyz = 1.0 - texcolor;
  cmyk.w = min(cmyk.x, min(cmyk.y, cmyk.z));
  cmyk.xyz -= cmyk.w;

  // Distance to nearest point in a grid
  vec2 Kst = freq*mat2(0.707, -0.707, 0.707, 0.707)*st;
  vec2 Kuv = 2.0*fract(Kst)-1.0;
  float k = aastep(0.0, sqrt(cmyk.w)-length(Kuv)+n);
  vec2 Cst = freq*mat2(0.966, -0.259, 0.259, 0.966)*st;
  vec2 Cuv = 2.0*fract(Cst)-1.0;
  float c = aastep(0.0, sqrt(cmyk.x)-length(Cuv)+n);
  vec2 Mst = freq*mat2(0.966, 0.259, -0.259, 0.966)*st;
  vec2 Muv = 2.0*fract(Mst)-1.0;
  float m = aastep(0.0, sqrt(cmyk.y)-length(Muv)+n);
  vec2 Yst = freq*st;
  vec2 Yuv = 2.0*fract(Yst)-1.0;
  float y = aastep(0.0, sqrt(cmyk.z)-length(Yuv)+n);

  vec3 rgbscreen = 1.0 - 0.9*vec3(c,m,y) + n;
  return mix(rgbscreen, black, 0.85*k + 0.3*n);
}

void main() {
  // Cover mode: scale UV to maintain aspect ratio and crop edges
  vec2 coverUv = uv;
  
  // CSS object-fit: cover formula
  // We need to map canvas UV [0,1] to image UV [0,1]
  // For cover, we scale so the SMALLER image dimension fills the LARGER canvas dimension
  
  float canvasAspect = iResolution.x / iResolution.y;
  float imageAspect = iImageAspect.x / iImageAspect.y;
  
  // Calculate which dimension fills
  // If canvas is wider than image, we need to scale UP (zoom in) so height fills
  // If canvas is taller than image, we need to scale UP (zoom in) so width fills
  float scale;
  if (canvasAspect > imageAspect) {
    // Canvas is wider - we need to zoom in to fill height
    scale = canvasAspect / imageAspect;  // > 1
  } else {
    // Canvas is taller - we need to zoom in to fill width
    scale = imageAspect / canvasAspect;  // > 1
  }
  
  // Apply: divide UVs to zoom in
  coverUv = (coverUv - 0.5) / scale + 0.5;
  
  vec4 texcolor = texture2D(u_sampler, coverUv);
  vec2 st = uv;
  st.x *= iResolution.x / iResolution.y;
  gl_FragColor.rgb = halftone(texcolor.rgb, st, frequency);
  gl_FragColor.a = 1.0;
}

