varying float vElevation;
varying float vFogDepth;
varying float vSmallElevation;

uniform vec3 uWaveDepthColor;
uniform vec3 uWaveSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

uniform vec3 uFoamColor;
uniform float uFoamMultiplier;

void main() {
    // Main Colors
    float mixedStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 originalColor = mix(uWaveDepthColor, uWaveSurfaceColor, mixedStrength);

    // Foam
    float foamStrength = vSmallElevation * uFoamMultiplier;
    vec3 colorWithFoam = mix(originalColor, uFoamColor, foamStrength);

    // Fog
    float fogAmount = smoothstep(-uFogNear, uFogFar, vFogDepth);
    vec3 colorWithFog = mix(colorWithFoam, uFogColor, fogAmount);


    gl_FragColor = vec4(colorWithFoam, 1.0);
    #include <colorspace_fragment>
}