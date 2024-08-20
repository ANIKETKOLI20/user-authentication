import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { connectTomongoDB } from './db/connectTomongoDB.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json()); // allows us to parse JSON data from the request body
app.use(cookieParser()); // allows us to parse cookies from the request body
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
    });
}


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectTomongoDB();
});
