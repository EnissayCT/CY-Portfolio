import { useEffect, useRef } from 'react'
import { getCurrentPalette } from '../../utils/timeOfDay'
import { perfTier } from '../../utils/perfBudget'

// ── Performance-tuned settings ──────────────────────────────────────────────
const CFG = {
  shader: { numSteps: 8, iterGeometry: 3, iterFragment: 4 },
  sea: {
    height: 0.6,
    choppy: 4.0,
    speed: 0.8,
    freq: 0.16,
  },
  time: { speed: 0.3, mouseInfluence: 0.002 },
  renderScale: 0.65,
}

const FRAG_SRC = `#version 300 es
precision mediump float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform vec3 uSeaBase;
uniform vec3 uSeaWater;
out vec4 fragColor;

const int NUM_STEPS = ${CFG.shader.numSteps};
const float PI      = 3.141592;
const float EPSILON = 1e-3;
#define EPSILON_NRM (0.1 / iResolution.x)

const int ITER_GEOMETRY = ${CFG.shader.iterGeometry};
const int ITER_FRAGMENT = ${CFG.shader.iterFragment};
const float SEA_HEIGHT = ${CFG.sea.height.toFixed(4)};
const float SEA_CHOPPY = ${CFG.sea.choppy.toFixed(4)};
const float SEA_SPEED  = ${CFG.sea.speed.toFixed(4)};
const float SEA_FREQ   = ${CFG.sea.freq.toFixed(4)};
#define SEA_TIME (1.0 + iTime * SEA_SPEED)
const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

mat3 fromEuler(vec3 ang) {
  vec2 a1=vec2(sin(ang.x),cos(ang.x));
  vec2 a2=vec2(sin(ang.y),cos(ang.y));
  vec2 a3=vec2(sin(ang.z),cos(ang.z));
  return mat3(
    a1.y*a3.y+a1.x*a2.x*a3.x, a1.y*a2.x*a3.x+a3.y*a1.x, -a2.y*a3.x,
    -a2.y*a1.x, a1.y*a2.y, a2.x,
    a3.y*a1.x*a2.x+a1.y*a3.x, a1.x*a3.x-a1.y*a3.y*a2.x, a2.y*a3.y
  );
}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  return -1.0+2.0*mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                      mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float diffuse(vec3 n,vec3 l,float p){return pow(dot(n,l)*0.4+0.6,p);}
float specular(vec3 n,vec3 l,vec3 e,float s){
  return pow(max(dot(reflect(e,n),l),0.0),s)*((s+8.0)/(PI*8.0));
}
vec3 getSkyColor(vec3 e){
  e.y=(max(e.y,0.0)*0.8+0.2)*0.8;
  return vec3(pow(1.0-e.y,2.0),1.0-e.y,0.6+(1.0-e.y)*0.4)*1.1;
}
float sea_octave(vec2 uv,float choppy){
  uv+=noise(uv);
  vec2 wv=1.0-abs(sin(uv)),swv=abs(cos(uv));
  wv=mix(wv,swv,wv);
  return pow(1.0-pow(wv.x*wv.y,0.65),choppy);
}
float map(vec3 p){
  float freq=SEA_FREQ,amp=SEA_HEIGHT,choppy=SEA_CHOPPY;
  vec2 uv=p.xz; uv.x*=0.75; float d,h=0.0;
  for(int i=0;i<ITER_GEOMETRY;i++){
    d=sea_octave((uv+SEA_TIME)*freq,choppy)+sea_octave((uv-SEA_TIME)*freq,choppy);
    h+=d*amp; uv*=octave_m; freq*=1.9; amp*=0.22; choppy=mix(choppy,1.0,0.2);
  }
  return p.y-h;
}
float map_detailed(vec3 p){
  float freq=SEA_FREQ,amp=SEA_HEIGHT,choppy=SEA_CHOPPY;
  vec2 uv=p.xz; uv.x*=0.75; float d,h=0.0;
  for(int i=0;i<ITER_FRAGMENT;i++){
    d=sea_octave((uv+SEA_TIME)*freq,choppy)+sea_octave((uv-SEA_TIME)*freq,choppy);
    h+=d*amp; uv*=octave_m; freq*=1.9; amp*=0.22; choppy=mix(choppy,1.0,0.2);
  }
  return p.y-h;
}
vec3 getSeaColor(vec3 p,vec3 n,vec3 l,vec3 eye,vec3 dist){
  float fresnel=min(pow(clamp(1.0-dot(n,-eye),0.0,1.0),3.0),0.5);
  vec3 color=mix(uSeaBase+diffuse(n,l,80.0)*uSeaWater*0.12,
                 getSkyColor(reflect(eye,n)),fresnel);
  float atten=max(1.0-dot(dist,dist)*0.001,0.0);
  color+=uSeaWater*(p.y-SEA_HEIGHT)*0.18*atten;
  color+=specular(n,l,eye,600.0*inversesqrt(dot(dist,dist)));

  // Bioluminescent foam at wave crests
  float foam=smoothstep(SEA_HEIGHT*0.75,SEA_HEIGHT*1.1,p.y);
  foam*=foam;
  vec3 bioGlow=vec3(0.31,0.76,0.97); // cyan #4fc3f7
  color+=bioGlow*foam*0.3*atten;

  return color;
}
vec3 getNormal(vec3 p,float eps){
  vec3 n; n.y=map_detailed(p);
  n.x=map_detailed(vec3(p.x+eps,p.y,p.z))-n.y;
  n.z=map_detailed(vec3(p.x,p.y,p.z+eps))-n.y;
  n.y=eps; return normalize(n);
}
float heightMapTracing(vec3 ori,vec3 dir,out vec3 p){
  float tm=0.0,tx=1000.0,hx=map(ori+dir*tx);
  if(hx>0.0){p=ori+dir*tx;return tx;}
  float hm=map(ori);
  for(int i=0;i<NUM_STEPS;i++){
    float tmid=mix(tm,tx,hm/(hm-hx));
    p=ori+dir*tmid; float hmid=map(p);
    if(hmid<0.0){tx=tmid;hx=hmid;}else{tm=tmid;hm=hmid;}
    if(abs(hmid)<EPSILON) break;
  }
  return mix(tm,tx,hm/(hm-hx));
}
vec3 getPixel(vec2 coord,float time){
  vec2 uv=coord/iResolution.xy*2.0-1.0;
  uv.x*=iResolution.x/iResolution.y;
  vec3 ang=vec3(sin(time*3.0)*0.1,sin(time)*0.2+0.3,time);
  vec3 ori=vec3(0.0,3.5,time*5.0);
  vec3 dir=normalize(vec3(uv.xy,-2.0)); dir.z+=length(uv)*0.14;
  dir=normalize(dir)*fromEuler(ang);
  vec3 p; heightMapTracing(ori,dir,p);
  vec3 dist=p-ori;
  vec3 n=getNormal(p,dot(dist,dist)*EPSILON_NRM);
  vec3 light=normalize(vec3(0.0,1.0,0.8));
  vec3 skyCol=getSkyColor(dir);
  vec3 seaCol=getSeaColor(p,n,light,dir,dist);
  vec3 color=mix(skyCol,seaCol,pow(smoothstep(0.0,-0.02,dir.y),0.2));

  // Depth fog — darker in wave troughs
  float depthDist=length(dist);
  float depthFog=1.0-exp(-depthDist*0.012);
  color=mix(color,uSeaBase*0.4,depthFog*0.35);

  // God rays — vertical light shafts
  float rays=0.0;
  float rayUV=(coord.x/iResolution.x-0.5)*2.0;
  rays+=smoothstep(0.4,0.0,abs(rayUV-0.3*sin(time*0.7)))*0.08;
  rays+=smoothstep(0.5,0.0,abs(rayUV+0.4*sin(time*0.5+1.5)))*0.06;
  rays+=smoothstep(0.35,0.0,abs(rayUV-0.1*sin(time*0.9+3.0)))*0.05;
  float rayFade=smoothstep(0.0,0.6,coord.y/iResolution.y);
  color+=vec3(0.31,0.76,0.97)*rays*rayFade;

  return color;
}
void main(){
  float time=iTime*${CFG.time.speed.toFixed(4)}+iMouse.x*${CFG.time.mouseInfluence.toFixed(4)};
  vec3 color=getPixel(gl_FragCoord.xy,time);
  fragColor=vec4(pow(color,vec3(0.65)),1.0);
}`

