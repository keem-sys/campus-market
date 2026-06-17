import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Layout from "./components/Layout.tsx";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
    },

    {
        path: '/login',
        element: <Login />,
    },

    {
        path: '/register',
        element: <Register />,
    },

    {
        element: <Layout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            // { path: '/products', element: <Products /> }
        ]
    },

    {
        path: '*',
        element: <div className="flex h-screen items-center justify-center font-bold text-red-500">404 - Page Not Found</div>,
    },
]);