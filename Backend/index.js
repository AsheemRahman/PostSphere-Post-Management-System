import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./Routes/route.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', router)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});