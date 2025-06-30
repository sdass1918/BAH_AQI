"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
//var cors = require('cors')
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
// app.use(cors);
const api = process.env.TOKEN;
const fetchAQIData = (city) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.TOKEN;
    const response = yield fetch(`https://api.waqi.info/feed/${city}/?token=${apiKey}`);
    if (!response.ok) {
        throw new Error("Failed to fetch data from AQICN API");
    }
    const data = yield response.json();
    if (data.status !== "ok") {
        throw new Error("City not found in AQICN data");
    }
    return data.data;
});
app.post("/aqi", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const city = req.body.city;
    try {
        const data = yield fetchAQIData(city);
        res.json(data.aqi);
    }
    catch (error) {
        console.error(error);
        if (error.message.includes("City not found")) {
            res.status(404).send("City not found");
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    }
}));
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.listen(3000);
