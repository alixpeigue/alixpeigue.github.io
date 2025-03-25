#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_primary;
uniform vec3 u_secondary;
uniform vec2 u_mouse;

float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   

float gold_noise(in vec2 xy, in float seed){
       return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float perlin_noise (in vec2 st, in float seed) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = gold_noise(i, seed);
    float b = gold_noise(i + vec2(1.0, 0.0), seed);
    float c = gold_noise(i + vec2(0.0, 1.0), seed);
    float d = gold_noise(i + vec2(1.0, 1.0), seed);

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


// Ray marching
float map(vec3 pos) {
    // Scaling and translation for the noise
    pos = (pos*u_time+1.)/u_time;
    float mountainHeight = 2.0;
    float noiseScale = 1.; // Adjust for mountain detail
    float offset = -1.0;   // Adjust to keep the terrain at y=0 initially

    float noiseValue = perlin_noise(vec2(pos.x, pos.z) * noiseScale, 1.0);
    noiseValue += 0.2*perlin_noise(vec2(pos.x, pos.z) * noiseScale*5., 1.0);
    noiseValue += 0.03*perlin_noise(vec2(pos.x, pos.z) * noiseScale*50., 1.0);
    float height = noiseValue * mountainHeight + offset;
    return pos.y - height;  //Signed distance function.  Negative means inside the terrain.
}


vec3 normal(vec3 pos) {
  vec2 e = vec2(0.01, 0.0);
  return normalize(vec3(
    map(pos + e.xyy) - map(pos - e.xyy),
    map(pos + e.yxy) - map(pos - e.yxy),
    map(pos + e.yyx) - map(pos - e.yyx)
  ));
}


vec3 ray_march(vec3 ro, vec3 rd) {
    float t = 0.0;
    for (int i = 0; i < 128; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        if (d < 0.001) {
            vec3 n = normal(p);
            // Simple lighting (diffuse)
            vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
            float diff = max(dot(n, lightDir), 0.0);
            return mix(u_primary, u_secondary, diff); // Terrain color
            // return mix(u_primary, u_secondary, float(gold_noise(p.xz, p.z) >= diff));
        }
        t += d;
        if (t > 10.0) { // Max distance
            break;
        }
    }
    return u_primary; // Background color
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    if (uv.y > 0.) {
        uv.x = -uv.x;
    }
    uv.y = -abs(uv.y);
    

    // Camera setup
    vec3 ro = vec3(u_time, 2.0, 5.0);  // Camera position
    vec3 rd = normalize(vec3(uv, 1.0)); // Ray direction

    vec3 col = ray_march(ro, rd);

    fragColor = vec4(col,1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
