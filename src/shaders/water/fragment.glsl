varying float vElevation;
varying float vFogDepth;

uniform vec3 uWaveDepthColor;
uniform vec3 uWaveSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

void main() {
    float mixedStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 originalColor = mix(uWaveDepthColor, uWaveSurfaceColor, mixedStrength);

    float fogAmount = smoothstep(-uFogNear, uFogFar, vFogDepth);
    vec3 colorWithFog = mix(originalColor, uFogColor, fogAmount);

    gl_FragColor = vec4(colorWithFog, 1.0);
    #include <colorspace_fragment>
}