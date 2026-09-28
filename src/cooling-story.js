export const CYCLE_SECONDS=30;
export const stepTimes=[2,9,15,20];
export const story=[
 {start:0,end:2,step:0,en:['A journey through cooling','Follow the refrigerant.'],zh:['跟随一程冷量','从冷库全景，走进制冷循环。']},
 {start:2,end:5,step:0,en:['01 / Pressure rises','The compressor raises the pressure of refrigerant vapour.'],zh:['01 / 压缩，提升压力','压缩机压缩制冷剂蒸气，压力与温度升高。']},
 {start:5,end:9,step:0,en:['Follow the hot vapour','High-pressure vapour travels to the condenser.'],zh:['跟随高温蒸气','高压制冷剂蒸气沿排气管进入冷凝器。']},
 {start:9,end:12,step:1,en:['02 / Heat leaves the system','Heat is released to the surroundings as refrigerant condenses.'],zh:['02 / 冷凝，向外放热','热量释放到环境中，制冷剂逐渐冷凝。']},
 {start:12,end:15,step:1,en:['Liquid moves onward','High-pressure liquid approaches the expansion device.'],zh:['液态制冷剂继续前行','高压液体沿管路流向节流装置。']},
 {start:15,end:17,step:2,en:['03 / Pressure drops','Expansion lowers pressure and creates a cold two-phase flow.'],zh:['03 / 节流，降低压力','节流后压力降低，形成低温气液两相流。']},
 {start:17,end:20,step:2,en:['Into the cold room','The low-pressure mixture enters the evaporator.'],zh:['进入冷库内部','低压气液混合物进入蒸发器。']},
 {start:20,end:23,step:3,en:['04 / Heat is absorbed','Refrigerant evaporates, absorbing heat from the room air.'],zh:['04 / 蒸发，从库内吸热','制冷剂蒸发并吸收空气热量，冷风送入库内。']},
 {start:23,end:27,step:3,en:['Vapour returns','Low-pressure vapour flows back to the compressor.'],zh:['回到循环起点','低压蒸气沿吸气管返回压缩机。']},
 {start:27,end:30,step:3,en:['One continuous cycle','Heat moves out. Cooling continues.'],zh:['循环往复，持续制冷','热量不断移出，制冷持续发生。']},
];
export const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
export function shotAt(seconds){const time=((seconds%CYCLE_SECONDS)+CYCLE_SECONDS)%CYCLE_SECONDS;const index=story.findIndex(s=>time>=s.start&&time<s.end);const shot=story[index];return {...shot,index,time,progress:(time-shot.start)/(shot.end-shot.start)}}
