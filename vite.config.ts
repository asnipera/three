import { ConfigEnv, defineConfig } from "vite";

export default ({ mode }: ConfigEnv) => {
  return defineConfig({
    base: mode === "development" ? "" : "/three/",
    build: {
      outDir: "./docs",
    },
  });
};
