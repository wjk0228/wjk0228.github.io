import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative assets work for both user/organization sites and project sites.
  base: "./",
  plugins: [react()],
});
