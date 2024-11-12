import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const status = searchParams.get('resultCode');
        if (status === '0') {
            alert('Thanh toán thành công!');
            // Cập nhật trạng thái đơn hàng ở đây
        } else {
            alert('Thanh toán thất bại.');
        }
    }, [searchParams]);

    return (
        <div>
            <h1>Kết quả Thanh Toán</h1>
        </div>
    );
};

export default PaymentCallbackPage;
