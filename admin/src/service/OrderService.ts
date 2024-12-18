import { OrderModel } from '../model/OrderModel';

const API_URL = 'http://localhost:7777'; // Cập nhật URL chính xác

// Lấy danh sách đơn hàng
export const GetOrders = async (): Promise<OrderModel[]> => {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        
        console.log("Data fetched:", data);  // Log dữ liệu nhận được

        if (!response.ok) {
            throw new Error(data?.message || 'Failed to fetch orders');
        }

        // Kiểm tra xem dữ liệu có phải là đối tượng với thuộc tính `data` hay không
        if (data && data.data && Array.isArray(data.data)) {
            return data.data;  // Trả về mảng nếu có thuộc tính `data`
        } else if (Array.isArray(data)) {
            // Nếu không có thuộc tính `data`, kiểm tra xem data có phải là mảng trực tiếp
            return data; 
        } else {
            throw new Error('Dữ liệu trả về không phải là mảng');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};




// Tạo đơn hàng mới
export const CreateOrder = async (order: OrderModel): Promise<OrderModel> => {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            body: JSON.stringify(order),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data: any = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create order');
        }

        return data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Cập nhật đơn hàng theo ID
export const UpdateOrder = async (orderId: string, order: OrderModel): Promise<OrderModel> => {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/update`, {
            method: "PUT",
            body: JSON.stringify(order),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data: any = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update order');
        }

        return data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};

// Xóa đơn hàng theo ID
export const DeleteOrder = async (orderId: string): Promise<OrderModel> => {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/delete`, {
            
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data: any = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete order');
        }

        return data;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
};

// Lấy tổng doanh thu
// Lấy tổng doanh thu
export const GetTotalRevenue = async (): Promise<number> => {
    try {
        const response = await fetch(`${API_URL}/orders/totalRevenue`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        console.log("Total revenue fetched:", data);  // Log dữ liệu nhận được

        if (!response.ok) {
            throw new Error(data?.message || 'Failed to fetch total revenue');
        }

        // Kiểm tra nếu dữ liệu trả về có thuộc tính `data`
        if (data && data.status && data.data !== undefined) {
            return data.data;  // Trả về giá trị doanh thu
        } else {
            throw new Error('Dữ liệu trả về không đúng định dạng');
        }
    } catch (error) {
        console.error('Error fetching total revenue:', error);
        throw error;
    }
};

export const GetTotalOrder = async (): Promise<number> => {
    try {
        const response = await fetch(`${API_URL}/orders/total`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        console.log("Total order fetched:", data);  // Log dữ liệu nhận được

        if (!response.ok) {
            throw new Error(data?.message || 'Failed to fetch total order');
        }

        // Kiểm tra nếu dữ liệu trả về có thuộc tính `data`
        if (data && data.status && data.data !== undefined) {
            return data.data;  // Trả về giá trị doanh thu
        } else {
            throw new Error('Dữ liệu trả về không đúng định dạng');
        }
    } catch (error) {
        console.error('Error fetching total order:', error);
        throw error;
    }
};

export const GetTotalUnpaid = async (): Promise<number> => {
    try {
        const response = await fetch(`${API_URL}/orders/total_unpaid`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        console.log("Total unpaid fetched:", data);  // Log dữ liệu nhận được

        if (!response.ok) {
            throw new Error(data?.message || 'Failed to fetch total unpaid');
        }

        // Kiểm tra nếu dữ liệu trả về có thuộc tính `data`
        if (data && data.status && data.data !== undefined) {
            return data.data;  // Trả về giá trị doanh thu
        } else {
            throw new Error('Dữ liệu trả về không đúng định dạng');
        }
    } catch (error) {
        console.error('Error fetching total unpaid:', error);
        throw error;
    }
};

// Lấy danh sách đơn hàng
export const GetBestOrders = async (): Promise<OrderModel[]> => {
    try {
        const response = await fetch(`${API_URL}/orders/topSelling`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        
        console.log("Data best orders fetched:", data);  // Log dữ liệu nhận được

        if (!response.ok) {
            throw new Error(data?.message || 'Failed to fetch best orders');
        }

        // Kiểm tra xem dữ liệu có phải là đối tượng với thuộc tính `data` hay không
        if (data && data.data && Array.isArray(data.data)) {
            return data.data;  // Trả về mảng nếu có thuộc tính `data`
        } else if (Array.isArray(data)) {
            // Nếu không có thuộc tính `data`, kiểm tra xem data có phải là mảng trực tiếp
            return data; 
        } else {
            throw new Error('Dữ liệu trả về không phải là mảng');
        }
    } catch (error) {
        console.error('Error fetching best orders:', error);
        throw error;
    }
};
