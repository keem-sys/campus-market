import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };

        checkUser();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500 font-semibold animate-pulse">Loading secure session...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mt-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">Campus Market</h1>
                        <p className="text-slate-500 text-sm">Dashboard Overview</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2 px-4 rounded-xl transition-colors border border-rose-100"
                    >
                        Log Out
                    </button>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-indigo-900 mb-2">Welcome back, {user?.user_metadata?.name || 'User'}!</h2>
                    <p className="text-indigo-700 text-sm mb-4">
                        You are logged in as a <span className="font-extrabold uppercase">{user?.user_metadata?.role || 'student'}</span>.
                    </p>
                    <div className="bg-white p-4 rounded-xl text-xs font-mono text-slate-500 border border-indigo-200">
                        Secure User ID: {user?.id}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50">
                        <h3 className="font-bold text-slate-800 mb-2">My Shop Listings</h3>
                        <p className="text-slate-500 text-sm mb-4">Post new second-hand products or manage active sales.</p>
                        <button className="text-indigo-600 text-sm font-bold hover:underline">Manage Listings &rarr;</button>
                    </div>
                    <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50">
                        <h3 className="font-bold text-slate-800 mb-2">Bulletin Board</h3>
                        <p className="text-slate-500 text-sm mb-4">Find campus events, student promos, and services.</p>
                        <button className="text-indigo-600 text-sm font-bold hover:underline">View Board &rarr;</button>
                    </div>
                </div>
            </div>
        </div>
    );
}