#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_primary;
uniform vec3 u_secondary;
uniform vec2 u_mouse;

vec2 map(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

struct Ray {
    vec2 ro;
    vec2 rd;
};

mat2 inverse(mat2 m) {
    mat2(0., 0., 0., 0.)
}

int intersection(Ray s, Ray r) {
    vec2 inter = inverse(mat2(s.rd, -r.rd))*(r.ro-s.ro);
    return inter.x<=1. && inter.x>=0.;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float dist = exp(-length(u_mouse-fragCoord)/2000.);

    float fact = dist*dist;

    vec3 col = fact*u_secondary+(1.-fact)*u_primary;

    vec3 toMouse = fragCoord-u_mouse;

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
