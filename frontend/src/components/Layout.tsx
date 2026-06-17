import {Outlet} from "react-router-dom";
import Footer from "./Footer.tsx";
import Navbar from "./Navbar.tsx";


export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}