import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { generateSwagger } from './swagger';

import artistRouter from './routers/artistRouter';
import musicsRouter from './routers/musicsRouter';

let app = express();

const allowedOrigins = [
    'http://127.0.0.1:300',
    'https://127.0.0.1:300',
    'https://spotify.phaedra.ir'
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/artist', artistRouter);
app.use('/music', musicsRouter);

(async () => {
    await generateSwagger();
    const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger-output.json'), 'utf-8'));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
})()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});