import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';  // Import the PrivateRoute component
import Scrumboard from '../pages/Scrumboard';
import Analytics from '../pages/Analytics';
import Contacts from '../pages/Contacts';
import Tables from '../pages/Tables';
import ContactUsBoxed from '../pages/Pages/ContactUsBoxed';
import ContactUsCover from '../pages/Pages/ContactUsCover';
import Faq from '../pages/Pages/Faq';
import KnowledgeBase from '../pages/Pages/KnowledgeBase';
import Maintenence from '../pages/Pages/Maintenence';
import Accordians from '../pages/Components/Accordians';
import { Card, Timeline } from '@mantine/core';
import Cards from '../pages/Components/Cards';
import { Carousel, ListGroup, Tabs } from 'react-bootstrap';
import Counter from '../pages/Components/Counter';
import LightBox from '../pages/Components/LightBox';
import PricingTable from '../pages/Components/PricingTable';
import SweetAlert from '../pages/Components/SweetAlert';

const Index = lazy(() => import('../pages/Analytics'));
const Index2 = lazy(() => import('../pages/Analytics2'));
const ProductManagent = lazy(() => import('../pages/ProductManagent'));
const CategoriesManagent = lazy(() => import('../pages/CategoriesManagement'));
const LoginBoxed = lazy(() => import('../pages/LoginBoxed'));
const Error = lazy(() => import('../components/Error'));
const ProductCreateNew = lazy(() => import('../pages/ProductCreatNew'));
const ProductUpdate = lazy(() => import('../pages/ProductEdit'));
const CategoriesUpdate = lazy(() => import('../pages/CategoriesNew'));
const CategoryEdit = lazy(() => import('../pages/CategoriesEdit'));
const Usermanagent = lazy(() => import('../pages/UsersManagent'));
const BillsManagement = lazy(() => import('../pages/OrderManagement'));
const OrdersManagement = lazy(() => import('../pages/OrderManagement'));
const PaymentPage = lazy(() => import('../pages/Payment'));
const PaymentCallbackPage = lazy(() => import('../pages/PaymentCallbackPage'));
const Time = lazy(() => import('../pages/Components/Timeline'));

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
    ...(userRole !== "3" ? [  // Nếu userRole không phải là "3" (seller)
        {
            path: '/usermanagent',
            element: (
                <PrivateRoute>
                    <Usermanagent />
                </PrivateRoute>
            ),
        },
        {
            path: '/advertising-management',
            element: (
                <PrivateRoute>
                    <Scrumboard />
                </PrivateRoute>
            ),
        },
        {
            path: '/analytics',
            element: (
                <PrivateRoute>
                    <Index2 />
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
        path: '/categoriesmanagent/categories-update',
        element: (
            <PrivateRoute>
                <CategoriesUpdate />
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
                <ProductManagent/>
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
    
    {
        path: '/order-management',
        element: (
            <PrivateRoute>
                <OrdersManagement />
            </PrivateRoute>
        ),
    },
    
    
   
];

export { routes };
