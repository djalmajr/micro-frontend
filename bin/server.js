import express from "express";
import { fileURLToPath, URL } from "url";

const app = express();

/** @param {string} dir */
const resolve = (dir) => {
  return express.static(fileURLToPath(new URL(dir, import.meta.url)));
};

app.use("/", resolve("../apps/main"));
app.use("/apps", resolve("../apps"));
app.use("/libs", resolve("../lib"));
app.listen(4000);
