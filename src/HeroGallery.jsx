import React,{useEffect,useRef,useState} from 'react';
import {asset} from './assets.js';

export const heroPhotos=[
 {file:'factory',width:1418,height:896,page:2,en:'Our factory in Yuhuan',zh:'玉环厂房实景',kind:'factory'},
 {file:'four-cylinder',width:505,height:335,page:24,en:'Four-cylinder compressor series',zh:'四缸压缩机系列',kind:'product'},
 {file:'workshop',width:593,height:447,page:3,en:'Inside the compressor workshop',zh:'压缩机车间实景',kind:'factory'},
 {file:'six-cylinder',width:564,height:371,page:26,en:'Six-cylinder compressor series',zh:'六缸压缩机系列',kind:'product'},
 {file:'condensers',width:1418,height:641,page:44,en:'Condenser series',zh:'冷凝器系列',kind:'product'},
 {file:'honours',width:1420,height:604,page:3,en:'Honours & certificates',zh:'荣誉与证书',kind:'honours'},
];

export function HeroGallery({lang,children}){
 const [index,setIndex]=useState(0),[requested,setRequested]=useState(0),[ready,setReady]=useState([]);
 const gesture=useRef(null),photo=heroPhotos[index],label=(en,zh)=>lang==='zh'?zh:en;
 useEffect(()=>{if(ready.includes(requested))setIndex(requested)},[requested,ready]);
 const select=delta=>setRequested((index+delta+heroPhotos.length)%heroPhotos.length);
 const start=e=>{if(e.button!==0||e.target.closest('a,button,input'))return;gesture.current={x:e.clientX,y:e.clientY}};
 const finish=e=>{const g=gesture.current;gesture.current=null;if(!g)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)select(dx<0?1:-1)};
 return <div className={'hero-gallery swipe-gallery '+photo.kind} data-photo={photo.file} role="region" tabIndex={0} aria-roledescription="carousel" aria-label={label('Factory, product and certificate photographs. Swipe or use arrow keys to change photo.','工厂、产品与证书照片，左右滑动或使用方向键切换。')} onPointerDown={start} onPointerUp={finish} onPointerCancel={()=>gesture.current=null} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(e.key==='ArrowRight'?1:-1)}}}>
 <div className="hero-gallery-stage">{heroPhotos.map((p,i)=><img key={p.file} src={asset(`assets/hero/${p.file}.png`)} width={p.width} height={p.height} alt={label(p.en,p.zh)} className={index===i?'is-active':''} aria-hidden={index!==i} loading="eager" fetchPriority={i===0?'high':'auto'} draggable="false" onLoad={()=>setReady(r=>r.includes(i)?r:[...r,i])}/>)}</div>
 <div className="hero-photo-overlay" aria-live="polite">{children(photo)}</div>
 <span className="hero-swipe-hint">{label('← Drag or swipe →','← 左右滑动 →')}</span>
 </div>;
}
