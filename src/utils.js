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