const VERT_SRC = `#version 300 es
in vec2 pos;
void main(){gl_Position=vec4(pos,0,1);}`

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s)
    gl.deleteShader(s)
    throw new Error(log ?? 'Shader compilation failed')
  }
  return s
}

export default function WaterShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef([0, 0, 0, 0])
  const animRef = useRef(0)
  const visibleRef = useRef(true)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT_SRC))
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(prog, 'pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uRes      = gl.getUniformLocation(prog, 'iResolution')
    const uTime     = gl.getUniformLocation(prog, 'iTime')
    const uMouse    = gl.getUniformLocation(prog, 'iMouse')
    const uSeaBase  = gl.getUniformLocation(prog, 'uSeaBase')
    const uSeaWater = gl.getUniformLocation(prog, 'uSeaWater')

    function resize() {
      if (!canvas) return
      const s = CFG.renderScale
      canvas.width  = Math.round(canvas.clientWidth * s)
      canvas.height = Math.round(canvas.clientHeight * s)
      gl!.viewport(0, 0, canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize)
    resize()

    // Pause rendering when hero scrolls off-screen
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting },
      { threshold: 0 },
    )
    observer.observe(canvas)

    const onMove = (e: MouseEvent) => {
      mouseRef.current[0] = e.clientX
      mouseRef.current[1] = canvas!.height - e.clientY
    }
    window.addEventListener('mousemove', onMove)

    const t0 = performance.now()
    const frameInterval = 1000 / 45 // Target ~45fps for water shader
    function render(now: number) {
      animRef.current = requestAnimationFrame(render)
      if (!visibleRef.current) return
      // Throttle to ~30fps
      if (now - lastFrameRef.current < frameInterval) return
      lastFrameRef.current = now

      const t = (performance.now() - t0) / 1000
      const m = mouseRef.current
      const palette = getCurrentPalette()
      gl!.uniform3f(uRes, canvas!.width, canvas!.height, 1)
      gl!.uniform1f(uTime, t)
      gl!.uniform4f(uMouse, m[0], m[1], m[2], m[3])
      gl!.uniform3f(uSeaBase, palette.seaBase[0], palette.seaBase[1], palette.seaBase[2])
      gl!.uniform3f(uSeaWater, palette.seaWater[0], palette.seaWater[1], palette.seaWater[2])
      gl!.drawArrays(gl!.TRIANGLES, 0, 6)
    }
    animRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animRef.current)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      gl.deleteProgram(prog)
      gl.deleteBuffer(buf)
      gl.deleteVertexArray(vao)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
    />
  )
}
