import { openDB } from "../database.config.js";
import { requestOrderMapping } from "../utils.js";

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
                idItem: item.productId,
                quantidadeItem: item.quantity,
                valorItem: item.price
            })) || []
        };

    } catch (error) {
        console.error("Erro ao criar o pedido:", error);
        throw new Error(error.message);
    }
};