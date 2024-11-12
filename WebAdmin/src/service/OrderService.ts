import { OrderModel } from '../model/OrderModel';
const API_URL = 'http://localhost:7777'; // Cập nhật URL chính xác
// Lấy tất cả đơn hàng
export const getAllOrders = async (): Promise<OrderModel[]> => {
  const response = await fetch(`${API_URL}/orders/`, { 
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: any = await response.json();

  if (!response.ok) {
    return data
  }

  return data; // Trả về đối tượng 
};

// service/OrderService.ts
// export const getAllOrders = async (): Promise<OrderModel[]> => {
//   const response = await fetch('${API_URL}/orders/'); // Đường dẫn API của bạn
//   if (!response.ok) {
//       throw new Error('Network response was not ok');
//   }
//   const data = await response.json();
//   return data; // Giả định rằng data đã là mảng OrderModel[]
// };




// Tạo đơn hàng mới
export const createOrder = async (order: OrderModel): Promise<OrderModel> => {
  const response = await fetch(`${API_URL}/orders/create`, {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: any = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create order');
  }

  return data; // Trả về đơn hàng mới đã tạo
};

// Lấy đơn hàng theo ID
export const getOrderById = async (id: string): Promise<OrderModel> => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: any = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch order by ID');
  }

  return data; // Trả về đơn hàng đã lấy
};

// Cập nhật đơn hàng
export const updateOrder = async (id: string, order: Partial<OrderModel>): Promise<OrderModel> => {
  const response = await fetch(`${API_URL}/orders/${id}/update`, {
    method: 'PUT',
    body: JSON.stringify(order),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: any = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update order');
  }

  return data; // Trả về đơn hàng đã cập nhật
};

// Xóa đơn hàng
export const deleteOrder = async (id: string): Promise<string> => {
  const response = await fetch(`${API_URL}/orders/${id}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: any = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete order');
  }

  return data.message || 'Order deleted successfully'; // Trả về thông báo xóa đơn hàng thành công
};
