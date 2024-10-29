import React, { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: ReactNode;  // Kỳ vọng nhận các phần tử con React để render
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Trạng thái xác thực
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('usertoken');
        if (!token) {
            navigate('/login');  // Chuyển hướng đến trang đăng nhập nếu không có token
        } else {
            setIsAuthenticated(true);  // Cập nhật trạng thái xác thực nếu có token
        }
    }, [navigate]);

    // Chỉ render children nếu người dùng đã được xác thực
    return isAuthenticated ? <>{children}</> : null;
};

export default PrivateRoute;

