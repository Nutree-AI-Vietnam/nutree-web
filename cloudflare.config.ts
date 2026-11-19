import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "nutree-web",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-19",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    observability: {
      enabled: true,
      traces: { enabled: true },
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      // Non-secret values pulled from the Vercel production environment.
      // Sensitive Vercel values (Cloudflare API token, Firebase web keys) are not
      // returned by the API; set those as Worker secrets before deploy.
      MEALTRACK_PROD_API_URL: bindings.text("https://api.nutreeai.com/"),
      MEALTRACK_SIT_API_URL: bindings.text("https://mealtrack-backend-main.onrender.com"),
      NEXT_PUBLIC_MEALTRACK_API_URL: bindings.text("https://mealtrack-backend-main.onrender.com"),
      NEXT_PUBLIC_MEALTRACK_ADMIN_USE_PROXY: bindings.text("true"),
    },
  }),
});
