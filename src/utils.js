import { openDB } from "./database.config.js";

export function requestOrderMapping(order) {

    // função para mapear e validar os dados do pedido recebidos na requisição

    if (!order || !order.numeroPedido || !order.valorTotal || !order.dataCriacao || !Array.isArray(order.items)) {
        throw new Error("Dados do pedido inválidos");
    }

    for (const item of order.items) {
        if (!item.idItem || !item.quantidadeItem || !item.valorItem) {
            throw new Error("Dados do item inválidos");
        }
    }

    return {
        orderId: order.numeroPedido,
        value: order.valorTotal,
        creationDate: order.dataCriacao, 
        items : order.items.map(item => ({
            productId: parseInt(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };
}

export async function updateOrderMapping(order, orderId) {
    
    /* essa função serve para garantir que o usuario possa escolher quais campos atualizar do pedido, podendo omitir algum campo do body da requisição sem causar nenhum problema */
    
    try {
        const db = await openDB();
        const existingOrder = await db.get(
            `SELECT * FROM orders WHERE orderId = ?`,
            [orderId]
        ); // busca o pedido existente pelo ID

        if (!existingOrder) {
            throw new Error("Pedido não encontrado para atualização");
        }

        let items = [];
        if (order.items) {

            if (!Array.isArray(order.items)) {
                throw new Error("Itens do pedido inválidos para atualização");
            }

            if (order.items.some(item => !item.idItem || !item.quantidadeItem || !item.valorItem)) {
                throw new Error("Dados de algum item inválidos para atualização");
            }

            items = order.items.map(item => ({
                productId: parseInt(item.idItem),
                quantity: item.quantidadeItem,
                price: item.valorItem
            })); // mapeia os itens fornecidos para o formato esperado se houverem
        }

        const existingItems = await db.all(
            `SELECT * FROM items WHERE orderId = ?`,
            [orderId]
        ); // busca os itens existentes relacionados ao pedido

        existingItems.forEach(async (item) => {
            if (items.findIndex(i => i.productId === item.productId) === -1) {
                items.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                });
            }
        }); // mantém os itens existentes que não foram atualizados

        return {
            orderId: orderId,
            value: order.valorTotal || existingOrder.value,
            creationDate: order.dataCriacao || existingOrder.creationDate,
            items: items
        }; 

    } catch (error) {
        throw new Error(error.message);
    }
}