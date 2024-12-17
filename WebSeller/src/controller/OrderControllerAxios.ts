import axios from "axios";

const API_BASE_URL = "http://localhost:7777/orders";

export const fetchAllOrders = async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data; // Trả về danh sách đơn hàng
};

export const fetchOrderById = async (orderId: string) => {
    const response = await axios.get(`${API_BASE_URL}/${orderId}`);
    return response.data; // Trả về chi tiết đơn hàng
};

export const deleteOrderById = async (orderId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/${orderId}`);
    return response.data; // Trả về kết quả xóa
};

export const markOrderAsPaid = async (orderId: string) => {
    const response = await axios.put(`${API_BASE_URL}/${orderId}/mark-as-paid`);
    return response.data; // Trả về trạng thái sau khi cập nhật
};
