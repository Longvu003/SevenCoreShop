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
const ProductUpdate = lazy(() => import('../pages/ProductEdit'));
const CategoriesUpdate = lazy(() => import('../pages/CategoriesNew'));
const CategoryEdit = lazy(() => import('../pages/CategoriesEdit'));
const OrderManagent = lazy(() => import('../pages/OrderManagement'));
const PayOnlineManagement = lazy(() => import('../pages/PayOnlineManagement'));
const PayOnlineNew = lazy(() => import('../pages/PayonlineNew'));
const TransactionManagement = lazy(() => import('../pages/TransactionsManagement'));
const Usermanagent = lazy(() => import('../pages/UsersManagent'));

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
