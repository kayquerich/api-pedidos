import { Router } from "express";
import { createOrder, getOrder, getAllOrders, updateOrder, deleteOrder } from "../controllers/Order.js";

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

orderRouter.get('/list', async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ mensagem : 'Erro ao obter todos os pedidos', erro : error.message });
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

orderRouter.put('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const orderData = req.body;
        const updatedOrder = await updateOrder(orderId, orderData);
        res.status(200).json({ mensagem : 'Pedido atualizado com sucesso', pedido : updatedOrder });
    } catch (error) {
        if (error.message === 'Pedido não encontrado para atualização') {
            return res.status(404).json({ mensagem : 'Pedido não encontrado para atualização' });
        }
        res.status(500).json({ mensagem : 'Erro ao atualizar o pedido', erro : error.message });
    }
});

orderRouter.delete('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        await deleteOrder(orderId);
        res.status(200).json({ mensagem : 'Pedido excluído com sucesso' });
    } catch (error) {
        if (error.message === 'Pedido não encontrado para exclusão') {
            return res.status(404).json({ mensagem : 'Pedido não encontrado para exclusão' });
        }
        res.status(500).json({ mensagem : 'Erro ao excluir o pedido', erro : error.message });
    }
});

export default orderRouter;