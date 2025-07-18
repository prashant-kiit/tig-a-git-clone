// app.js
import express from 'express';
import dotenv from 'dotenv';
import { loginContoller } from './controller.js';

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());

app.post('/login', loginContoller);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


