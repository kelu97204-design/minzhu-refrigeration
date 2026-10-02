import React from 'react';

// Adapted from the About Us text in the supplied factory PPT, slide 2.
// Keep the English readable without adding scale, certification or export claims.
const profile={
 en:{title:'About COOLMEIKE',paragraphs:[
  'Yuhuan Minzhu Refrigeration Industrial Co., Ltd. develops and manufactures refrigeration and air-conditioning equipment under the COOLMEIKE brand. Our business brings together product development, manufacturing, sales and after-sales service.',
  'Our approach is people-first, with a commitment to continuous improvement in product quality and service. We look forward to working with customers on their refrigeration requirements.',
 ]},
 zh:{title:'关于库美克',paragraphs:[
  '玉环民主制冷实业有限公司从事“库美克”品牌制冷及空调设备的开发与制造，业务涵盖产品开发、制造、销售及售后服务。',
  '公司秉承“以人为本”的经营理念，致力于持续改进产品质量与服务。欢迎客户与我们沟通制冷需求，携手开展合作。',
 ]},
};

export function ContactAbout({lang}){
 const text=profile[lang];
 return <section className="contact-company" aria-labelledby="contact-company-title">
  <h3 id="contact-company-title">{text.title}</h3>
  {text.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
 </section>;
}
