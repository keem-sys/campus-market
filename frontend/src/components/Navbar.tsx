import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../supabase';

export default function Navbar() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

                    {/* LEFT: Logo */}
                    <div className="shrink-0 flex items-center">
                        <Link to="/dashboard" className="text-2xl font-extrabold text-brand-primary tracking-tight flex items-center gap-2">
                            <svg className="w-8 h-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Campus Market
                        </Link>
                    </div>

                    {/* CENTER: Desktop Links (Hidden on Mobile) */}
                    <div className="hidden md:flex space-x-8">
                        <Link to="/dashboard" className="text-sm font-bold text-muted hover:text-brand-accent transition-colors">Home</Link>
                        <Link to="/products" className="text-sm font-bold text-muted hover:text-brand-accent transition-colors">Marketplace</Link>
                        <Link to="/bulletin" className="text-sm font-bold text-muted hover:text-brand-accent transition-colors">Bulletin Board</Link>
                    </div>

                    {/* RIGHT: Desktop Auth Buttons (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-primary">
                  Hi, {user.user_metadata?.name?.split(' ')[0]} {/* Shows just the first name */}
                </span>
                                <Link
                                    to="/create-listing"
                                    className="text-sm font-bold text-brand-accent hover:text-brand-accent/80 transition-colors"
                                >
                                    + Sell Item
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-bold text-muted hover:text-red-500 transition-colors px-3 py-1.5 border border-ui-border rounded-brand hover:border-red-200 bg-app"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
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

                    {/* MOBILE: Hamburger Menu Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-muted hover:text-primary focus:outline-none p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> // X icon
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> // Hamburger icon
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
                            to="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-brand text-base font-bold text-primary hover:bg-app hover:text-brand-accent"
                        >
                            Home
                        </Link>
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

                        <div className="border-t border-ui-border mt-4 pt-4">
                            {user ? (
                                <div className="space-y-2">
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium text-muted">Signed in as</p>
                                        <p className="text-base font-bold text-primary">{user.user_metadata?.name}</p>
                                    </div>
                                    <Link
                                        to="/create-listing"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-brand text-base font-bold text-brand-accent hover:bg-app"
                                    >
                                        + Sell an Item
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