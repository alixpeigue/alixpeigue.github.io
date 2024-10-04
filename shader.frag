#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_primary;
uniform vec3 u_secondary;
uniform vec2 u_mouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float dist = exp(-length(u_mouse-fragCoord)/200.);

    float fact = dist*dist;

    vec3 col = fact*u_primary+(1.-fact)*u_secondary;

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
