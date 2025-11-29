import express from 'express';
import { createTables } from './database.config.js';
import { createOrder } from './controllers/Order.js';

const app = express();
const port = 3000;

createTables();

app.use(express.json());

app.get('/', (req, res) => {    
    res.status(200).send('Primeiro Teste!');
});

app.post('/orders', async (req, res) => {
    try {
        const orderData = req.body;
        const createdOrder = await createOrder(orderData);
        res.status(201).json({ mensagem : 'Pedido criado com sucesso', pedido : createdOrder });
    } catch (error) {
        res.status(500).json({ mensagem : 'Erro ao criar o pedido', erro : error.message });
    }
});

app.listen(port, () => {
    console.log(`servidor rodando na url http://localhost:${port}`);
});

export default app;