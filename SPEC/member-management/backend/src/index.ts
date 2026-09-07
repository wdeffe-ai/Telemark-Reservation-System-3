import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
import membersRoutes from "./routes/members";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/members", membersRoutes);

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Members backend listening on ${port}`);
});
