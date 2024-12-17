import { useState } from 'react';
import { PaymentModel } from '../model/PaymentModel';
import { createPaymentQR } from '../service/paymentService';  // Giả sử bạn chỉ cần gọi hàm này

export const usePaymentController = () => {
  const [payments, setPayments] = useState<PaymentModel[]>([]);

  // Tạo thanh toán mới (createPaymentQR)
  const createNewPayment = async (payment: PaymentModel) => {
    try {
      // Chuyển đối tượng payment thành đối tượng có đủ các trường cần thiết
      const paymentData = {
        userId: payment.userId,
        orderId: payment.orderId,
        amount: payment.amount,
        orderInfo: payment.orderInfo,  // Chắc chắn rằng orderInfo có trong payment
        paymentCode: payment.paymentCode
      };

      // Gọi dịch vụ tạo thanh toán
      const result = await createPaymentQR(paymentData);  
      return result;
    } catch (error) {
      console.error('Failed to create payment', error);
      return error;
    }
  };

  return {
    createNewPayment,  // Chỉ trả về hàm createNewPayment
    payments,
  };
};
