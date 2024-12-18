<<<<<<< HEAD:admin/src/controller/OrderController.ts
import { Order } from '../model/OrderModel';
import { GetOrder, UpdateOrderStatus, UpdateOrderStatusPay } from '../service/OrderSevice';

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

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updatedOrder = await UpdateOrderStatus(orderId, status);
      return updatedOrder;
    } catch (error) {
      console.error('Failed to update order status', error);
      return error;
    }
  };

  const updateOrderStatusPay = async (orderId: string, status: string) => {
    try {
      const updatedOrder = await UpdateOrderStatusPay(orderId, status);
      return updatedOrder;
    } catch (error) {
      console.error('Failed to update order status', error);
      return error;
    }
  }

  return {
    getOrder, updateOrderStatus, updateOrderStatusPay
  };


};
=======
import { GetBestOrders, GetTotalOrder } from './../service/OrderService';
import { Request, Response } from "express"
import { OrderModel } from "../model/OrderModel"
import { GetOrders, CreateOrder, UpdateOrder, DeleteOrder, GetTotalRevenue, GetTotalUnpaid } from "../service/OrderService"

export const useOrders = () => {
    const getOrders = async (): Promise<OrderModel[]> => {
        try {
            const response = await GetOrders() // Gọi hàm GetOrders và nhận trực tiếp mảng dữ liệu
            return response // Trả về mảng orders trực tiếp
        } catch (error) {
            throw new Error("Failed to fetch orders")
        }
    }

    const createOrder = async (orderData: OrderModel): Promise<OrderModel> => {
        try {
            return await CreateOrder(orderData)
        } catch (error) {
            throw new Error("Failed to create order")
        }
    }

    const updateOrder = async (orderId: string, orderData: OrderModel): Promise<OrderModel> => {
        try {
            return await UpdateOrder(orderId, orderData)
        } catch (error) {
            throw new Error("Failed to update order")
        }
    }

    const deleteOrder = async (orderId: string): Promise<OrderModel> => {
        try {
            return await DeleteOrder(orderId)
        } catch (error) {
            throw new Error("Failed to delete order")
        }
    }

    // Lấy tổng doanh thu
    const getTotalRevenue = async (): Promise<number> => {
        try {
            const revenue = await GetTotalRevenue();  // Gọi hàm GetTotalRevenue từ OrderService
            return revenue;  // Trả về tổng doanh thu
        } catch (error) {
            throw new Error("Failed to fetch total revenue");
        }
    };

    const getTotalOrder = async (): Promise<number> => {
        try {
            const order = await GetTotalOrder();  // Gọi hàm GetTotalRevenue từ OrderService
            return order;  // Trả về tổng doanh thu
        } catch (error) {
            throw new Error("Failed to fetch total order");
        }
    };
    
    const getTotalUnpaid = async (): Promise<number> => {
        try {
            const orderUnpaid = await GetTotalUnpaid();  // Gọi hàm GetTotalRevenue từ OrderService
            return orderUnpaid;  // Trả về tổng doanh thu
        } catch (error) {
            throw new Error("Failed to fetch total unpaid");
        }
    };
    

    const getBestOrders = async (): Promise<OrderModel[]> => {
        try {
            const response = await GetBestOrders() // Gọi hàm GetOrders và nhận trực tiếp mảng dữ liệu
            return response // Trả về mảng orders trực tiếp
        } catch (error) {
            throw new Error("Failed to fetch best orders")
        }
    }
    

    return { getOrders, createOrder, updateOrder, deleteOrder, getTotalRevenue, getTotalOrder, getTotalUnpaid, getBestOrders } // Corrected: Return all functions
}
>>>>>>> e1d2a5e2f902e09d730113492608d135e8fb4d6b:WebSeller/src/controller/OrderController.ts
