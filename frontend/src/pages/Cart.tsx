import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';

export default function Cart() {
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const clearCart = useCartStore((state) => state.clearCart);
    const getTotalPrice = useCartStore((state) => state.getTotalPrice);

    const user = useAuthStore((state) => state.user);
    const session = useAuthStore((state) => state.session);
    const navigate = useNavigate();

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'payfast' | 'snapscan' | 'cash_escrow'>('payfast');

    const subtotal = getTotalPrice();
    const campusServiceFee = subtotal > 0 ? 15.00 : 0.00; // Small simulated platform fee
    const finalTotal = subtotal + campusServiceFee;

    const handleProceedToCheckout = async () => {
        // 1. If guest, redirect to login first
        if (!user) {
            navigate('/login');
            return;
        }

        setIsCheckingOut(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            // 2. Try recording the transaction in backend database
            if (session?.access_token) {
                await axios.post(
                    `${apiUrl}/api/transactions`,
                    {
                        items: items.map((item) => ({ product_id: item.id, amount: item.price })),
                        total_amount: finalTotal,
                        payment_method: selectedPaymentMethod,
                    },
                    {
                        headers: { Authorization: `Bearer ${session.access_token}` },
                    }
                );
            }
        } catch (err) {
            console.warn('Backend transactions endpoint offline. Simulating local checkout.');
        } finally {
            setIsCheckingOut(false);
            setOrderComplete(true);
            clearCart();
        }
    };

    // VIEW 1: ORDER CONFIRMED (RECEIPT MODAL)
    if (orderComplete) {
        return (
            <div className="min-h-[80vh] bg-app flex items-center justify-center p-4">
                <div className="bg-card rounded-brand border border-ui-border p-8 max-w-lg w-full text-center shadow-2xl animate-fadeIn">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Escrow Payment Initiated
          </span>

                    <h2 className="text-2xl font-extrabold text-primary mt-3 mb-2">Order Confirmed!</h2>
                    <p className="text-muted text-sm leading-relaxed mb-6">
                        Your payment is held safely in <strong>Campus Escrow</strong>. The seller has been notified to arrange your on-campus meetup and handover.
                    </p>

                    <div className="bg-app p-4 rounded-brand border border-ui-border text-left mb-6 text-xs space-y-2 font-medium text-slate-600">
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="font-bold text-amber-600">Pending Handover (Escrow)</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Buyer:</span>
                            <span className="font-bold text-primary">{user?.user_metadata?.name || 'Verified Student'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment Option:</span>
                            <span className="font-bold uppercase text-primary">{selectedPaymentMethod}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 rounded-brand transition-colors text-sm shadow-subtle"
                        >
                            View in My Dashboard &rarr;
                        </button>
                        <button
                            onClick={() => {
                                setOrderComplete(false);
                                navigate('/products');
                            }}
                            className="w-full py-2.5 text-xs font-bold text-muted hover:text-primary transition-colors"
                        >
                            Continue Browsing Marketplace
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // VIEW 2: EMPTY CART STATE
    // ==========================================
    if (items.length === 0) {
        return (
            <div className="min-h-[75vh] bg-app flex flex-col items-center justify-center p-4">
                <div className="bg-card rounded-brand border border-ui-border p-10 max-w-md w-full text-center shadow-subtle">
                    <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-primary mb-1">Your Cart is Empty</h2>
                    <p className="text-muted text-sm mb-6">
                        You haven't added any textbooks, electronics, or campus gear to your cart yet.
                    </p>
                    <Link
                        to="/products"
                        className="w-full inline-block bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-6 rounded-brand transition-colors text-sm shadow-subtle"
                    >
                        Explore Marketplace Listings &rarr;
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // VIEW 3: ACTIVE SHOPPING CART
    // ==========================================
    return (
        <div className="min-h-screen bg-app py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

            {/* Header & Item Count */}
            <div className="flex justify-between items-center mb-8 border-b border-ui-border pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary">Shopping Cart</h1>
                    <p className="text-muted text-sm mt-1">Review your selected items before checkout.</p>
                </div>
                <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-brand hover:bg-red-50 border border-transparent hover:border-red-200"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* LEFT 2 COLS: Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="bg-card rounded-brand border border-ui-border p-5 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                {/* Item Thumbnail Icon Placeholder */}
                                <div className="w-14 h-14 rounded-brand bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="font-extrabold text-primary text-base leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs font-bold text-muted mt-0.5">
                                        Unit Price: R {Number(item.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Price & Remove Action */}
                            <div className="flex sm:flex-col justify-between sm:items-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-ui-border">
                <span className="text-lg font-black text-brand-primary">
                  R {Number(item.price).toFixed(2)}
                </span>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 mt-1"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT 1 COL: Order Summary & Checkout Card */}
                <div className="bg-card rounded-brand border border-ui-border p-6 shadow-subtle sticky top-24">
                    <h2 className="text-lg font-extrabold text-primary border-b border-ui-border pb-3 mb-4">
                        Order Summary
                    </h2>

                    <div className="space-y-3 text-sm mb-6">
                        <div className="flex justify-between text-muted">
                            <span>Items Subtotal ({items.length})</span>
                            <span className="font-bold text-primary">R {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted">
                            <span>Campus Protection & Escrow Fee</span>
                            <span className="font-bold text-primary">R {campusServiceFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-ui-border pt-3 flex justify-between items-baseline">
                            <span className="text-base font-extrabold text-primary">Total Amount</span>
                            <span className="text-2xl font-black text-brand-primary">
                R {finalTotal.toFixed(2)}
              </span>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-primary mb-2">Select Gateway Option</label>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setSelectedPaymentMethod('payfast')}
                                className={`py-2 px-1 rounded-brand border transition-all ${
                                    selectedPaymentMethod === 'payfast'
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                        : 'bg-app text-muted border-ui-border hover:text-primary'
                                }`}
                            >
                                PayFast 💳
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedPaymentMethod('snapscan')}
                                className={`py-2 px-1 rounded-brand border transition-all ${
                                    selectedPaymentMethod === 'snapscan'
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                        : 'bg-app text-muted border-ui-border hover:text-primary'
                                }`}
                            >
                                SnapScan 📱
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedPaymentMethod('cash_escrow')}
                                className={`py-2 px-1 rounded-brand border transition-all ${
                                    selectedPaymentMethod === 'cash_escrow'
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                        : 'bg-app text-muted border-ui-border hover:text-primary'
                                }`}
                            >
                                Cash Escrow 🤝
                            </button>
                        </div>
                    </div>

                    {/* CPUT Escrow Trust Badge */}
                    <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-brand p-3.5 mb-6 flex items-start gap-2.5">
                        <svg className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p className="text-xs text-brand-primary font-medium leading-relaxed">
                            <strong>Campus Escrow Active:</strong> Funds are locked safely and are only transferred to the seller after you confirm item receipt on campus.
                        </p>
                    </div>

                    {/* Checkout CTA Button */}
                    <button
                        onClick={handleProceedToCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3.5 rounded-brand transition-colors text-sm flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
                    >
                        {isCheckingOut ? (
                            'Securing Payment...'
                        ) : user ? (
                            `Confirm & Checkout (R ${finalTotal.toFixed(2)})`
                        ) : (
                            'Sign In to Checkout →'
                        )}
                    </button>

                    <Link
                        to="/products"
                        className="block text-center text-xs font-bold text-muted hover:text-primary mt-4 transition-colors"
                    >
                        ← Add more items from Marketplace
                    </Link>
                </div>

            </div>
        </div>
    );
}