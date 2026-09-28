import {shotAt,smooth,stepTimes,CYCLE_SECONDS} from './cooling-story.js';
import {asset} from './assets.js';
import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const BLUE=0x048dd0,PALE=0xe4f2fc;
function setup(el,size=4.7,minHalfWidth=0,perspective=false){
 const scene=new THREE.Scene();
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 el.appendChild(renderer.domElement);
 const camera=perspective?new THREE.PerspectiveCamera(42,1,.1,100):new THREE.OrthographicCamera(-size,size,size,-size,.1,100);camera.position.set(8,6,9);camera.lookAt(0,0,0);
 const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;const aspect=w/h,extent=Math.max(size,minHalfWidth/aspect);camera.aspect=aspect;camera.left=-extent*aspect;camera.right=extent*aspect;camera.top=extent;camera.bottom=-extent;camera.updateProjectionMatrix();renderer.setSize(w,h)};
 const observer=new ResizeObserver(resize);observer.observe(el);resize();
 scene.add(new THREE.HemisphereLight(0xffffff,0x66859c,2.4));const sun=new THREE.DirectionalLight(0xffffff,3.5);sun.position.set(4,8,5);scene.add(sun);const back=new THREE.DirectionalLight(0xb7e4ff,2);back.position.set(-4,3,-6);scene.add(back);
 let visible=true;const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting});io.observe(el);
 const dispose=()=>{observer.disconnect();io.disconnect();scene.traverse(o=>{o.geometry?.dispose();o.userData.solidMaterial?.dispose();o.userData.blueMaterial?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose()}}});renderer.dispose();renderer.domElement.remove()};
 return {scene,renderer,camera,dispose,visible:()=>visible&&!document.hidden};
}
function material(color=PALE){return new THREE.MeshStandardMaterial({color,roughness:.68,metalness:.12})}
function part(parent,geo,pos=[0,0,0],color=PALE,edges=true){const mesh=new THREE.Mesh(geo,material(color));mesh.position.set(...pos);mesh.userData.solidColor=color;parent.add(mesh);if(edges){const line=new THREE.LineSegments(new THREE.EdgesGeometry(geo,12),new THREE.LineBasicMaterial({color:BLUE,transparent:true,opacity:.85}));mesh.add(line);line.userData.isOutline=true}return mesh}
function box(parent,w,h,d,pos,color,r=.03){return part(parent,new RoundedBoxGeometry(w,h,d,2,r),pos,color)}
function cyl(parent,r,h,pos,color,axis='y',segments=48){const m=part(parent,new THREE.CylinderGeometry(r,r,h,segments),pos,color);if(axis==='x')m.rotation.z=Math.PI/2;if(axis==='z')m.rotation.x=Math.PI/2;return m}
function bolt(parent,pos,axis='y'){return cyl(parent,.055,.055,pos,0xa9b7bd,axis,6)}
function ring(parent,r,t,pos,axis='y',color=0x44755b){return cyl(parent,r,t,pos,color,axis)}
function tube(parent,points,r=.04,color=BLUE){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');const mesh=part(parent,new THREE.TubeGeometry(curve,64,r,8,false),[0,0,0],color,false);return {mesh,curve}}

// Stylized exterior visualization based on the public product photographs.
// No fabricated engineering dimensions or internal CAD geometry are represented.
function compressor(){
 const g=new THREE.Group(),green=0x35684f,dark=0x245642;
 cyl(g,.72,2.08,[.82,.22,0],green,'x');
 cyl(g,.77,.12,[-.22,.22,0],dark,'x');cyl(g,.77,.12,[1.8,.22,0],green,'x');
 cyl(g,.67,.15,[1.92,.22,0],green,'x');cyl(g,.48,.05,[2.015,.22,0],dark,'x');
 for(let i=0;i<18;i++){let a=i/18*Math.PI*2;const fin=box(g,1.58,.13,.048,[.82,.22+Math.cos(a)*.76,Math.sin(a)*.76],green,.012);fin.rotation.x=a;}
 for(let i=0;i<8;i++){let a=i/8*Math.PI*2;bolt(g,[1.99,.22+Math.cos(a)*.58,Math.sin(a)*.58],'x');bolt(g,[-.31,.22+Math.cos(a)*.65,Math.sin(a)*.65],'x')}
 box(g,1.6,1.28,1.39,[-.93,.1,0],green,.14);
 cyl(g,.59,.13,[-1.8,.15,0],dark,'x');cyl(g,.47,.06,[-1.88,.15,0],green,'x');
 for(let i=0;i<8;i++){let a=i/8*Math.PI*2;bolt(g,[-1.93,.15+Math.cos(a)*.49,Math.sin(a)*.49],'x')}
 // Cylinder head blocks, flanges, cover bolts and external shutoff valves.
 for(const z of [-.43,.43]){
  const head=new THREE.Group();g.add(head);head.position.set(-.92,.73,z);head.rotation.x=z<0?-.17:.17;
  box(head,1.27,.34,.58,[0,0,0],green,.07);box(head,1.39,.105,.66,[0,.215,0],dark,.045);
  for(const x of [-.51,0,.51]){bolt(head,[x,.30,-.23]);bolt(head,[x,.30,.23])}
  for(let i=0;i<5;i++)box(head,.07,.035,.43,[-.4+i*.2,.282,0],green,.005);
 }
 box(g,.87,.43,.88,[.77,1.07,0],dark,.055);box(g,.94,.06,.94,[.77,1.315,0],green,.02);
 for(const x of [.39,1.15])for(const z of [-.38,.38])bolt(g,[x,1.365,z]);
 // Front terminal plaque.
 box(g,.52,.25,.018,[.76,1.055,.45],0xc9d1ce,.006);
 for(const p of [[-.91,1.45,-.1],[1.5,1.18,0]]){
  cyl(g,.105,.44,p,0x597f66);ring(g,.23,.09,[p[0],p[1]-.17,p[2]],'y',green);
  cyl(g,.105,.37,[p[0],p[1]+.11,p[2]+.16],0x668770,'z');cyl(g,.14,.085,[p[0],p[1]+.11,p[2]+.37],0xa2a78a,'z');
  cyl(g,.085,.08,[p[0],p[1]+.27,p[2]],0x324a41,'y',6);
 }
 for(const x of [-1.2,1.22])for(const z of [-.62,.62]){box(g,.22,.42,.24,[x,-.73,z],green,.015);box(g,.65,.105,.48,[x,-.99,z],dark,.025);bolt(g,[x+.20,-.905,z]);}
 cyl(g,.14,.04,[-.95,-.13,.72],0x879a8d,'z');cyl(g,.087,.045,[-.95,-.13,.75],0x2d4540,'z');
 box(g,.37,.27,.015,[-1.1,.3,.705],0xb8c6bc,.005);
 tube(g,[[-1.59,.5,-.55],[-1.68,.93,-.61],[-1.47,1.13,-.62],[-1.2,1.13,-.62]],.05,dark);
 g.rotation.y=-.13;return g;
}
function styleModel(g,mode){g.traverse(o=>{if(o.isMesh){if(!o.userData.solidMaterial){o.userData.solidMaterial=o.material;o.userData.solidMaterial.roughness=.46;o.userData.solidMaterial.metalness=.32;o.userData.blueMaterial=new THREE.MeshBasicMaterial({color:PALE,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1})}o.material=mode==='blueprint'?o.userData.blueMaterial:o.userData.solidMaterial}else if(o.userData.isOutline){o.material.color.set(mode==='blueprint'?BLUE:0x264837);o.material.opacity=mode==='blueprint'?.9:.16}})}

export function ProductScene({mode,rotate,zoom,reset,onReady,lang}){
 const host=useRef(null),state=useRef({}),[failed,setFailed]=useState(false);state.current={mode,rotate,zoom,reset,onReady,lang};
 useEffect(()=>{
  let engine;try{engine=setup(host.current,3.0)}catch{setFailed(true);state.current.onReady();return}
  const {scene,renderer,camera}=engine,model=compressor();scene.add(model);model.position.y=-.07;
  camera.position.set(7,4.8,8);camera.lookAt(0,.1,0);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.065;controls.enableZoom=false;controls.enablePan=false;controls.minPolarAngle=.48;controls.maxPolarAngle=1.65;controls.target.set(0,.12,0);controls.autoRotateSpeed=.55;
  // Horizontal drag rotates; vertical swipes keep the mobile page scrollable.
  controls.touches.ONE=THREE.TOUCH.ROTATE;renderer.domElement.style.touchAction='pan-y';controls.saveState();
  const grid=new THREE.GridHelper(8,16,0xc0dceb,0xdcecf6);grid.position.y=-1.07;grid.material.transparent=true;grid.material.opacity=.48;scene.add(grid);
  const base=box(scene,5.3,.045,3.1,[0,-1.04,0],0xecf5fc,.04);base.material.dispose();base.material=new THREE.MeshBasicMaterial({color:0xe4f0fa});base.children[0].material.opacity=.35;
  renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('role','img');
  const keys=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')model.rotation.y-=.15;if(e.key==='ArrowRight')model.rotation.y+=.15;if(e.key==='ArrowUp')model.rotation.x-=.08;if(e.key==='ArrowDown')model.rotation.x+=.08}};
  renderer.domElement.addEventListener('keydown',keys);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scroll=0;const onScroll=()=>{scroll=Math.min(window.scrollY/window.innerHeight,1)};window.addEventListener('scroll',onScroll,{passive:true});
  let frame,prevMode,lastReset=-1,lastZoom=0,frames=0;
  const render=()=>{frame=requestAnimationFrame(render);if(!engine.visible())return;const s=state.current;if(s.mode!==prevMode){styleModel(model,s.mode);prevMode=s.mode}if(s.reset!==lastReset){controls.reset();model.rotation.set(0,-.13,0);lastReset=s.reset}if(lastZoom!==s.zoom){camera.zoom=s.zoom;camera.updateProjectionMatrix();lastZoom=s.zoom}if(!reduced)model.position.y=-.07+scroll*.25;controls.autoRotate=s.rotate;controls.update();renderer.domElement.setAttribute('aria-label',s.lang==='zh'?'可旋转压缩机三维外观示意，支持方向键':'Rotatable compressor exterior illustration. Use arrow keys.');renderer.render(scene,camera);if(frames++===0)s.onReady()};render();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);controls.dispose();renderer.domElement.removeEventListener('keydown',keys);engine.dispose()};
 },[]);
 return <div className="scene product-scene" ref={host}>{failed&&<div className="scene-fallback"><img src={asset('assets/compressor.jpg')} alt={lang==='zh'?'半封闭压缩机':'Semi-hermetic compressor'}/><p>{lang==='zh'?'当前设备不支持三维展示，已显示产品实拍。':'3D is unavailable on this device. Product photo shown.'}</p></div>}</div>;
}

