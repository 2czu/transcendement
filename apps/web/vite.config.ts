import { defineConfig } from "vite";
import fs from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    https: {
      key: fs.readFileSync(resolve(__dirname, "infra/certs/key.pem")),
      cert: fs.readFileSync(resolve(__dirname, "infra/certs/cert.pem"))
    }
  }
});