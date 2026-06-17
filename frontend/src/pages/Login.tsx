import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

import loginIllustration from '../assets/registration_illustration.png';

interface LoginInputs {
    email: string;
    password: string;
}

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>();
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();

    const setUser = useAuthStore((state) => state.setUser);

    const onSubmit = async (formData: LoginInputs) => {
        setLoading(true);
        setSubmitError('');

        try {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (loginError) throw loginError;

            if (data.session) {
                setUser(data.user, data.session);
                navigate('/dashboard');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setSubmitError(err.message || 'Invalid login credentials.');
            } else {
                setSubmitError('An error occurred during login.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-app">

            {/* LEFT SIDE: Brand & Illustration (Matches Registration) */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-primary flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col justify-center items-center text-center">
                    <div className="w-full max-w-sm aspect-[4/5] bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-sm overflow-hidden">
                        <img
                            src={loginIllustration}
                            alt="Login Illustration"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>

                    <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                        Welcome back
                    </h1>
                    <p className="text-slate-300 text-sm max-w-xs font-medium leading-relaxed">
                        Sign in to buy
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: The Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md">

                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-primary mb-2">Sign In</h2>
                        <p className="text-muted text-sm">Enter your credentials to access your account.</p>
                    </div>

                    {submitError && <div className="bg-red-50 text-red-600 p-4 rounded-brand text-sm mb-6 border border-red-100 font-medium">{submitError}</div>}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="name@university.ac.za"
                                    {...register('email', {
                                        required: 'Email is required'
                                    })}
                                    className="w-full pl-4 pr-10 py-3 border border-ui-border rounded-brand bg-card text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-slate-400"
                                />
                                <svg className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold text-primary">Password</label>
                                {/* Pro-UX touch: Forgot Password link */}
                                <a href="#" className="text-xs font-bold text-brand-primary hover:underline hover:text-brand-accent transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'Password is required'
                                })}
                                className="w-full px-4 py-3 border border-ui-border rounded-brand bg-card text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-slate-300 tracking-widest"
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3.5 rounded-brand transition-colors disabled:opacity-50 mt-4 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                            {!loading && (
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary font-bold hover:text-brand-accent transition-colors">
                                Create one
                            </Link>
                        </p>
                    </div>

                    {/* Trust Badges Footer */}
                    <div className="mt-12 flex items-center justify-center gap-8 text-xs font-bold text-muted border-t border-ui-border pt-6">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            SSL Secure
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}