import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../supabase';

interface UserListing {
    id: string;
    title: string;
    price: number;
    category: string;
    status: string;
    created_at: string;
}

interface UserTransaction {
    id: string;
    product_title: string;
    amount: number;
    status: 'escrow' | 'completed' | 'refunded';
    created_at: string;
}

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'listings' | 'purchases' | 'posts'>('listings');
    const [userListings, setUserListings] = useState<UserListing[]>([]);
    const [userTransactions, setUserTransactions] = useState<UserTransaction[]>([]);
    const [loading, setLoading] = useState(false);

    const userRole = user?.user_metadata?.role || 'student';
    const userName = user?.user_metadata?.name || 'CPUT User';
    const userEmail = user?.email || 'student@mycput.ac.za';

    // Fetch data specific to this authenticated user
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // 1. Fetch products listed by this user
                const { data: productsData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('seller_id', user.id);

                if (productsData && productsData.length > 0) {
                    setUserListings(productsData);
                } else {
                    // Sample fallback so the dashboard isn't empty during testing
                    setUserListings([
                        {
                            id: 'mock-user-1',
                            title: 'Engineering Mathematics (8th Edition)',
                            price: 350.00,
                            category: 'Textbooks',
                            status: 'active',
                            created_at: new Date().toISOString()
                        }
                    ]);
                }

                const { data: transData } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('buyer_id', user.id);

                if (transData && transData.length > 0) {
                    setUserTransactions(transData.map(t => ({
                        id: t.id,
                        product_title: 'Campus Marketplace Item',
                        amount: t.amount,
                        status: t.status,
                        created_at: t.created_at
                    })));
                } else {
                    setUserTransactions([
                        {
                            id: 'tx-101',
                            product_title: 'Casio FX-991ZA Scientific Calculator',
                            amount: 220.00,
                            status: 'escrow',
                            created_at: new Date().toISOString()
                        }
                    ]);
                }
            } catch (err) {
                console.warn('Using local fallback state for dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        navigate('/login');
    };

    const handleDeleteListing = async (id: string) => {
        try {
            await supabase.from('products').delete().eq('id', id);
            setUserListings(userListings.filter(item => item.id !== id));
        } catch (err) {
            setUserListings(userListings.filter(item => item.id !== id));
        }
    };

    const handleReleaseEscrow = async (txId: string) => {
        try {
            await supabase.from('transactions').update({ status: 'completed' }).eq('id', txId);
            setUserTransactions(userTransactions.map(tx => tx.id === txId ? { ...tx, status: 'completed' } : tx));
        } catch (err) {
            setUserTransactions(userTransactions.map(tx => tx.id === txId ? { ...tx, status: 'completed' } : tx));
        }
    };

    return (
        <div className="min-h-screen bg-app py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

            {/* 1. Profile Banner Header */}
            <div className="bg-card rounded-brand border border-ui-border p-6 sm:p-8 shadow-subtle mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        {/* User Initials Avatar */}
                        <div className="w-16 h-16 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-black text-2xl shadow-subtle border-2 border-brand-accent/30">
                            {userName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-extrabold text-primary">{userName}</h1>
                                {/* Role Badge */}
                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider ${
                                    userRole === 'vendor'
                                        ? 'bg-brand-accent/20 text-brand-primary border border-brand-accent/40'
                                        : 'bg-brand-primary/10 text-brand-primary'
                                }`}>
                  {userRole}
                </span>
                            </div>
                            <p className="text-muted text-xs flex items-center gap-1.5 font-medium">
                                <span>{userEmail}</span>
                                <span>•</span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  ✓ Verified Campus Profile
                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2.5 w-full sm:w-auto">
                        <Link
                            to="/create-listing"
                            className="flex-1 sm:flex-none text-center bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2.5 px-4 rounded-brand text-xs shadow-subtle transition-colors"
                        >
                            + Post New Listing
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-xs font-bold text-muted hover:text-red-500 transition-colors px-3 py-2 border border-ui-border rounded-brand hover:border-red-200 bg-app"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* 2. Quick Stat Counters */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-ui-border">
                    <div className="text-center sm:text-left">
                        <span className="text-xs font-bold text-muted uppercase tracking-wider block">My Active Listings</span>
                        <span className="text-2xl font-black text-brand-primary">{userListings.length}</span>
                    </div>
                    <div className="text-center sm:text-left">
                        <span className="text-xs font-bold text-muted uppercase tracking-wider block">Escrow Orders</span>
                        <span className="text-2xl font-black text-amber-600">
              {userTransactions.filter(t => t.status === 'escrow').length}
            </span>
                    </div>
                    <div className="text-center sm:text-left">
                        <span className="text-xs font-bold text-muted uppercase tracking-wider block">Completed Sales</span>
                        <span className="text-2xl font-black text-emerald-600">
              {userTransactions.filter(t => t.status === 'completed').length}
            </span>
                    </div>
                </div>
            </div>

            {/* 3. Tabbed Navigation */}
            <div className="flex gap-2 border-b border-ui-border mb-6">
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${
                        activeTab === 'listings'
                            ? 'border-brand-primary text-brand-primary'
                            : 'border-transparent text-muted hover:text-primary'
                    }`}
                >
                    My Store Listings ({userListings.length})
                </button>

                <button
                    onClick={() => setActiveTab('purchases')}
                    className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${
                        activeTab === 'purchases'
                            ? 'border-brand-primary text-brand-primary'
                            : 'border-transparent text-muted hover:text-primary'
                    }`}
                >
                    Purchases & Escrow ({userTransactions.length})
                </button>
            </div>

            {/* 4. TAB CONTENTS */}
            {loading ? (
                <div className="py-20 text-center text-muted font-bold animate-pulse">Loading dashboard...</div>
            ) : activeTab === 'listings' ? (

                /* TAB 1: LISTINGS */
                userListings.length === 0 ? (
                    <div className="bg-card rounded-brand border border-ui-border p-12 text-center shadow-subtle">
                        <h3 className="text-lg font-bold text-primary mb-2">No Active Listings Yet</h3>
                        <p className="text-muted text-sm mb-6">You haven't posted any items for sale on the campus marketplace.</p>
                        <Link
                            to="/create-listing"
                            className="bg-brand-primary text-white font-bold py-2.5 px-5 rounded-brand text-xs"
                        >
                            Post Your First Item
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {userListings.map((item) => (
                            <div
                                key={item.id}
                                className="bg-card rounded-brand border border-ui-border p-4 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary">
                      {item.category || 'General'}
                    </span>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      ● Active on Feed
                    </span>
                                    </div>
                                    <h3 className="font-extrabold text-primary text-base">{item.title}</h3>
                                    <span className="text-sm font-black text-brand-primary">R {Number(item.price).toFixed(2)}</span>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                    <button
                                        onClick={() => handleDeleteListing(item.id)}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-brand transition-colors"
                                    >
                                        Delete Listing
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )

            ) : (

                /* TAB 2: PURCHASES & ESCROW */
                <div className="space-y-4">
                    <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-brand p-4 text-xs text-brand-primary font-medium flex items-center gap-2">
                        <span>🛡️</span>
                        <span><strong>Campus Escrow System:</strong> Once you meet the seller on campus and receive your item in good condition, click "Confirm Delivery" to release payment.</span>
                    </div>

                    {userTransactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="bg-card rounded-brand border border-ui-border p-5 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-muted font-mono">Order #{tx.id}</span>
                                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                        tx.status === 'escrow'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                    {tx.status === 'escrow' ? '⏳ Held in Escrow' : '✓ Completed'}
                  </span>
                                </div>
                                <h3 className="font-extrabold text-primary text-base">{tx.product_title}</h3>
                                <span className="text-sm font-black text-brand-primary">R {Number(tx.amount).toFixed(2)}</span>
                            </div>

                            <div>
                                {tx.status === 'escrow' ? (
                                    <button
                                        onClick={() => handleReleaseEscrow(tx.id)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-brand transition-colors shadow-subtle"
                                    >
                                        Confirm Delivery (Release Funds)
                                    </button>
                                ) : (
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-brand border border-emerald-200">
                    ✓ Handover Confirmed
                  </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            )}

        </div>
    );
}