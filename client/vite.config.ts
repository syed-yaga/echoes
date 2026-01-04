import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import tailwindscrollbar from "tailwind-scrollbar";

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:3000",
  //       secure: false,
  //       changeOrigin: true,
  //     },
  //   },
  // },
  plugins: [react(), tailwindcss(), flowbiteReact(), tailwindscrollbar()],
});
