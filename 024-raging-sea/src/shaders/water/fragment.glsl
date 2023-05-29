uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;


void main() {
  // gl_FragColor = vec4(.5, .8, 1., 1.);
  // gl_FragColor = vec4(uDepthColor, 1.);

  float mixStrength = (vElevation * uColorOffset) * uColorMultiplier;
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  gl_FragColor = vec4(color, 1.);
}