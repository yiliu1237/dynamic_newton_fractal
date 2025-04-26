// shader.frag
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_power;
uniform float u_zoom;
uniform float u_time;
uniform vec2 u_offset;

const int maxIter = 30;
const float tol = 1e-4;


float cosh(float x) {
  return (exp(x) + exp(-x)) / 2.0;
}

float sinh(float x) {
  return (exp(x) - exp(-x)) / 2.0;
}


vec2 complexMult(vec2 a, vec2 b) {
  return vec2(
    a.x * b.x - a.y * b.y,
    a.x * b.y + a.y * b.x
  );
}

vec2 complexDiv(vec2 a, vec2 b) {
  float denom = b.x * b.x + b.y * b.y;
  return vec2(
    (a.x * b.x + a.y * b.y) / denom,
    (a.y * b.x - a.x * b.y) / denom
  );
}

float complexMag(vec2 z) {
  return length(z);
}

vec2 complexPow(vec2 z, float n) {
  float r = length(z);
  float theta = atan(z.y, z.x);
  float rn = pow(r, n);
  return vec2(
    rn * cos(n * theta),
    rn * sin(n * theta)
  );
}

vec2 complexSin(vec2 z) {
  return vec2(
    sin(z.x) * cosh(z.y),
    cos(z.x) * sinh(z.y)
  );
}

vec2 complexCos(vec2 z) {
  return vec2(
    cos(z.x) * cosh(z.y),
   -sin(z.x) * sinh(z.y)
  );
}


vec3 getSoftShadedColor(vec2 z, int iter, int maxIter) {
  // Root positions (hardcoded for power = 3)
  vec2 r1 = vec2(0.865, 0.0);
  vec2 r2 = vec2(-0.432, 0.749);
  vec2 r3 = vec2(-0.432, -0.749);

  float d1 = distance(z, r1);
  float d2 = distance(z, r2);
  float d3 = distance(z, r3);

  vec3 base;
  if (d1 < d2 && d1 < d3) {
    base = vec3(0.9, 0.85, 0.9); // pastel pink
  } else if (d2 < d3) {
    base = vec3(0.67, 0.67, 1.0); // lavender
  } else {
    base = vec3(0.9, 0.8, 0.9); // beige-gold
  }

  float shade = mix(1.0, 0.2, float(iter) / float(maxIter));

  // Make root centers black if very precise
  if (d1 < 0.01 || d2 < 0.01 || d3 < 0.01) {
    return vec3(0.0);
  }

  return base * shade;
}


void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_zoom + u_offset;
  vec2 z = uv;
  vec2 a = vec2(1.0, 0.0);

  for (int i = 0; i < maxIter; i++) {
    vec2 zPowMinus1 = complexPow(z, u_power - 1.0);
    vec2 zPow = complexMult(zPowMinus1, z);
    vec2 sinZ = complexSin(z);
    vec2 cosZ = complexCos(z);

    vec2 f = complexMult(zPow, sinZ) - a;
    vec2 df = complexMult(complexMult(zPowMinus1, vec2(u_power, 0.0)), sinZ)
              + complexMult(zPow, cosZ);

    if (complexMag(df) < 1e-8) break;

    vec2 dz = complexDiv(f, df);
    z -= dz;

    if (complexMag(dz) < tol) {
      vec3 color = getSoftShadedColor(z, i, maxIter);
      gl_FragColor = vec4(color, 1.0);
      return;
    }
  }

  gl_FragColor = vec4(0.0);
}
