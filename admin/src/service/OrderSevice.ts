import { Order } from '../model/OrderModel';
const API_URL = 'http://localhost:7777';

export const GetOrder = async (): Promise<Order[]> => {
    try {
        const response = await fetch(`${API_URL}/orders/getOrder`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();
        console.log("Fetched Orders:", responseData);

        if (!response.ok) {
            throw new Error(responseData?.message || "Failed to fetch orders");
        }

        return responseData as Order[];
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const UpdateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
    try {
        const response = await fetch(`${API_URL}/orders/updateOrderStatus`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId, status }),
        });

        const responseData = await response.json();
        console.log("Updated Order:", responseData);

        if (!response.ok) {
            throw new Error(responseData?.message || "Failed to update order status");
        }

        return responseData as Order;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};
  
  

