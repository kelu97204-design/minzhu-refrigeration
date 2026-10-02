// Sole technical source: the factory sample values supplied by the user, 2026-09-28.
// Preserve starting-current order and nominal-power values exactly as supplied.
// TODO(factory): confirm refrigerants, cooling capacity, evaporating/condensing
// temperatures, COP, operating envelope and oil type for each individual model.
// TODO(factory): confirm MOQ, price, warranty and delivery time before publishing.
// Source: 民主样本PPT.pptx slides 24–27 (printed pages 19–22).
// Photo mapping updated by the owner on 2026-10-02; keep uploaded originals intact.
// Physical tables align by row order with the preceding model tables.
const common = {
  brand: 'COOLMEIKE',
  category: 'Semi-Hermetic Reciprocating Compressor',
  image: 'assets/compressor-reference.jpg',
  imageScope: 'family',
  technicalDrawing: null,
};
const powerSupply = {
  powerSupply50Hz: '380–420 V / 3 Ph / 50 Hz',
  powerSupply60Hz: '440–480 V / 3 Ph / 60 Hz',
};
export const popularProducts = [
  {
    ...common, model: '4DC-5.2', slug: '4dc-5-2-compatible-compressor',
    series: 'Small / Medium Four-Cylinder Series',
    nominalPower: { hp: 5, kw: 3.7 }, cylinders: 4, cylinderDiameterMm: 50, displacementM3H: 26.8,
    electrical: { ...powerSupply, maxOperatingCurrentA: 13.5, maxPowerConsumptionKw: 8.1, startingCurrentA: '107 / 62' },
    connections: { dischargeMm: 22, dischargeInch: '7/8', suctionMm: 28, suctionInch: '1-1/8' },
    dimensions: { lengthMm: 432, widthMm: 304, heightMm: 353, footingLengthMm: 293, footingWidthMm: 198 },
    oilVolumeL: 2.0, netWeightKg: 86,
  },
  {
    ...common, model: '4TCS-8.2', slug: '4tcs-8-2-compatible-compressor',
    series: 'Small / Medium Four-Cylinder Series',
    nominalPower: { hp: 8, kw: 5.5 }, cylinders: 4, cylinderDiameterMm: 60, displacementM3H: 41.3,
    electrical: { ...powerSupply, maxOperatingCurrentA: 17, maxPowerConsumptionKw: 9.4, startingCurrentA: '49 / 81' },
    connections: { dischargeMm: 28, dischargeInch: '1-1/8', suctionMm: 35, suctionInch: '1-3/8' },
    dimensions: { lengthMm: 649, widthMm: 306, heightMm: 385, footingLengthMm: 367, footingWidthMm: 256 },
    oilVolumeL: 2.6, netWeightKg: 134,
  },
  {
    ...common, model: '4PCS-10.2', slug: '4pcs-10-2-compatible-compressor',
    series: 'Small / Medium Four-Cylinder Series',
    nominalPower: { hp: 10, kw: 7.4 }, cylinders: 4, cylinderDiameterMm: 65, displacementM3H: 48.5,
    electrical: { ...powerSupply, maxOperatingCurrentA: 21, maxPowerConsumptionKw: 11.7, startingCurrentA: '59 / 99' },
    connections: { dischargeMm: 28, dischargeInch: '1-1/8', suctionMm: 35, suctionInch: '1-3/8' },
    dimensions: { lengthMm: 649, widthMm: 306, heightMm: 385, footingLengthMm: 367, footingWidthMm: 256 },
    oilVolumeL: 2.6, netWeightKg: 139,
  },
  {
    ...common, model: '4PCS-15.2', slug: '4pcs-15-2-compatible-compressor',
    series: 'Small / Medium Four-Cylinder Series',
    nominalPower: { hp: 15, kw: 11.0 }, cylinders: 4, cylinderDiameterMm: 65, displacementM3H: 48.5,
    electrical: { ...powerSupply, maxOperatingCurrentA: 31, maxPowerConsumptionKw: 16.3, startingCurrentA: '81 / 132' },
    connections: { dischargeMm: 28, dischargeInch: '1-1/8', suctionMm: 42, suctionInch: '1-5/8' },
    dimensions: { lengthMm: 670, widthMm: 306, heightMm: 385, footingLengthMm: 367, footingWidthMm: 256 },
    oilVolumeL: 2.6, netWeightKg: 147,
  },
  {
    ...common, model: '4G-20.2', slug: '4g-20-2-compatible-compressor',
    photo: { src: 'assets/products/4g-20-2.jpg', width: 1702, height: 1276 },
    series: 'Large Four / Six-Cylinder Series',
    nominalPower: { hp: 20, kw: 15.0 }, cylinders: 4, cylinderDiameterMm: 75, displacementM3H: 84.5,
    electrical: { ...powerSupply, maxOperatingCurrentA: 37, maxPowerConsumptionKw: 21.5, startingCurrentA: '97 / 158' },
    connections: { dischargeMm: 28, dischargeInch: '1-1/8', suctionMm: 54, suctionInch: '2-1/8' },
    dimensions: { lengthMm: 639, widthMm: 417, heightMm: 453, footingLengthMm: 381, footingWidthMm: 305 },
    oilVolumeL: 4.5, netWeightKg: 195,
  },
  {
    ...common, model: '6G-30.2', slug: '6g-30-2-compatible-compressor',
    series: 'Large Four / Six-Cylinder Series',
    nominalPower: { hp: 30, kw: 22.0 }, cylinders: 6, cylinderDiameterMm: 75, displacementM3H: 126.8,
    electrical: { ...powerSupply, maxOperatingCurrentA: 53, maxPowerConsumptionKw: 31.9, startingCurrentA: '125 / 220' },
    connections: { dischargeMm: 35, dischargeInch: '1-3/8', suctionMm: 54, suctionInch: '2-1/8' },
    dimensions: { lengthMm: 765, widthMm: 452, heightMm: 445, footingLengthMm: 381, footingWidthMm: 305 },
    oilVolumeL: 4.75, netWeightKg: 229,
  },
  {
    ...common, model: '6F-40.2', slug: '6f-40-2-compatible-compressor',
    photo: { src: 'assets/products/6f-40-2.jpg', width: 1707, height: 1280 },
    series: 'Large Four / Six-Cylinder Series',
    nominalPower: { hp: 40, kw: 30.0 }, cylinders: 6, cylinderDiameterMm: 82, displacementM3H: 151.6,
    electrical: { ...powerSupply, maxOperatingCurrentA: 78, maxPowerConsumptionKw: 38.6, startingCurrentA: '180 / 323' },
    connections: { dischargeMm: 42, dischargeInch: '1-5/8', suctionMm: 54, suctionInch: '2-1/8' },
    dimensions: { lengthMm: 795, widthMm: 452, heightMm: 445, footingLengthMm: 381, footingWidthMm: 305 },
    oilVolumeL: 4.75, netWeightKg: 240,
  },
].map(product => ({
  ...product,
  image: product.photo?.src || `assets/catalog/page-${product.series.startsWith('Small')?24:26}.jpg`,
  imageScope: product.photo ? 'product' : 'family',
  // The former 4G photograph is the owner's selected 6G photograph.
  // Drawings follow cylinder series, independently from photograph selection.
  photoFamily: product.model==='4DC-5.2'?'small':product.series.startsWith('Small')?'medium':'large',
  drawingFamily: product.cylinders===6?'six':product.series.startsWith('Small')?'medium':'large',
  technicalDrawing: `assets/catalog/page-${product.series.startsWith('Small')?25:27}.jpg`,
  compatibility: { referenceBrand: 'BITZER', referenceModel: product.model, originalProduct: false },
}));

