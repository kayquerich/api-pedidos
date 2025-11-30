import express from 'express';
import cors from 'cors';
import { createTables } from './database.config.js';
import orderRouter from './routes/order.routes.js';
import authRouter from './routes/auth.routes.js';

const app = express();
const port = 3000;

createTables();

app.use(cors({ // APENAS PARA TESTES, REMOVER E CONFIGURAR CORRETAMENTE EM PRODUÇÃO
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use('/order', orderRouter)
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`servidor rodando na url http://localhost:${port}`);
});

export default app;