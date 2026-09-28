import React from 'react';
import {renderToString} from 'react-dom/server';
import {ProductDetail} from './Catalog.jsx';
import {popularProducts,productSeo} from './products.js';
export const pages=popularProducts.map(product=>({slug:product.slug,...productSeo(product),html:renderToString(<ProductDetail product={product} staticLang="en"/>)}));
