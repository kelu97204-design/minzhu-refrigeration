import {asset} from './assets.js';
import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export function ProductScene({mode,rotate,zoom,reset,onReady,lang}){
 const host=useRef(null),state=useRef({}),[failed,setFailed]=useState(false);state.current={mode,rotate,zoom,reset,onReady,lang};
 useEffect(()=>{
  const el=host.current;let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'})}catch{setFailed(true);state.current.onReady();return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-4,4,3,-3,.1,100);camera.position.set(-6.8,4.5,7.8);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.05);scene.environment=env.texture;scene.environmentIntensity=.65;room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,0x68857c,.8));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(-3,7,5);scene.add(light);
  const model=new THREE.Group();scene.add(model);let groups=[],meshes=[],loaded=false,dead=false,amount=0,lastStyle='',lastReset=-1,visible=true,elapsed=0,dragging=false;
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enableZoom=false;controls.enablePan=false;controls.target.set(.05,.38,0);controls.minPolarAngle=.35;controls.maxPolarAngle=1.70;controls.autoRotateSpeed=2.2;controls.update();controls.saveState();controls.addEventListener('start',()=>dragging=true);controls.addEventListener('end',()=>dragging=false);renderer.domElement.style.touchAction='pan-y';
  const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(2.7,2.8,.15,96),new THREE.MeshStandardMaterial({color:0xdceaf1,metalness:.18,roughness:.6}));scene.add(pedestal);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(2.7,.012,8,96),new THREE.MeshBasicMaterial({color:0x8dc5dd,toneMapped:false}));rim.rotation.x=Math.PI/2;scene.add(rim);
  const disposeModel=root=>root.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();o.userData.blueMaterial?.dispose();o.userData.solidMaterial?.dispose()});
  new GLTFLoader().load(asset('models/minyou-compressor.glb'),gltf=>{
   if(dead){disposeModel(gltf.scene);return}model.add(gltf.scene);
   gltf.scene.traverse(o=>{
    if(o.userData.explode){groups.push(o);o.userData.home=o.position.clone();}
    if(o.isMesh){o.material=o.material.clone();o.userData.solidMaterial=o.material;o.userData.blueMaterial=new THREE.MeshBasicMaterial({color:0xe6f2fa,toneMapped:false,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
     const outline=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,18),new THREE.LineBasicMaterial({color:0x078dc5,toneMapped:false,transparent:true,opacity:.62}));outline.userData.outline=true;o.add(outline);meshes.push(o);
    }
   });loaded=true;state.current.onReady();el.dataset.loaded='true';
  },undefined,()=>{if(!dead){setFailed(true);state.current.onReady()}});
  const resize=()=>renderer.setSize(el.clientWidth,el.clientHeight);const ro=new ResizeObserver(resize);ro.observe(el);resize();const io=new IntersectionObserver(([e])=>visible=e.isIntersecting);io.observe(el);
  renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('role','img');
  const keys=e=>{if(e.key.startsWith('Arrow')){e.preventDefault();model.rotation.y+=(e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0);model.rotation.x+=(e.key==='ArrowUp'?-.08:e.key==='ArrowDown'?.08:0)}};renderer.domElement.addEventListener('keydown',keys);
  let frame,last=performance.now();
  function render(){frame=requestAnimationFrame(render);const now=performance.now(),dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;const s=state.current;
   if(s.reset!==lastReset){controls.reset();model.rotation.set(0,0,0);elapsed=0;lastReset=s.reset}
   if(loaded&&s.rotate&&!dragging)elapsed+=dt*2;
   const phase=elapsed%22,smooth=t=>t*t*(3-2*t);
   amount=phase<7?0:phase<12?smooth((phase-7)/5):phase<16?1:phase<21?1-smooth((phase-16)/5):0;
   el.dataset.phase=phase<7?'assembled':phase<12?'exploding':phase<16?'exploded':phase<21?'assembling':'assembled';el.dataset.cycle=String(Math.floor(elapsed/22));
   groups.forEach(g=>{const d=g.userData.explode;g.position.copy(g.userData.home).addScaledVector(new THREE.Vector3(...d),amount);if(g.userData.internal)g.visible=amount>.015});
   const style=s.mode;
   if(loaded&&style!==lastStyle){lastStyle=style;meshes.forEach(o=>{
    let group=o.parent;while(group&&!group.userData.explode)group=group.parent;
    const internal=group?.userData.internal;
    o.material=s.mode==='blueprint'&&!internal?o.userData.blueMaterial:o.userData.solidMaterial;
    o.children.forEach(c=>{if(c.userData.outline){c.visible=s.mode==='blueprint'&&!internal;c.material.opacity=.62}});
   })}
   const aspect=el.clientWidth/Math.max(el.clientHeight,1),extent=Math.max(2.70+amount*.95,(3.15+amount*2.65)/aspect);camera.left=-extent*aspect;camera.right=extent*aspect;camera.top=extent;camera.bottom=-extent;camera.zoom=s.zoom;camera.updateProjectionMatrix();
   controls.autoRotate=s.rotate&&!dragging;controls.update(dt);pedestal.position.y=-1.11-amount*1.4;rim.position.y=pedestal.position.y+.08;
   renderer.domElement.setAttribute('aria-label',s.lang==='zh'?'半封闭压缩机三维模型，支持方向键旋转':'Semi-hermetic compressor 3D model. Arrow keys rotate.');el.dataset.explosion=amount.toFixed(2);renderer.render(scene,camera);
  }render();
  return()=>{dead=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();controls.dispose();renderer.domElement.removeEventListener('keydown',keys);disposeModel(scene);env.dispose();renderer.dispose();renderer.domElement.remove()};
 },[]);
 return <div ref={host} className="scene product-scene">{failed&&<div className="scene-fallback"><img src={asset('assets/compressor-reference.jpg')} alt={lang==='zh'?'半封闭压缩机实拍':'Semi-hermetic compressor photograph'}/><p>{lang==='zh'?'三维暂不可用，已显示实拍图片。':'3D unavailable. Product photograph shown.'}</p></div>}</div>;
}
