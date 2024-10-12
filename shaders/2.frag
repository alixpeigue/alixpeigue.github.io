#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_primary;
uniform vec3 u_secondary;
uniform vec2 u_mouse;

vec2 pixelize(in vec2 pos, in vec2 size) {
    return floor(pos/size)*size;
}

vec2 pixelCoord (in vec2 pos, in vec2 size) {
    return floor(pos/size);
}

vec2 bestPixelSize() {
    float targetSize = 50.;
    return u_resolution/floor(u_resolution/targetSize);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // vec2 pixelSize = u_resolution/vec2(21., 11.);
    vec2 pixelSize = bestPixelSize();


    // if(mod(pixelCoord(fragCoord, pixelSize).x, 2.) == 0.) {
    //     float wave = sin(2.*PI*1./(pixelSize.x*4.)*pixelize(fragCoord, pixelSize).x + u_time);
    //     fragCoord.y += pixelSize.y*wave;
    // }

    float wave = sin(0.01*pixelize(fragCoord, pixelSize).x + u_time);
    fragCoord.y += pixelSize.y*wave;

    vec2 pix = pixelize(fragCoord, pixelSize);
    vec2 pixelPos = pixelCoord(fragCoord, pixelSize);

    vec3 col = u_secondary;

    if(mod(pixelPos.x, 2.) == mod(pixelPos.y, 2.)) {
        col = u_primary;
    }
        
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
