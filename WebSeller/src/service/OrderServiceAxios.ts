import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:7777/orders';  // WebAPI chạy trên port 7777

// Lấy danh sách tất cả đơn hàng
export const fetchOrders = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error fetching orders');
        } else {
            throw new Error('An unknown error occurred while fetching orders');
        }
    }
};

// Lấy thông tin đơn hàng theo ID
export const fetchOrderById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error fetching order by ID');
        } else {
            throw new Error('An unknown error occurred while fetching order by ID');
        }
    }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData: any) => {
    try {
        const response = await axios.post(API_URL, orderData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error creating order');
        } else {
            throw new Error('An unknown error occurred while creating order');
        }
    }
};

// Cập nhật thông tin đơn hàng
export const updateOrder = async (id: string, orderData: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, orderData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error updating order');
        } else {
            throw new Error('An unknown error occurred while updating order');
        }
    }
};

// Xóa đơn hàng
export const deleteOrder = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error deleting order');
        } else {
            throw new Error('An unknown error occurred while deleting order');
        }
    }
};

// Lấy tổng số đơn hàng
export const fetchTotalOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/total`);
        return response.data.totalOrders;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error fetching total orders');
        } else {
            throw new Error('An unknown error occurred while fetching total orders');
        }
    }
};

// Lấy đơn hàng theo trạng thái
export const fetchOrdersByStatus = async (status: string) => {
    try {
        const response = await axios.get(`${API_URL}/status`, { params: { status } });
        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error fetching orders by status');
        } else {
            throw new Error('An unknown error occurred while fetching orders by status');
        }
    }
};

// Lấy tổng doanh thu
export const fetchTotalRevenue = async () => {
    try {
        const response = await axios.get(`${API_URL}/totalRevenue`);
        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error fetching total revenue');
        } else {
            throw new Error('An unknown error occurred while fetching total revenue');
        }
    }
};

// Lấy các sản phẩm bán chạy
export const fetchTopSellingProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/topSelling`);
        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error fetching top-selling products');
        } else {
            throw new Error('An unknown error occurred while fetching top-selling products');
        }
    }
};
