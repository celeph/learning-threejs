#define PI 3.14159

// see https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    // Pattern 1: blue->magento->white->cyan->blue
    // gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // Pattern 2: black->red->yellow->green->black
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // Pattern 3: gradient black->white horizontal
    // float strength = vUv.x;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 4: gradient black->white vertical
    // float strength = vUv.y;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 5: gradient white->black vertical
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 6: gradient white->black vertical
    // float strength = vUv.y * 10.;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 7: gradient white->black vertical (repeating)
    // float strength = mod(vUv.y * 10., 1.0); // modulo value and limit
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 8: white black stripes vertical (repeating)
    // float strength = mod(vUv.y * 10., 1.0); // modulo value and limit
    // // if (strength < .5) strength = .0; else strength = 1.;
    // // strength = strength < .5 ? .0 : 1.;
    // strength = step(.5, strength);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 9: white black stripes vertical (repeating)
    // float strength = mod(vUv.y * 10., 1.0); // modulo value and limit
    // strength = step(.8, strength);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 10: white black stripes horizontal (repeating)
    // float strength = mod(vUv.x * 10., 1.0); // modulo value and limit
    // strength = step(.8, strength);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 11: white black stripes horizontal (repeating)
    // float strength = step(.8, mod(vUv.x * 10., 1.0));
    // strength += step(.8, mod(vUv.y * 10., 1.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 12: white dots
    // float strength = step(.8, mod(vUv.x * 10., 1.0));
    // strength *= step(.8, mod(vUv.y * 10., 1.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 13
    // float strength = step(.4, mod(vUv.x * 10., 1.0));
    // strength *= step(.8, mod(vUv.y * 10., 1.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 14
    // float barX = step(.4, mod(vUv.x * 10., 1.0));
    // barX *= step(.8, mod(vUv.y * 10., 1.0));
    // float barY = step(.4, mod(vUv.y * 10., 1.0));
    // barY *= step(.8, mod(vUv.x * 10., 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 15
    // float barX = step(.4, mod(vUv.x * 10., 1.0));
    // barX *= step(.8, mod(vUv.y * 10.+.2, 1.0));
    // float barY = step(.8, mod(vUv.x * 10.+.2, 1.0));
    // barY *= step(.4, mod(vUv.y * 10., 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 16
    // float strength = abs(vUv.x - .5);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 17
    // float strength = min(abs(vUv.x - .5), abs(vUv.y - .5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 18
    // float strength = max(abs(vUv.x - .5), abs(vUv.y - .5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 19
    // float strength = step(.2, max(abs(vUv.x - .5), abs(vUv.y - .5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 20
    // float strength = step(.2, max(abs(vUv.x - .5), abs(vUv.y - .5))) 
    //            * (1.0 - step(.25, max(abs(vUv.x - .5), abs(vUv.y - .5))));
    // //strength = step(.4, max(abs(vUv.x - .5), abs(vUv.y - .5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 21
    // float strength = floor(vUv.x*10.)/10.;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 22
    // float strength = floor(vUv.x*10.)/10. * floor(vUv.y*10.)/10.;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 23
    // float strength = random(vUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 24
    // vec2 gridUv = vec2(
    //   floor(vUv.x*10.)/10.,
    //   floor(vUv.y*10.)/10.
    // );
    // float strength = floor(random(gridUv) * 10.)/10.;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 25
    // vec2 gridUv = vec2(
    //   floor(vUv.x*10.)/10.,
    //   floor((vUv.y + vUv.x*.5) * 10.)/10.
    // );
    // float strength = floor(random(gridUv) * 10.)/10.;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 26
    // float strength = length(vUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 27
    // // float strength = length(vUv - .5);
    // float strength = distance(vUv, vec2(.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 28
    // float strength = 1.- distance(vUv, vec2(.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 29
    // float strength = .015 / distance(vUv, vec2(.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 30
    // vec2 lightUv = vec2(vUv.x * .1 + .45, vUv.y * .5 + .25);
    // vec2 lightUv = vec2(vUv.x, (vUv.y - .5)* 5. + .5);
    // float strength = .15 / distance(lightUv, vec2(.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 31
    // vec2 lightUvX = vec2(vUv.x * .1 + .45, vUv.y * .5 + .25);
    // float lightX = .015 / distance(lightUvX, vec2(.5));

    // vec2 lightUvY = vec2(vUv.y * .1 + .45, vUv.x * .5 + .25);
    // float lightY = .015 / distance(lightUvY, vec2(.5));

    // float strength = lightX * lightY;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 32
    // vec2 rotatedUv = rotate(vUv, PI*.25, vec2(0.5));

    // vec2 lightUvX = vec2(rotatedUv.x * .1 + .45, rotatedUv.y * .5 + .25);
    // float lightX = .015 / distance(lightUvX, vec2(.5));

    // vec2 lightUvY = vec2(rotatedUv.y * .1 + .45, rotatedUv.x * .5 + .25);
    // float lightY = .015 / distance(lightUvY, vec2(.5));

    // float strength = lightX * lightY;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 33
    // float strength = step(.25, distance(vUv, vec2(.5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 34
    // float strength = abs(distance(vUv, vec2(.5)) - .25);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 35
    // float strength = step(.01, abs(distance(vUv, vec2(.5)) - .25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 36
    // float strength = 1.0 - step(.01, abs(distance(vUv, vec2(.5)) - .25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 37
    // vec2 waveUv = vec2(
    //   vUv.x,
    //   vUv.y + sin(vUv.x * 30.) * .1
    // );
    // float strength = 1.0 - step(.01, abs(distance(waveUv, vec2(.5)) - .25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 38
    // vec2 waveUv = vec2(
    //   vUv.x + sin(vUv.y * 30.) * .1,
    //   vUv.y + sin(vUv.x * 30.) * .1
    // );
    // float strength = 1.0 - step(.01, abs(distance(waveUv, vec2(.5)) - .25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 39
    // vec2 waveUv = vec2(
    //   vUv.x + sin(vUv.y * 100.) * .1,
    //   vUv.y + sin(vUv.x * 100.) * .1
    // );
    // float strength = 1.0 - step(.01, abs(distance(waveUv, vec2(.5)) - .25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 40
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 41
    // float angle = atan(vUv.x-.5, vUv.y-.5);
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 42
    // float angle = atan(vUv.x-.5, vUv.y-.5);
    // float strength = angle / (2.*PI) + .5;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 43
    // float angle = atan(vUv.x-.5, vUv.y-.5);
    // angle /= (2.*PI);
    // angle += .5;
    // angle *= 20.;
    // angle = mod(angle, 1.);
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 44
    // float angle = atan(vUv.x-.5, vUv.y-.5);
    // angle /= (2.*PI);
    // angle += .5;
    // float strength = sin(angle * 100.);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern 45
    // float angle = atan(vUv.x-.5, vUv.y-.5);
    // angle /= (2.*PI);
    // angle += .5;
    // float sinusoid = sin(angle * 100.);

    // //float radius = .25 * sin(vUv.x * 50.);
    // float radius = .25 + sinusoid * .02;
    // float strength = 1. - step(.01, abs(distance(vUv, vec2(.5)) - radius));
    // gl_FragColor = vec4(vec3(strength), 1.0);    

    // Pattern 46: perlin noise
    // float strength = cnoise(vUv * 10.);
    // gl_FragColor = vec4(vec3(strength), 1.0);    

    // Pattern 47: perlin noise
    // float strength = step(.0, cnoise(vUv * 10.));
    // gl_FragColor = vec4(vec3(strength), 1.0);    

    // Pattern 48
    // float strength = 1.-abs(cnoise(vUv * 10.));
    // gl_FragColor = vec4(vec3(strength), 1.0);      

    // Pattern 49
    // float strength = sin(cnoise(vUv * 10.) * 20.);
    // gl_FragColor = vec4(vec3(strength), 1.0);      

    // Pattern 50
    // float strength = step(.9, sin(cnoise(vUv * 10.) * 20.));
    // gl_FragColor = vec4(vec3(strength), 1.0);      

    // Color Version
    float strength = step(.9, sin(cnoise(vUv * 10.) * 20.));

    // clamp the strength
    strength = clamp(strength, .0, 1.);
    vec3 blackColor = vec3(.0);
    vec3 uvColor = vec3(vUv, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);      
}