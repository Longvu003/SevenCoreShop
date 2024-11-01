import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';  // Import the PrivateRoute component

const Index = lazy(() => import('../pages/Analytics'));
const ProductManagent = lazy(() => import('../pages/ProductManagent'));
const CategoriesManagent = lazy(() => import('../pages/CategoriesManagement'));
const LoginBoxed = lazy(() => import('../pages/LoginBoxed'));
const Error = lazy(() => import('../components/Error'));
const ProductCreateNew = lazy(() => import('../pages/ProductCreatNew'));
const ProductUpdate = lazy(() => import('../pages/ProductEdit'));
const CategoriesUpdate = lazy(() => import('../pages/CategoriesNew'));
const CategoryEdit = lazy(() => import('../pages/CategoriesEdit'));
const Usermanagent = lazy(() => import('../pages/UsersManagent'));

// Lấy vai trò người dùng từ localStorage
const userRole = localStorage.getItem('userRole'); // Giả sử đã lưu vai trò khi đăng nhập
console.log("User Role: ", userRole); // Kiểm tra giá trị vai trò

const routes = [
    // dashboard (protected)
    {
        path: '/',
        element: (
            <PrivateRoute>
                <Index />
            </PrivateRoute>
        ),
    },
    // Chỉ thêm route cho Usermanagent nếu vai trò không phải là seller
    ...(userRole !== "3" ? [  // Nếu userRole không phải là "3" (seller)
        {
            path: '/usermanagent',
            element: (
                <PrivateRoute>
                    <Usermanagent />
                </PrivateRoute>
            ),
        },
    ] : []), 
    {
        path: '/categoriesmanagent',
        element: (
            <PrivateRoute>
                <CategoriesManagent />
            </PrivateRoute>
        ),
    },
    {
        path: '/categoriesmanagent/categories-edit',
        element: (
            <PrivateRoute>
                <CategoryEdit />
            </PrivateRoute>
        ),
    },
    {
        path: '/product/product-managent',
        element: (
            <PrivateRoute>
                <ProductManagent />
            </PrivateRoute>
        ),
    },
    {
        path: '/product/product-createnew',
        element: (
            <PrivateRoute>
                <ProductCreateNew />
            </PrivateRoute>
        ),
    },
    {
        path: '/product/product-update',
        element: (
            <PrivateRoute>
                <ProductUpdate />
            </PrivateRoute>
        ),
    },
    // Login page (public)
    {
        path: '/login',
        element: <LoginBoxed />,
        layout: 'blank',
    },
    // Error page (public)
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
