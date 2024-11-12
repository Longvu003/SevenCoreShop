import { useState } from 'react';
import { OrderModel } from '../model/OrderModel';
import { 
  createOrder, 
  getOrderById, 
  updateOrder, 
  deleteOrder, 
  getAllOrders 
} from '../service/OrderService';

export const useOrderController = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);

  // Tạo đơn hàng mới
  const createNewOrder = async (order: OrderModel) => {
    try {
      const result = await createOrder(order);
      return result;
    } catch (error) {
      console.error('Failed to create order', error);
      return error;
    }
  };

  // Lấy tất cả đơn hàng
  const fetchAllOrders = async () => {
    try {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      return allOrders;
    } catch (error) {
      console.error('Failed to fetch orders', error);
      return error;
    }
  };

  // Lấy đơn hàng theo ID
  const fetchOrderById = async (id: string) => {
    try {
      const order = await getOrderById(id);
      return order;
    } catch (error) {
      console.error('Failed to fetch order by id', error);
      return error;
    }
  };

  // Cập nhật đơn hàng theo ID
  const updateOrderById = async (id: string, updatedFields: Partial<OrderModel>) => {
    try {
      const updatedOrder = await updateOrder(id, updatedFields);
      return updatedOrder;
    } catch (error) {
      console.error('Failed to update order', error);
      return error;
    }
  };

  // Đánh dấu đơn hàng là đã thanh toán
  // Trong useOrderController
// Đánh dấu đơn hàng là đã thanh toán
const markOrderAsPaid = async (id: string): Promise<{ status: boolean, updatedOrder?: OrderModel }> => {
  try {
    const updatedOrder = await updateOrder(id, { Status: 'Paid' });
    return { status: true, updatedOrder }; // Trả về đơn hàng đã cập nhật cùng với status
  } catch (error) {
    console.error('Failed to mark order as paid', error);
    return { status: false };
  }
};



  // Xóa đơn hàng theo ID
  const deleteOrderById = async (id: string) => {
    try {
      const deletedOrder = await deleteOrder(id);
      return deletedOrder;
    } catch (error) {
      console.error('Failed to delete order', error);
      return error;
    }
  };

  return {
    createNewOrder,
    fetchAllOrders,
    fetchOrderById,
    updateOrderById,
    deleteOrderById,
    markOrderAsPaid, // Bổ sung hàm markOrderAsPaid vào controller
    orders,
  };
};
