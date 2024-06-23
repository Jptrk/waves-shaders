varying vec2 vUv;
varying float vElevation;

uniform vec3 uWaveDepthColor;
uniform vec3 uWaveSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;


void main() {
    float mixedStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uWaveDepthColor, uWaveSurfaceColor, mixedStrength);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}