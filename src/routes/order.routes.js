import { Router } from "express";
import { createOrder, getOrder } from "../controllers/Order.js";

const orderRouter = Router();

orderRouter.post('/', async (req, res) => {
    try {
        const orderData = req.body;
        const createdOrder = await createOrder(orderData);
        res.status(201).json({ mensagem : 'Pedido criado com sucesso', pedido : createdOrder });
    } catch (error) {
        res.status(500).json({ mensagem : 'Erro ao criar o pedido', erro : error.message });
    }
});

orderRouter.get('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await getOrder(orderId);
        res.status(200).json(order);
    } catch (error) {
        if (error.message === 'Pedido não encontrado') {
            return res.status(404).json({ mensagem : 'Pedido não encontrado' });
        }
        res.status(500).json({ mensagem : 'Erro ao obter o pedido', erro : error.message });
    }
});

export default orderRouter;