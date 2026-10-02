import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {popularProducts,productSeo} from '../src/products.js';
// Independently transcribed from factory task and catalogue pp.19–22.
const expected=[
 ['4DC-5.2',5,3.7,4,50,26.8,13.5,8.1,'107 / 62',22,'7/8',28,'1-1/8',432,304,353,293,198,2,86],
 ['4TCS-8.2',8,5.5,4,60,41.3,17,9.4,'49 / 81',28,'1-1/8',35,'1-3/8',649,306,385,367,256,2.6,134],
 ['4PCS-10.2',10,7.4,4,65,48.5,21,11.7,'59 / 99',28,'1-1/8',35,'1-3/8',649,306,385,367,256,2.6,139],
 ['4PCS-15.2',15,11,4,65,48.5,31,16.3,'81 / 132',28,'1-1/8',42,'1-5/8',670,306,385,367,256,2.6,147],
 ['4G-20.2',20,15,4,75,84.5,37,21.5,'97 / 158',28,'1-1/8',54,'2-1/8',639,417,453,381,305,4.5,195],
 ['6G-30.2',30,22,6,75,126.8,53,31.9,'125 / 220',35,'1-3/8',54,'2-1/8',765,452,445,381,305,4.75,229],
 ['6F-40.2',40,30,6,82,151.6,78,38.6,'180 / 323',42,'1-5/8',54,'2-1/8',795,452,445,381,305,4.75,240],
];
test('exact seven factory records, including unusual slash order',()=>{assert.equal(popularProducts.length,7);for(const [i,p] of popularProducts.entries()){const e=p.electrical,c=p.connections,d=p.dimensions;assert.deepEqual([p.model,p.nominalPower.hp,p.nominalPower.kw,p.cylinders,p.cylinderDiameterMm,p.displacementM3H,e.maxOperatingCurrentA,e.maxPowerConsumptionKw,e.startingCurrentA,c.dischargeMm,c.dischargeInch,c.suctionMm,c.suctionInch,d.lengthMm,d.widthMm,d.heightMm,d.footingLengthMm,d.footingWidthMm,p.oilVolumeL,p.netWeightKg],expected[i]);assert.equal(e.powerSupply50Hz,'380–420 V / 3 Ph / 50 Hz');assert.equal(e.powerSupply60Hz,'440–480 V / 3 Ph / 60 Hz')}});
test('seven static pages have distinct SEO and readable source HTML',async()=>{const titles=new Set();for(const p of popularProducts){const html=await readFile(`dist/client/products/${p.slug}/index.html`,'utf8');const title=productSeo(p).title;assert.ok(html.includes(title));titles.add(title);assert.match(html,/<h1>/);assert.ok(html.includes(p.electrical.startingCurrentA));assert.match(html,/not original BITZER products/);assert.match(html,p.photo?/Product photograph/:/Factory series photograph/);if(p.photo)assert.ok(html.includes(p.photo.src));assert.ok(html.includes(p.technicalDrawing));assert.ok(!html.includes('TODO'));}assert.equal(titles.size,7)});
