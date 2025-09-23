import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import modelRoute from "./routes/modelRoutes";

dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

app.use("/api/model", modelRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));