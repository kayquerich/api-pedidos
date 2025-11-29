import { openDB } from "../database.config.js";
import { requestOrderMapping, updateOrderMapping } from "../utils.js";

export async function createOrder(orderData) {
    try {
        const db = await openDB();
        const order = requestOrderMapping(orderData);

        const createdOrder = await db.run(
            `INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)`,
            [order.orderId, order.value, order.creationDate]
        ); // cria o pedido inicialmente

        for (const item of order.items) {
            await db.run(
                `INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`,
                [order.orderId, item.productId, item.quantity, item.price]
            );
        } // pós a criação do pedido, insere os itens relacionados

        return { // retorna o pedido criado
            numeroPedido: order.orderId,
            valorTotal: order.value,
            dataCriacao: order.creationDate,
            items: order.items?.map(item => ({
                idItem: `${item.productId}`,
                quantidadeItem: item.quantity,
                valorItem: item.price
            })) || []
        };

    } catch (error) {
        console.error("Erro ao criar o pedido:", error);
        throw new Error(error.message);
    }
};

export async function getOrder(orderId) {
    try {
        const db = await openDB();

        const order = await db.get(
            `SELECT * FROM orders WHERE orderId = ?`,
            [orderId]
        ); // busca o pedido pelo ID

        if (!order) {
            throw new Error('Pedido não encontrado');
        }

        const items = await db.all(
            `SELECT * FROM items WHERE orderId = ?`,
            [orderId]
        ); // busca os itens relacionados ao pedido

        return { // retorna o pedido encontrado
            numeroPedido: order.orderId,
            valorTotal: order.value,
            dataCriacao: order.creationDate,
            items: items.map(item => ({
                idItem: `${item.productId}`,
                quantidadeItem: item.quantity,
                valorItem: item.price
            }))
        };

    } catch (error) {
        console.error("Erro ao obter o pedido:", error);
        throw new Error(error.message);
    }
};

export async function getAllOrders() {
    try {
        const db = await openDB();
        
        const orders = await db.all(
            `SELECT * FROM orders`
        ); // busca todos os pedidos
        
        const result = [];
        
        for (const order of orders) {
            const items = await db.all(
                `SELECT * FROM items WHERE orderId = ?`,
                [order.orderId]
            ); // busca os itens relacionados ao pedido

            result.push({ // adiciona o pedido encontrado ao resultado
                numeroPedido: order.orderId,
                valorTotal: order.value,
                dataCriacao: order.creationDate,
                items: items.map(item => ({
                    idItem: `${item.productId}`,
                    quantidadeItem: item.quantity,
                    valorItem: item.price
                }))
            });

        }
        
        return result;
    } catch (error) {
        console.error("Erro ao obter todos os pedidos:", error);
        throw new Error(error.message);
    }
};

export async function updateOrder(orderId, orderData) {
    try {
        const db = await openDB();
        const order = await updateOrderMapping(orderData, orderId);

        await db.run(
            `UPDATE orders SET value = ?, creationDate = ? WHERE orderId = ?`,
            [order.value, order.creationDate, orderId]
        ); // atualiza os dados do pedido

        await db.run(
            `DELETE FROM items WHERE orderId = ?`,
            [orderId]
        ); // remove os itens antigos relacionados ao pedido

        for (const item of order.items) {
            await db.run(
                `INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderId, item.productId, item.quantity, item.price]
            );
        } // insere os novos itens relacionados ao pedido

        const updatedOrder = await db.get(
            `SELECT * FROM orders WHERE orderId = ?`,
            [orderId]
        ); // busca o pedido atualizado

        const updatedItems = await db.all(
            `SELECT * FROM items WHERE orderId = ?`,
            [orderId]
        ); // busca os itens relacionados ao pedido atualizado

        return { // retorna o pedido atualizado
            numeroPedido: updatedOrder.orderId,
            valorTotal: updatedOrder.value,
            dataCriacao: updatedOrder.creationDate,
            items: updatedItems.map(item => ({
                idItem: `${item.productId}`,
                quantidadeItem: item.quantity,
                valorItem: item.price
            }))
        };
        
    } catch (error) {
        console.error("Erro ao atualizar o pedido:", error);
        throw new Error(error.message);
    }
}