export const nominalPowerText = p => `${p.nominalPower.hp} HP / ${p.nominalPower.kw.toFixed(1)} kW`;
export const productTitle = (p, lang='en') => lang==='zh' ? `${p.model} 兼容型半封闭制冷压缩机` : `${p.model} Compatible Semi-Hermetic Compressor`;
export const productDescription = (p, lang='en') => lang==='zh'
  ? `COOLMEIKE ${p.model} 由库美克独立制造，是面向部分 BITZER® ${p.model} 应用的兼容替换选项。具体适配需结合实际设备与工况确认。`
  : `COOLMEIKE ${p.model} is an independently manufactured semi-hermetic reciprocating compressor designed as a compatible replacement option for selected BITZER® ${p.model} applications.`;
export const productSeo = (p, lang='en') => ({
  title: `${productTitle(p,lang)} | COOLMEIKE`,
  description: lang==='zh'
    ? `COOLMEIKE ${p.model} 兼容型半封闭制冷压缩机，${p.nominalPower.hp} HP，${p.cylinders} 缸，排气量 ${p.displacementM3H} m³/h。联系库美克了解技术资料与报价。`
    : `COOLMEIKE ${p.model} compatible semi-hermetic compressor with ${p.nominalPower.hp} HP power, ${p.cylinders} cylinders and ${p.displacementM3H} m³/h displacement. Contact us for technical information and quotation.`,
});

// Rows are shared by the visible tables and the static HTML renderer.
export function specificationGroups(p,lang='en') {
  const label=(en,zh)=>lang==='zh'?zh:en, d=p.dimensions, e=p.electrical, c=p.connections;
  return [
    {title:label('General','基本参数'),rows:[
      [label('Model','型号'),p.model],
      [label('Product Type','产品类型'),label(p.category,'半封闭往复式压缩机')],
      [label('Series','系列'),label(p.series,p.series.startsWith('Small')?'中小型四缸系列':'大型四缸 / 六缸系列')],
      [label('Nominal Power','名义功率'),nominalPowerText(p)],
      [label('Number of Cylinders','气缸数量'),String(p.cylinders)],
      [label('Cylinder Diameter','缸径'),`${p.cylinderDiameterMm} mm`],
      [label('Displacement','排气量'),`${p.displacementM3H} m³/h`],
    ]},
    {title:label('Electrical','电气参数'),rows:[
      [label('Max Operating Current','最大运行电流'),`${e.maxOperatingCurrentA} A`],
      [label('Max Power Consumption','最大功率消耗'),`${e.maxPowerConsumptionKw} kW`],
      [label('Starting Current','启动电流'),`${e.startingCurrentA} A`],
      [label('Power Supply','电源'),`${e.powerSupply50Hz}\n${e.powerSupply60Hz}`],
    ]},
    {title:label('Connections','接口参数'),rows:[
      [label('Discharge Connection','排气接口'),`${c.dischargeMm} mm / ${c.dischargeInch}"`],
      [label('Suction Connection','吸气接口'),`${c.suctionMm} mm / ${c.suctionInch}"`],
    ]},
    {title:label('Physical Data','尺寸与重量'),rows:[
      [label('Overall Dimensions (L × W × H)','外形尺寸（长 × 宽 × 高）'),`${d.lengthMm} × ${d.widthMm} × ${d.heightMm} mm`],
      [label('Footing Size','底脚尺寸'),`${d.footingLengthMm} × ${d.footingWidthMm} mm`],
      [label('Oil Volume','油量'),`${Number.isInteger(p.oilVolumeL)?p.oilVolumeL.toFixed(1):p.oilVolumeL} L`],
      [label('Net Weight','净重'),`${p.netWeightKg} kg`],
    ]},
  ];
}
