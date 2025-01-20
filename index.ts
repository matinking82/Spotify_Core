import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { generateSwagger } from './swagger';


let app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});


(async () => {
    await generateSwagger();
    const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger-output.json'), 'utf-8'));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
})()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});