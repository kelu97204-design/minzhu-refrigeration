import React,{lazy,Suspense} from "react";
import { createRoot } from "react-dom/client";
const CoolingFilm=lazy(()=>import('./CoolingFilm.jsx').then(m=>({default:m.CoolingFilm})));
const film=new URLSearchParams(location.search).has('film');
const App=lazy(()=>import("./App.jsx").then(m=>({default:m.App})));
import "./styles.css";
import {ProductDetail} from "./Catalog.jsx";
import {popularProducts} from "./products.js";
const slug=window.location.pathname.split("/").filter(Boolean).pop();
const product=popularProducts.find(p=>p.slug===slug);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {film ? <Suspense fallback={null}><CoolingFilm/></Suspense> : product ? <ProductDetail product={product}/> : <Suspense fallback={<p role="status">Loading COOLMEIKE…</p>}><App /></Suspense>}
  </React.StrictMode>,
);
