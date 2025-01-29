import express from"express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import clientRoute from "./routes/client.route.js"
import freelancerRoute from "./routes/freelancer.route.js"
import gigRoute from "./routes/gig.route.js"
import emailService from './services/emailService.js';

emailService.connect().catch(console.error);

dotenv.config({});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I am backend",
    success: true,
  });
});

app.use("/", clientRoute);
app.use("/", freelancerRoute);
app.use("/", gigRoute);

app.listen(5000, () => {
    console.log("server has started on port 5000");
  });