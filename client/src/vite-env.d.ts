/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin, e.g. https://edusoft-ul7j.vercel.app (no trailing /api). */
  readonly VITE_API_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
