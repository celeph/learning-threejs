varying vec3 vColor;

void main() {
  // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);

  // disc pattern (see last lecture)
  // float strength = distance(gl_PointCoord, vec2(.5));
  // strength = step(.5, strength);
  // strength = 1.0 - strength;

  // diffuse point
  // float strength = distance(gl_PointCoord, vec2(.5));
  // strength *= 2.0;
  // strength = 1.0 - strength;

  // light point pattern
  float strength = distance(gl_PointCoord, vec2(.5));
  strength = 1.0 - strength;
  strength = pow(strength, 10.);

  // final color
  vec3 color = mix(vec3(.0), vColor, strength);

  // gl_FragColor = vec4(vec3(strength), 1.0);
  gl_FragColor = vec4(color, 1.0);
}