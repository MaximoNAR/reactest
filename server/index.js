import config from "./config.js";
import app from "./app.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

//Configuracion para setear a la carpeta public como carpeta para archivos multimedia (servir los archivos al cliente de manera rapida)
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "public");

app.listen(config.port);
console.log("Server on port:", config.port);

app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.status(200).json("Servidor OK");
});