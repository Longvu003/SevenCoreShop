import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';  // Import the PrivateRoute component
import Scrumboard from '../pages/AdvertisementManagent';
import Advertisement from '../pages/AdvertisementManagent';

const Index = lazy(() => import('../pages/Analytics'));
const ProductManagent = lazy(() => import('../pages/ProductManagent'));
const CategoriesManagent = lazy(() => import('../pages/CategoriesManagement'));
const CategoriesNew = lazy(() => import('../pages/CategoriesNew'));
const LoginBoxed = lazy(() => import('../pages/LoginBoxed'));
const Error = lazy(() => import('../components/Error'));
const ProductCreateNew = lazy(() => import('../pages/ProductCreatNew'));
const NotificationNew = lazy(() => import('../pages/NotificationNew'));
const VoucherNew = lazy(() => import('../pages/VoucherNew'));
const VoucherEdit = lazy(() => import('../pages/VoucherEdit'));
const ProductUpdate = lazy(() => import('../pages/ProductEdit'));
const CategoriesUpdate = lazy(() => import('../pages/CategoriesNew'));
const CategoryEdit = lazy(() => import('../pages/CategoriesEdit'));
const NotificationEdit = lazy(() => import('../pages/NotificationEdit'));
const OrderManagent = lazy(() => import('../pages/OrderManagement'));
const PayOnlineManagement = lazy(() => import('../pages/PayOnlineManagement'));
const PayOnlineNew = lazy(() => import('../pages/PayonlineNew'));
const TransactionManagement = lazy(() => import('../pages/TransactionsManagement'));
const Usermanagent = lazy(() => import('../pages/UsersManagent'));
const NotificationManagement = lazy(() => import('../pages/NotificationManagement'));
const VoucherManagement = lazy(() => import('../pages/VoucherManagement'));

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
    {
        path: '/transactionmanagement',
        element: (
            <PrivateRoute>
                <TransactionManagement />
            </PrivateRoute>
        ),
    },
    {
        path: '/payonline/new',
        element: (
            <PrivateRoute>
                <PayOnlineNew />
            </PrivateRoute>
        ),
    },
    {
        path: '/payonlineManagent',
        element: (
            <PrivateRoute>
                <PayOnlineManagement />
            </PrivateRoute>
        ),
    },
    {
        path: '/orderManagent',
        element: (
            <PrivateRoute>
                <OrderManagent />
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
        path: '/product/product-update',
        element: (
            <PrivateRoute>
                <ProductUpdate />
            </PrivateRoute>
        ),
    },
    {
        path: '/advertising-management',
        element: (
            <PrivateRoute>
                <Advertisement />   
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
        path: '/notification-management',
        element: (
            <PrivateRoute>
                <NotificationManagement />   
            </PrivateRoute>
        ),
    },

    {
        path: '/notification/notification-new',
        element: (
            <PrivateRoute>
                <NotificationNew />
            </PrivateRoute>
        ),
    },

    {
        path: '/notification/notification-edit',
        element: (
            <PrivateRoute>
                <NotificationEdit />
            </PrivateRoute>
        ),
    },

    {
        path: '/voucher-management',
        element: (
            <PrivateRoute>
                <VoucherManagement />   
            </PrivateRoute>
        ),
    },

    {
        path: '/voucher/voucher-new',
        element: (
            <PrivateRoute>
                <VoucherNew />
            </PrivateRoute>
        ),
    },

    {
        path: '/voucher/voucher-edit',
        element: (
            <PrivateRoute>
                <VoucherEdit />
            </PrivateRoute>
        ),
    },
];

export { routes };
