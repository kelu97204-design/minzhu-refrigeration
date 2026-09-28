import React,{useEffect,useRef} from 'react';
import {asset} from './assets.js';

// Offline-rendered Blender scene; camera can travel inside a magnified pipe set.
// Stage times correspond to the authored 36-second film, not performance data.
const stageStarts=[4,15,20,28];
export function RealisticCooling({running,step,shotRequest,onStepChange,onUnavailable,lang}){
 const ref=useRef(null),state=useRef({}),visible=useRef(false),lastRequest=useRef(shotRequest);
 state.current={running,onStepChange,onUnavailable};
 useEffect(()=>{const video=ref.current;const update=()=>{if(visible.current&&state.current.running)video.play().catch(()=>{});else video.pause()};const io=new IntersectionObserver(([e])=>{visible.current=e.isIntersecting;update()});io.observe(video);const visibility=()=>{if(document.hidden)video.pause();else update()};document.addEventListener('visibilitychange',visibility);video.addEventListener('canplay',update);return()=>{io.disconnect();video.pause();video.removeEventListener('canplay',update);document.removeEventListener('visibilitychange',visibility)}},[]);
 useEffect(()=>{const video=ref.current;if(running&&visible.current&&!document.hidden)video.play().catch(()=>{});else video.pause()},[running]);
 useEffect(()=>{if(shotRequest!==lastRequest.current){ref.current.currentTime=stageStarts[step];lastRequest.current=shotRequest}},[shotRequest,step]);
 return <div className="realistic-system"><video ref={ref} loop muted playsInline preload="metadata" poster={asset('videos/cooling-realistic-poster.jpg')} aria-label={lang==='zh'?'写实制冷模型演示，含放大的管内跟随镜头':'Rendered refrigeration model with magnified inside-pipe camera shots'} onTimeUpdate={e=>{const t=e.currentTarget.currentTime;state.current.onStepChange(t<15?0:t<20?1:t<28?2:3)}} onError={()=>state.current.onUnavailable()}><source src={asset('videos/cooling-realistic.mp4')} type="video/mp4"/></video></div>
}
