import React from 'react';
import {asset} from './assets.js';

// Window onto the original trademark on slide 1; preserve the supplied artwork.
export function BrandMark(){
 return <span className="brand-emblem" role="img" aria-label="COOLMEIKE 库美克"><img src={asset('assets/coolmeke-catalog-cover.jpg')} alt=""/></span>;
}
