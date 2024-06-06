# moneyButDaily

A Vue static stite
Deployed to an AWS S3 bucket, with user auth to another S3 bucket file for the data

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
project root> npm install
```

### Compile and Hot-Reload for Development

```sh
project root> npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
project root> npm run build
```

## Deploy

```sh
project root> .\deploy.ps1 -BucketName money.murph9.com
project root> aws cloudfront create-invalidation --distribution-id EDWBAVRGQTLM7 --paths "/*"
```
