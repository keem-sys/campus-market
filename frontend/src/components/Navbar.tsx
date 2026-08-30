import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { supabase } from '../supabase';
import CartIcon from './icons/CartIcon';

export default function Navbar() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.length;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userRole = user?.user_metadata?.role || 'student';
    const userName = user?.user_metadata?.name?.split(' ')[0] || 'User';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-card border-b border-ui-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* LEFT: Logo (Acts as Home -> /products) */}
                    <Link to="/products" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-brand bg-brand-primary flex items-center justify-center shadow-subtle border border-white/10 group-hover:bg-brand-primary/90 transition-colors">
                            <span className="text-brand-accent font-black text-sm tracking-wider">CM</span>
                        </div>
                        <span className="text-2xl font-extrabold text-brand-primary tracking-tight">
                            Campus Market
                        </span>
                    </Link>

                    {/* CENTER: Desktop Links */}
                    <div className="hidden md:flex space-x-8">
                        <Link to="/products" className="text-sm font-bold text-muted hover:text-brand-accent transition-colors">
                            Marketplace
                        </Link>
                        <Link to="/bulletin" className="text-sm font-bold text-muted hover:text-brand-accent transition-colors">
                            Bulletin Board
                        </Link>
                        {/* Only visible when authenticated */}
                        {user && (
                            <Link to="/dashboard" className="text-sm font-bold text-muted hover:text-brand-accent transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* RIGHT: Desktop Auth, Role & Cart */}
                    <div className="hidden md:flex items-center space-x-5">

                        {/* 🛒 Cart Icon */}
                        <Link
                            to="/cart"
                            className="relative p-2 text-primary hover:text-brand-accent transition-colors flex items-center justify-center group"
                            title="Shopping Cart"
                        >
                            <CartIcon className="w-6 h-6 group-hover:scale-105 transition-transform" />

                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-brand-accent text-brand-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-card shadow-sm animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Logged-In User Actions */}
                        {user ? (
                            <div className="flex items-center gap-3.5 border-l border-ui-border pl-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-primary leading-tight">
                                        Hi, {userName}
                                    </span>
                                    {/* Role Badge (Highlighted orange for vendors, subtle for campus members) */}
                                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider ${
                                        userRole === 'vendor'
                                            ? 'bg-brand-accent/20 text-brand-primary border border-brand-accent/40'
                                            : 'bg-brand-primary/10 text-brand-primary'
                                    }`}>
                                        {userRole}
                                    </span>
                                </div>

                                {/* Dynamic Action Button */}
                                <Link
                                    to="/create-listing"
                                    className="text-xs font-bold text-brand-primary bg-brand-accent/15 hover:bg-brand-accent/25 border border-brand-accent/30 px-3.5 py-2 rounded-brand transition-colors whitespace-nowrap"
                                >
                                    {userRole === 'vendor' ? '+ Add Product' : '+ Sell Item'}
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="text-xs font-bold text-muted hover:text-red-500 transition-colors px-3 py-2 border border-ui-border rounded-brand hover:border-red-200 bg-app"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            /* Guest Auth Actions */
                            <div className="flex items-center gap-3 border-l border-ui-border pl-4">
                                <Link
                                    to="/login"
                                    className="text-sm font-bold text-primary hover:text-brand-accent transition-colors px-3 py-2"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary/90 transition-colors px-5 py-2 rounded-brand shadow-subtle"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* MOBILE: Cart Icon & Hamburger Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <Link
                            to="/cart"
                            className="relative p-2 text-primary hover:text-brand-accent transition-colors"
                            title="Shopping Cart"
                        >
                            <CartIcon className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-brand-accent text-brand-primary text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-card shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-muted hover:text-primary focus:outline-none p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE: Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-card border-t border-ui-border">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link
                            to="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-brand text-base font-bold text-primary hover:bg-app hover:text-brand-accent"
                        >
                            Marketplace
                        </Link>
                        <Link
                            to="/bulletin"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-brand text-base font-bold text-primary hover:bg-app hover:text-brand-accent"
                        >
                            Bulletin Board
                        </Link>
                        {user && (
                            <Link
                                to="/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-brand text-base font-bold text-primary hover:bg-app hover:text-brand-accent"
                            >
                                Dashboard
                            </Link>
                        )}

                        <div className="border-t border-ui-border mt-4 pt-4">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="px-3 py-1 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-muted">Signed in as</p>
                                            <p className="text-base font-bold text-primary">{user.user_metadata?.name}</p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary">
                                            {userRole}
                                        </span>
                                    </div>
                                    <Link
                                        to="/create-listing"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-brand text-base font-bold text-brand-accent hover:bg-app"
                                    >
                                        {userRole === 'vendor' ? '+ Add Product' : '+ Sell an Item'}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block px-3 py-2 rounded-brand text-base font-bold text-red-500 hover:bg-red-50"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 px-3 mt-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full text-center py-2.5 rounded-brand font-bold text-primary border border-ui-border hover:bg-app"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full text-center py-2.5 rounded-brand font-bold text-white bg-brand-primary shadow-subtle"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}