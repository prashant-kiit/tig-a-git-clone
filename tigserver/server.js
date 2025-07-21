// app.js
import express from 'express';
import dotenv from 'dotenv';
import { loginContoller, repoContoller } from './controller.js';
import { authorize } from './middleware.js';

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());

app.post('/login', loginContoller);
app.use(authorize);
app.post('/repo', repoContoller);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


