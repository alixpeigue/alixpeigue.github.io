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


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord/u_resolution;
    vec2 offset = vec2(perlin_noise(vec2(0.1*u_time), 1.), perlin_noise(vec2(0.1*u_time), 1.5));
    vec2 center = u_resolution*offset;
    float dist = length(center-fragCoord);
    dist += 800.*perlin_noise(uv*(3.+2.*perlin_noise(vec2(sin(0.0987*u_time)), 1.12)), 1.);
    float fact = smoothstep(0.05, 0.95, sin(dist/(3.*sin(0.254*u_time)+18.5)));

    vec3 col;
    if (fact == 1.) {
        col = u_secondary;
    }else if (fact == 0. || max(gold_noise(floor(fragCoord+vec2(5., 5.)), u_time), 0.) >= fact) {
        col = u_primary;
    } else {
        col = u_secondary;
    }

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
