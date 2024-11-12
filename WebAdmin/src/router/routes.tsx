import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';  // Import the PrivateRoute component
import Scrumboard from '../pages/AdvertisementManagent';
import Advertisement from '../pages/AdvertisementManagent';

const Index = lazy(() => import('../pages/Analytics'));
const LoginBoxed = lazy(() => import('../pages/LoginBoxed'));
const Error = lazy(() => import('../components/Error'));
const Usermanagent = lazy(() => import('../pages/UsersManagent'));
const routes = [
    // dashboard (protected)
    {
        path: '/dashboard',
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
    // Login page (public)
    {
        path: '/',
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
                <Advertisement />   
            </PrivateRoute>
        ),
    },
];

export { routes };