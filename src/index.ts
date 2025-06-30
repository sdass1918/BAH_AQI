import express, { Request, Response } from "express";
import dotenv from "dotenv";
//var cors = require('cors')

const app = express();
dotenv.config();
app.use(express.json());
// app.use(cors);

const api = process.env.TOKEN;

const fetchAQIData = async (city: string): Promise<any> => {
    const apiKey = process.env.TOKEN;
    const response = await fetch(`https://api.waqi.info/feed/${city}/?token=${apiKey}`);
    if (!response.ok) {
        throw new Error("Failed to fetch data from AQICN API");
    }
    const data = await response.json();
    if (data.status !== "ok") {
        throw new Error("City not found in AQICN data");
    }
    return data.data;
};


app.post("/aqi", async (req: Request, res: Response) => {
    const city = req.body.city;
    try {
        const data = await fetchAQIData(city);
        res.json(data.aqi);
    } catch (error) {
        console.error(error);
        if ((error as Error).message.includes("City not found")) {
            res.status(404).send("City not found");
        } else {
            res.status(500).send("Internal Server Error");
        }
    }
});




app.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
})

app.listen(3000);