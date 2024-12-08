import { Order } from '../model/OrderModel';
import { GetOrder } from '../service/OrderSevice';

export const orderController = () => {

    const getOrder = async () => {
        try {
            const getOrders = await GetOrder();
            return getOrders;
        } catch (error) {
            console.error('Failed to get order', error);
            return error
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
          const updatedOrder = await UpdateOrderStatus(orderId, status);
          return updatedOrder;
        } catch (error) {
          console.error('Failed to update order status', error);
          return error;
        }
      };



    return {
        getOrder, updateOrderStatus
    };



      
};