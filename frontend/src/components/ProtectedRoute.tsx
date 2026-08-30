import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../supabase';

export default function ProtectedRoute() {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const [loading, setLoading] = useState(!user);
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            const checkSession = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setUser(session.user, session);
                }
                setLoading(false);
            };
            checkSession();
        } else {
            setLoading(false);
        }
    }, [user, setUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-app flex items-center justify-center">
                <p className="text-muted font-bold animate-pulse text-sm">Verifying secure session...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}