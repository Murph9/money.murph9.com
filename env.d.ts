/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly PACKAGE_VERSION: string;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module 'vue3-simple-typeahead';