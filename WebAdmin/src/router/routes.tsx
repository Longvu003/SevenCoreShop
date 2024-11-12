import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';  // Import the PrivateRoute component
import Scrumboard from '../pages/Scrumboard';
import Analytics from '../pages/Analytics';
import Contacts from '../pages/Contacts';
import Tables from '../pages/Tables';

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
const BillsManagement = lazy(() => import('../pages/OrderManagement'));
const OrdersManagement = lazy(() => import('../pages/OrderManagement'));
const PaymentPage = lazy(() => import('../pages/Payment'));
const PaymentCallbackPage = lazy(() => import('../pages/PaymentCallbackPage'));


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
    // user (protected)
    {
        path: '/usermanagent',
        element: (
            <PrivateRoute>
                <Usermanagent />
            </PrivateRoute>
        ),
    },
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
        path: '/advertising-management',
        element: (
            <PrivateRoute>
                <Scrumboard />
            </PrivateRoute>
        ),
    },
    {
        path: '/bill-management',
        element: (
            <PrivateRoute>
                <OrdersManagement />
            </PrivateRoute>
        ),
    },
    {
        path: '/payment',
        element: (
            <PrivateRoute>
                <PaymentPage />
            </PrivateRoute>
        ),
    },
    
    {
        path: '/payment-callback',
        element: (
            <PrivateRoute>
                <PaymentCallbackPage />
            </PrivateRoute>
        ),
    },
];

export { routes };
