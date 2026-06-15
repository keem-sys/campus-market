import './index.css'
import ReactDOM from 'react-dom/client';
import {router} from "./router.tsx";
import { RouterProvider } from "react-router-dom";
import React from "react";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}>

        </RouterProvider>
    </React.StrictMode>
);
