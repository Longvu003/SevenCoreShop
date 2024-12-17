import { useState } from 'react';
import Swal from 'sweetalert2';

const Payment = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderAmount, setOrderAmount] = useState(500000); // Giả định số tiền thanh toán

    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value);
    };
    

    const handleConfirmPayment = () => {
        if (!paymentMethod) {
            Swal.fire('Lỗi', 'Vui lòng chọn phương thức thanh toán!', 'error');
            return;
        }
        
        // Gửi yêu cầu thanh toán tới API (giả định)
        Swal.fire({
            title: 'Thanh toán thành công!',
            text: `Bạn đã thanh toán đơn hàng trị giá ${orderAmount.toLocaleString()} VND qua ${paymentMethod}.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    };

    return (
        <div className="payment-page container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Trang Thanh Toán</h2>

            {/* Thông tin đơn hàng */}
            <div className="order-info bg-gray-100 p-4 rounded mb-4">
                <h3 className="text-lg font-semibold">Thông Tin Đơn Hàng</h3>
                <p className="mt-2">Số tiền: <span className="font-bold">{orderAmount.toLocaleString()} VND</span></p>
            </div>

            {/* Chọn phương thức thanh toán */}
            <div className="payment-method bg-gray-100 p-4 rounded mb-4">
                <h3 className="text-lg font-semibold">Chọn Phương Thức Thanh Toán</h3>
                <div className="mt-2">
                    <label className="block">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Momo"
                            checked={paymentMethod === 'Momo'}
                            onChange={handlePaymentMethodChange}
                            className="mr-2"
                        />
                        Momo
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="CreditCard"
                            checked={paymentMethod === 'CreditCard'}
                            onChange={handlePaymentMethodChange}
                            className="mr-2"
                        />
                        Thẻ Tín Dụng
                    </label>
                    <label className="block">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Cash"
                            checked={paymentMethod === 'Cash'}
                            onChange={handlePaymentMethodChange}
                            className="mr-2"
                        />
                        Thanh Toán Khi Nhận Hàng
                    </label>
                </div>
            </div>

            {/* Nút xác nhận thanh toán */}
            <button
                onClick={handleConfirmPayment}
                className="btn btn-primary w-full mt-4 py-2 bg-blue-500 text-white rounded"
            >
                Xác Nhận Thanh Toán
            </button>
        </div>
    );
};

export default Payment;
