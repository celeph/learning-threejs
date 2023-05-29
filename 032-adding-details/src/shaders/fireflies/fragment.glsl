void main() {
  //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  //gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);
  
  float distanceToCenter = distance(gl_PointCoord, vec2(.5));
  float strength = .05 / distanceToCenter - .05*2.;

  gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}