import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import modelRoute from "./routes/modelRoutes";
import { createSignalingServer } from "./webrtcServer";

dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

app.use("/api/model", modelRoute);

const PORT = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

createSignalingServer(server);

server.listen(PORT, () => console.log(`Server + signaling running on port ${PORT}`));