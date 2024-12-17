// import { Order } from "../service/ProducService"
import { GetOrder, UpdateOrderStatus, UpdateOrderStatusPay } from "../service/OrderService"

export const orderController = () => {
    const getOrder = async () => {
        try {
            const getOrders = await GetOrder()
            return getOrders
        } catch (error) {
            console.error("Failed to get order", error)
            return error
        }
    }

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            const updatedOrder = await UpdateOrderStatus(orderId, status)
            return updatedOrder
        } catch (error) {
            console.error("Failed to update order status", error)
            return error
        }
    }

    const updateOrderStatusPay = async (orderId: string, status: string) => {
        try {
            const updatedOrder = await UpdateOrderStatusPay(orderId, status)
            return updatedOrder
        } catch (error) {
            console.error("Failed to update order status", error)
            return error
        }
    }

    return {
        getOrder,
        updateOrderStatus,
        updateOrderStatusPay,
    }
}
