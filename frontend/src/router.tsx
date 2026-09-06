import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Layout from "./components/Layout.tsx";
import Marketplace from "./pages/Marketplace.tsx";
import BulletinBoard from "./pages/BulletinBoard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Cart from "./pages/Cart.tsx";
import CreateListing from "./pages/CreateListing.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/products" replace />,
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
            // 🌐 Public Routes (Anyone can view!)
            { path: '/products', element: <Marketplace /> },
            { path: '/bulletin', element: <BulletinBoard /> },
            { path: '/cart', element: <Cart /> },

            {
                element: <ProtectedRoute />,
                children: [
                    { path: '/dashboard', element: <Dashboard /> },
                    { path: '/create-listing', element: <CreateListing /> },
                ]
            }
        ]
    },
    {
        path: '*',
        element: <div className="flex h-screen items-center justify-center font-bold text-red-500">404 - Page Not Found</div>,
    },
]);