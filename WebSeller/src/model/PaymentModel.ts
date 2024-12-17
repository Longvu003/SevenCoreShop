// Cập nhật PaymentModel để bao gồm trường orderInfo
export interface PaymentModel {
    _id: string;
    userId: string;
    orderId: string;
    amount: number;
    status: 'Pending' | 'Completed' | 'Failed';
    paymentMethod: 'Momo'; // Hoặc có thể là các phương thức khác
    paymentCode: string;
    orderInfo: string;  // Thêm trường orderInfo vào đây
    createdAt: string | Date;
  }
  