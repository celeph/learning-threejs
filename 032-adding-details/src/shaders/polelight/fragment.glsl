varying vec2 vUv;

void main() {
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  
  float strength = 1.0;

  float outerGlow = distance(vUv, vec2(0.2)) * 5.0 - 2.;
  strength += outerGlow;
  //strength = clamp(strength, 0.0, 1.0);

  vec3 colorStart = vec3(1.0, 0.5843, 0.5843);
  vec3 colorEnd = vec3(1.0, 1.0, 1.0);

  vec3 color = mix(colorStart, colorEnd, strength);

  gl_FragColor = vec4(color, 1.0);
}