export function SystemScene({running,step,application,lang,follow=true,shotRequest=0,onStepChange}){
 const host=useRef(null),state=useRef({}),labels=useRef([]),caption=useRef(null),bar=useRef(null),[failed,setFailed]=useState(false);state.current={running,step,application,lang,follow,shotRequest,onStepChange};
 useEffect(()=>{
  let engine;try{engine=setup(host.current,4.5,4.9,true)}catch{setFailed(true);return}
  const {scene,renderer,camera}=engine;camera.position.set(9,9,11);camera.lookAt(0,.3,0);
  const world=new THREE.Group();scene.add(world);world.position.set(-.2,-.2,0);
  box(world,8.3,.12,5.6,[0,-.12,0],0xe1edf5,.05);
  const room=new THREE.Group();world.add(room);room.position.set(-1.7,0,-.15);
  box(room,3.9,.16,4.3,[0,0,0],0xd0e4f2,.03);
  box(room,3.9,2.9,.1,[0,1.5,-2.08],0xe8f4fb,.02);box(room,.1,2.9,4.3,[-1.9,1.5,0],0xe8f4fb,.02);
  for(let i=0;i<9;i++)box(room,.018,2.7,.018,[-1.7+i*.4,1.5,-2.015],0xb7d6e9,.003);
  for(let i=0;i<9;i++)box(room,.018,2.7,.018,[-1.835,1.5,-1.85+i*.45],0xb7d6e9,.003);
  // Open room, shelving and stored packages represent application contexts.
  const shelves=new THREE.Group();room.add(shelves);
  for(const x of [-1.2,.2]){
   for(const z of [-.9,.6])for(const dx of [-.48,.48])box(shelves,.04,1.95,.04,[x+dx,1.05,z],0x8db8ce,.004);
   for(const y of [.2,.83,1.46]){box(shelves,1.15,.045,1.6,[x,y,-.15],0xb3d1e1,.008);for(const z of [-.55,.22])box(shelves,.76,.48,.56,[x,y+.27,z],0xdce9ec,.025);}
  }
  const evap=box(room,1.65,.48,.40,[.65,2.25,-1.72],0xa8d6ec,.025);
  for(const x of [.22,1.05]){cyl(room,.16,.045,[x,2.25,-1.49],0xe9f7ff,'z');const blade=new THREE.Group();room.add(blade);blade.position.set(x,2.25,-1.46);for(let i=0;i<3;i++){let b=box(blade,.05,.24,.025,[0,.03,0],0x75aac5,.015);b.rotation.z=i*Math.PI/3}evap.userData.fans??=[];evap.userData.fans.push(blade);}
  const mini=compressor();mini.scale.setScalar(.28);mini.position.set(2.15,.43,1.28);world.add(mini);styleModel(mini,'blueprint');
  const cond=box(world,1.7,1.5,.5,[2.15,.87,-1.14],0xcae6f5,.055);
  for(let i=0;i<13;i++)box(world,1.42,.024,.026,[2.15,.3+i*.095,-.87],0x85b5ce,.001);
  const fan=new THREE.Group();world.add(fan);fan.position.set(2.15,.87,-.82);cyl(fan,.43,.04,[0,0,0],0xdff1fc,'z');const fanRotor=new THREE.Group();fan.add(fanRotor);for(let i=0;i<4;i++){const b=box(fanRotor,.11,.62,.025,[0,0,.04],0x72a5bf,.04);b.rotation.z=i*Math.PI/4;}
  const valve=cyl(world,.13,.30,[.02,.44,-1.2],0x7293a4,'x',8);
  // Closed refrigeration loop, each segment reflects the correct sequence.
  const paths=[
   [[2.25,.75,1.25],[3.35,1.0,1.3],[3.4,1.25,-.8],[2.6,1.25,-1.1]],
   [[1.75,.8,-1.1],[.8,.55,-1.1],[.02,.44,-1.2]],
   [[.02,.44,-1.2],[-.48,.7,-1.45],[-.65,1.7,-1.85],[-1.05,2.25,-1.88]],
   [[-1.05,2.0,-1.6],[-.15,1.1,-.2],[.1,.45,1.3],[1.55,.45,1.3]]
  ];
  const colors=[0xd38542,0xd38542,0x0396d8,0x0396d8],routes=[],particles=[];
  paths.forEach((ps,i)=>{const route=tube(world,ps,.035,colors[i]);routes.push(route);for(let j=0;j<8;j++){const m=new THREE.Mesh(new THREE.SphereGeometry(.054,8,6),new THREE.MeshBasicMaterial({color:colors[i]}));world.add(m);particles.push({m,curve:route.curve,offset:j/8,phase:i})}});
  const air=[];for(let i=0;i<23;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.018,6,4),new THREE.MeshBasicMaterial({color:0x29a8e7,transparent:true,opacity:.55}));room.add(m);air.push({m,x:(i%5)*.45-.75,z:(i%3)*.45-.85,offset:i/23})}
  const commercial=new THREE.Group();room.add(commercial);box(commercial,2.9,1.5,1.2,[-.2,.8,.25],0xe5f4fc,.08);const glass=box(commercial,2.7,.65,1.08,[-.2,1.27,.26],0xc5e9f9,.04);glass.material.transparent=true;glass.material.opacity=.45;for(let i=0;i<6;i++)box(commercial,.32,.3,.6,[-1.3+i*.44,.9,.26],0xa9c9bf,.025);
  const equipment=new THREE.Group();room.add(equipment);for(let i=0;i<3;i++){const m=compressor();m.scale.setScalar(.23);m.position.set(-.4,.5,-1.1+i*1.05);styleModel(m,'blueprint');equipment.add(m)}
  const points=[new THREE.Vector3(2.1,1.1,1.45),new THREE.Vector3(2.25,2.03,-1.2),new THREE.Vector3(.1,.7,-1.35),new THREE.Vector3(-1.1,2.75,-1.65)];
  // Visible internal coil paths connect the external pipe segments, without implying CAD.
  const condenserCoil=tube(world,[[2.6,1.25,-1.1],[2.72,1.38,-.77],[1.53,1.38,-.77],[1.53,1.07,-.77],[2.72,1.07,-.77],[2.72,.71,-.77],[1.53,.71,-.77],[1.75,.8,-1.1]],.026,0xed8737);
  const evaporatorCoil=tube(world,[[-1.05,2.25,-1.88],[-.42,2.37,-1.60],[-1.70,2.37,-1.60],[-1.70,2.18,-1.60],[-.42,2.18,-1.60],[-1.05,2,-1.6]],.023,0x009bdf);
  const tracer=new THREE.Mesh(new THREE.SphereGeometry(.078,20,12),new THREE.MeshBasicMaterial({color:0xffa54b}));world.add(tracer);
  const halo=new THREE.Mesh(new THREE.SphereGeometry(.16,20,12),new THREE.MeshBasicMaterial({color:0xffa54b,transparent:true,opacity:.16,depthWrite:false}));world.add(halo);
  const heat=[];for(let i=0;i<14;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.027,8,6),new THREE.MeshBasicMaterial({color:0xea843b,transparent:true,opacity:.5}));world.add(m);heat.push(m)}
  const target=new THREE.Vector3(),offset=new THREE.Vector3(),fullTarget=new THREE.Vector3(-.2,.65,0),fullOffset=new THREE.Vector3(7,6,8.5),focus=new THREE.Vector3();
  let animation,time=0,last=performance.now(),lastApp=-1,lastRequest=0,lastCue=-1,lastFollow=state.current.follow,manualTime=null;
  const el=host.current;
  // Deterministic render hook exists only in the dedicated local film view.
  if(new URLSearchParams(location.search).has('film'))el.seekFilm=(seconds,settle=false)=>{manualTime=seconds;renderFrame(1/24);if(settle)for(let i=0;i<60;i++)renderFrame(1/24)};
  function renderFrame(dt){const s=state.current;const jumped=s.shotRequest!==lastRequest||s.follow!==lastFollow;lastFollow=s.follow;if(s.shotRequest!==lastRequest){time=stepTimes[s.step];lastRequest=s.shotRequest}if(manualTime===null&&s.running)time+=dt;
   const shot=shotAt(manualTime??time),t=shot.time,u=shot.progress;
   if(lastApp!==s.application){shelves.visible=s.application===0;commercial.visible=s.application===1;equipment.visible=s.application===2;lastApp=s.application}
   if(lastCue!==shot.step){s.onStepChange?.(shot.step);lastCue=shot.step}
   routes.forEach((r,i)=>{r.mesh.material.emissive.set(i===shot.step?colors[i]:0);r.mesh.material.emissiveIntensity=.35});
   fanRotor.rotation.z=t*2.5;for(const f of evap.userData.fans)f.rotation.z=t*2.5;
   particles.forEach(({m,curve,offset,phase})=>{m.position.copy(curve.getPointAt((t*.16+offset)%1));m.scale.setScalar(phase===shot.step?1.2:.65)});
   air.forEach(({m,x,z,offset})=>{const k=(t*.3+offset)%1;m.position.set(x+.65,2.02-k*1.6,z+k*1.1);m.material.opacity=Math.sin(k*Math.PI)*(shot.step===3?.85:.2)});
   heat.forEach((m,i)=>{const k=(t*.4+i/14)%1;m.position.set(1.5+(i%5)*.28,.5+k*1.8,-.52+k*.55);m.material.opacity=Math.sin(k*Math.PI)*(shot.step===1?.65:.08)});
   let point=new THREE.Vector3(2.1,.72,1.27),cameraOffset=new THREE.Vector3(3.0,2.0,3.6);
   if(shot.index===2)point=routes[0].curve.getPointAt(u);
   else if(shot.index===3)point=condenserCoil.curve.getPointAt(u);
   else if(shot.index===4)point=routes[1].curve.getPointAt(u);
   else if(shot.index===5)point.set(.02,.44,-1.2);
   else if(shot.index===6)point=routes[2].curve.getPointAt(u);
   else if(shot.index===7)point=evaporatorCoil.curve.getPointAt(u);
   else if(shot.index===8)point=routes[3].curve.getPointAt(u);
   else if(shot.index===9)point.copy(routes[3].curve.getPointAt(1)).lerp(new THREE.Vector3(2.1,.72,1.27),smooth(u));
   // Keep the subject framed with deliberate views; gently track within each component.
   focus.copy(point);
   if(shot.index===1){focus.set(2.1,.65,1.27);cameraOffset.set(2.0,1.3,2.5)}
   if(shot.index===3){focus.set(2.1,.95,-.85);cameraOffset.set(1.5,1.0,3.3)}
   if(shot.index===5){focus.set(.02,.65,-1.2);cameraOffset.set(1.9,1.4,3.0)}
   if(shot.index===6||shot.index===7){cameraOffset.set(2.2,1.2,3.4);if(shot.index===7)focus.set(-1.0,1.8,-1.25)}
   tracer.position.copy(point);halo.position.copy(point);halo.scale.setScalar(1+.2*Math.sin(t*7));
   const cold=shot.index>=5;tracer.material.color.set(cold?0x008cd5:0xf08a36);halo.material.color.copy(tracer.material.color);
   // Shells become translucent while flow through the exchanger is in view.
   cond.material.transparent=true;cond.material.opacity=shot.index===3?.18:1;
   evap.material.transparent=true;evap.material.opacity=shot.index===7?.25:1;
   condenserCoil.mesh.visible=shot.index===3;evaporatorCoil.mesh.visible=shot.index===7;
   const destination=focus.clone().add(world.position);let pull=shot.index===0?1-smooth(u):shot.index===9?smooth(u):0;
   if(!s.follow)pull=1;destination.lerp(fullTarget,pull);cameraOffset.lerp(fullOffset,pull);
   const portrait=Math.max(1,.95/(el.clientWidth/el.clientHeight));cameraOffset.multiplyScalar(portrait);
   // Damping for live interaction; exact interpolation for deterministic video frames.
   const blend=jumped?1:(s.running||manualTime!==null?1-Math.exp(-dt*4):0);
   target.lerp(destination,blend);offset.lerp(cameraOffset,blend);
   camera.position.copy(target).add(offset);camera.lookAt(target);camera.updateMatrixWorld();
   points.forEach((p,i)=>{const v=p.clone().add(world.position).project(camera);const label=labels.current[i];if(label){label.style.display=(!s.follow||shot.index===0||shot.index===9)&&Math.abs(v.x)<.86&&v.y<.7&&v.y>-.55?'':'none';label.style.left=((v.x*.5+.5)*el.clientWidth)+'px';label.style.top=((-v.y*.5+.5)*el.clientHeight)+'px';label.classList.toggle('selected',i===shot.step)}});
   const text=shot[s.lang==='zh'?'zh':'en'];if(caption.current){caption.current.children[0].textContent=text[0];caption.current.children[1].textContent=text[1]}if(bar.current)bar.current.style.transform=`scaleX(${t/CYCLE_SECONDS})`;
   el.dataset.shot=String(shot.index);el.dataset.time=t.toFixed(2);el.dataset.follow=String(s.follow);el.dataset.ready='true';renderer.domElement.setAttribute('aria-label',s.lang==='zh'?'镜头跟随制冷剂的制冷循环演示':'Camera following refrigerant through the cooling cycle');renderer.render(scene,camera);
  }
  target.copy(fullTarget);offset.copy(fullOffset);
  const render=()=>{animation=requestAnimationFrame(render);const now=performance.now(),dt=Math.min((now-last)/1000,.06);last=now;if(engine.visible()&&manualTime===null)renderFrame(dt)};render();
  return()=>{cancelAnimationFrame(animation);delete el.seekFilm;engine.dispose()};
 },[]);
 const names=lang==='zh'?['压缩机','冷凝器','节流装置','蒸发器']:['COMPRESSOR','CONDENSER','EXPANSION','EVAPORATOR'];
 return <div className="scene system-scene" ref={host} role="img" aria-label={lang==='zh'?'制冷循环三维示意：压缩、冷凝、节流与蒸发':'3D cooling cycle: compression, condensation, expansion and evaporation'}>{!failed&&names.map((n,i)=><span key={i} ref={el=>labels.current[i]=el} className={'system-label '+(step===i?'selected':'')}>{String(i+1).padStart(2,'0')} / {n}</span>)}{!failed&&<><div className="film-caption" ref={caption}><strong/><p/></div><div className="film-progress"><i ref={bar}/></div></>}{failed&&<div className="scene-fallback"><img src={asset('assets/unit.jpg')} alt={lang==='zh'?'冷凝机组':'Condensing unit'}/><p>{lang==='zh'?'三维展示不可用，请查看右侧循环步骤。':'3D unavailable. Explore the cycle steps alongside.'}</p></div>}</div>;
}
