// precision mediump float;
// highp, mediump, lowp

uniform vec3 uColor;
uniform sampler2D uTexture; 

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2. + 1.;
  gl_FragColor = textureColor;

  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  // gl_FragColor = vec4(uColor, 1.0);
  // gl_FragColor = vec4(.5, vRandom, 1.0, 1.0);
}