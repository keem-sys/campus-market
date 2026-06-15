// frontend/src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // If a session exists, save the user globally [1]
                setUser(session.user, session);
            } else {
                // If no session exists, clear the global state (user is a guest)
                logout();
            }
            setLoading(false);
        };

        checkUser();
    }, [setUser, logout]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        navigate('/login');
    };

    const handleCreateListing = () => {
        if (!user) {
            // If a guest tries to create a listing, redirect them to login [1]
            navigate('/login');
        } else {
            // Proceed to create listing page
            navigate('/create-listing');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-app flex items-center justify-center">
                <p className="text-muted font-bold animate-pulse">Loading Campus Market...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app p-6 flex flex-col items-center">
            <div className="max-w-2xl w-full bg-card rounded-brand shadow-subtle border border-ui-border p-8 mt-10">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-8 border-b border-ui-border pb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary">Campus Market</h1>
                        <p className="text-muted text-sm mt-1">CPUT Community Store</p>
                    </div>

                    {/* Conditional Header Button based on Auth Status */}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-transparent hover:bg-brand-accent/10 text-brand-primary border border-ui-border hover:border-brand-accent font-bold py-2 px-4 rounded-brand transition-all"
                        >
                            Log Out
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2 px-6 rounded-brand transition-all shadow-subtle"
                        >
                            Sign In
                        </button>
                    )}
                </div>

                {/* Conditional Welcome Box */}
                {user ? (
                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-brand p-6">
                        <h2 className="text-xl font-bold text-primary mb-2">Welcome back, {user?.user_metadata?.name || 'User'}!</h2>
                        <p className="text-primary text-sm mb-4">
                            You are logged in as a <span className="font-extrabold uppercase text-brand-accent">{user?.user_metadata?.role || 'student'}</span>.
                        </p>
                        <div className="bg-card p-4 rounded-brand text-xs font-mono text-muted border border-ui-border">
                            Secure User ID: {user?.id}
                        </div>
                    </div>
                ) : (
                    <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-brand p-6">
                        <h2 className="text-xl font-bold text-primary mb-2">Window Shopping? 🛒</h2>
                        <p className="text-muted text-sm">
                            You are currently browsing as a guest. Feel free to view listings and the bulletin board, but you must <span onClick={() => navigate('/login')} className="font-bold text-brand-primary cursor-pointer hover:underline">sign in</span> to buy or sell items.
                        </p>
                    </div>
                )}

                {/* Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="border border-ui-border rounded-brand p-6 bg-app hover:shadow-subtle transition-all">
                        <h3 className="font-bold text-primary mb-2">My Shop Listings</h3>
                        <p className="text-muted text-sm mb-4">Post new second-hand products or manage active sales.</p>
                        <button
                            onClick={handleCreateListing}
                            className="text-brand-primary text-sm font-bold hover:text-brand-accent transition-colors flex items-center gap-1"
                        >
                            Manage Listings <span>&rarr;</span>
                        </button>
                    </div>

                    <div className="border border-ui-border rounded-brand p-6 bg-app hover:shadow-subtle transition-all">
                        <h3 className="font-bold text-primary mb-2">Bulletin Board</h3>
                        <p className="text-muted text-sm mb-4">Find campus events, student promos, and services.</p>
                        <button className="text-brand-primary text-sm font-bold hover:text-brand-accent transition-colors flex items-center gap-1">
                            View Board <span>&rarr;</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}