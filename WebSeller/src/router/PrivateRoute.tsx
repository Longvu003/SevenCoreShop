import React, { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: ReactNode;  // Expecting React children elements to render
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the token string from localStorage
        const tokenString: string | null = localStorage.getItem('tokenuser'); // Fetch the token
        let token: any = null; // Initialize token as null

        if (tokenString) {
            try {
                token = JSON.parse(tokenString); // Parse the JSON string into an object
            } catch (error) {
                console.error('Error parsing token:', error); // Log any errors in parsing
            }
        }

        // Check if token is not null and access the role
        if (token) {
            console.log('Role:', token.role); // Access the role property
        } else {
            console.log('Token is null or invalid'); // Handle the case when token is null
            navigate('/login');  // Redirect to login if no token
        }
    }, [navigate]);

    return <>{children}</>;  // Render the protected component if the token exists
};

export default PrivateRoute;
