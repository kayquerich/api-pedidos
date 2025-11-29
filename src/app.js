import express from 'express';
import { createTables } from './database.config.js';
import { createOrder } from './controllers/Order.js';
import orderRouter from './routes/order.routes.js';

const app = express();
const port = 3000;

createTables();

app.use(express.json());

app.use('/order', orderRouter);

app.get('/', (req, res) => {    
    res.status(200).send('Primeiro Teste!');
});


app.listen(port, () => {
    console.log(`servidor rodando na url http://localhost:${port}`);
});

export default app;