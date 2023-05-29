// uniform mat4 projectionMatrix; // provided by threejs
// uniform mat4 viewMatrix; // provided by threejs
// uniform mat4 modelMatrix; // provided by threejs

uniform vec2 uFrequency; 
uniform float uTime;


// attribute vec3 position;
attribute float aRandom;
// attribute vec2 uv;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

float loremIpsum(float c) {
  float a = 1.0;
  float b = 2.0;

  return a + b + c;
}

void donotReturnAnything() {

}

void main() {
  // supported types:
  // float:     float foo = 123.0;
  // integer:   int foo = 123;
  // to convert: float(foo)
  // boolean:   bool foo = true;
  // vector2    vec2 foo = vec2(1.0, 2.0); foo.x = 1.0; foo.y = 1.0  foo3.xy  foo3.yz
  // vector3    vec3 foo = vec3(1.0, 2.0, 3.0);  .x .y .z  or  .r .g .b  vec3 foo = vec3(foo2, 1.0);
  // vector4    vec4 foo = vec4(xyz, w) or (rgb, a)

  // sin cos max min pow exp mod clamp
  // cross dot mix step smoothstep length distance reflect refract normalize

  // https://www.shaderific.com/glsl-functions
  // https://thebookofshaders.com/

  // vRandom = aRandom;
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * .1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * .1;

  modelPosition.z += elevation;
  vElevation = elevation;

  // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * .1;
  // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * .1;

  // modelPosition.z += aRandom * .1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  // matrices to transform position to clip space
  // model: transformation relative to Mesh - pos, rot, scale
  // view: transformation relative to Camera - pos, rot, fov, near, far
  // projection: transform into clip space coords
  // https://learnopengl.com/Getting-started/Coordinate-Systems
}