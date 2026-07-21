/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BASE_URL: string
  readonly PUBLIC_ELFSIGHT_WIDGET_CLASS: string
  readonly PUBLIC_ELFSIGHT_PLATFORM_SRC: string
  readonly PUBLIC_ELFSIGHT_LOAD_TIMEOUT_MS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
