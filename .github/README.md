# 民主制冷 / Minzhu Refrigeration

Bilingual product website for Yuhuan Minzhu Refrigeration Industrial Co., Ltd., featuring a looping 3D compressor showcase, refrigeration-cycle illustration, product catalog and telephone inquiries.

## Development

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

## GitHub Pages

The workflow builds and deploys `dist/client` on every push to `main`.

```sh
npm run build:pages
```

Set `VITE_BASE_PATH=/minzhu-refrigeration/` for the GitHub project URL. Root-domain deployments use `/` by default. All product images and the GLB model are served locally from `public/`.

The compressor model illustrates a product family and generic internals, not dimensioned manufacturer CAD. There is no inquiry backend; contact buttons use phone links. Site images, branding and product model are not offered under an open-source asset license. Third-party library licenses apply to their respective code.
