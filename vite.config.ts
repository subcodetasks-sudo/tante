import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig, loadEnv } from "vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ["PUBLIC_", "VITE_"])
  const apiTarget = (env.PUBLIC_BASE_URL ?? "").replace(/\/$/, "")
  const storageProxy = apiTarget
    ? {
        "/storage": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      }
    : undefined

  return {
    envPrefix: ["VITE_", "PUBLIC_"],
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: storageProxy,
    },
    preview: {
      proxy: storageProxy,
    },
  }
})
