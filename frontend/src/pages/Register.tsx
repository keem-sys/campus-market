import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import registrationIllustration from '../assets/registration_illustration.png';

interface RegisterInputs {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'student' | 'faculty' | 'vendor' | 'resident';
    terms: boolean;
}

export default function Register() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RegisterInputs>({
        defaultValues: { role: 'student', terms: false }
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();

    const currentRole = watch('role');
    const password = watch('password');

    const onSubmit = async (formData: RegisterInputs) => {
        setLoading(true);
        setSubmitError('');
        setMessage('');

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: {
                        name: formData.name,
                        role: formData.role,
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                setMessage('Registration successful! Please check your email for verification.');
                setTimeout(() => navigate('/login'), 4000);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError('An error occurred during registration.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-app">

            {/* LEFT SIDE: Brand & Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-primary flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col justify-center items-center text-center">

                    <div className="w-full max-w-sm aspect-4/5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-sm overflow-hidden">
                        <img
                            src={registrationIllustration}
                            alt="Registration Illustration"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>

                    <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                       Your community store
                    </h1>

                    <p className="text-slate-300 text-sm max-w-xs font-medium leading-relaxed">
                        The trusted marketplace built exclusively for you
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: The Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md">

                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-primary mb-2">Create Account</h2>
                        <p className="text-muted text-sm">Start your journey with an account.</p>
                    </div>

                    {submitError && <div className="bg-red-50 text-red-600 p-4 rounded-brand text-sm mb-6 border border-red-100 font-medium">{submitError}</div>}
                    {message && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-brand text-sm mb-6 border border-emerald-100 font-medium">{message}</div>}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Custom Role Toggle */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-2">Select your Account Type</label>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {/* Student */}
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'student')}
                                    className={`py-3 text-sm font-bold rounded-brand border transition-all text-center ${
                                        currentRole === 'student'
                                            ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                                            : 'bg-card text-muted border-ui-border hover:text-primary hover:border-slate-400'
                                    }`}
                                >
                                    Student
                                </button>

                                {/* Faculty */}
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'faculty')}
                                    className={`py-3 text-sm font-bold rounded-brand border transition-all text-center ${
                                        currentRole === 'faculty'
                                            ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                                            : 'bg-card text-muted border-ui-border hover:text-primary hover:border-slate-400'
                                    }`}
                                >
                                    Faculty & Staff
                                </button>

                                {/* Vendor */}
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'vendor')}
                                    className={`py-3 text-sm font-bold rounded-brand border transition-all text-center ${
                                        currentRole === 'vendor'
                                            ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                                            : 'bg-card text-muted border-ui-border hover:text-primary hover:border-slate-400'
                                    }`}
                                >
                                    Local Vendor
                                </button>

                                {/* Resident */}
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'resident')}
                                    className={`py-3 text-sm font-bold rounded-brand border transition-all text-center ${
                                        currentRole === 'resident'
                                            ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                                            : 'bg-card text-muted border-ui-border hover:text-primary hover:border-slate-400'
                                    }`}
                                >
                                    Local Resident
                                </button>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                {...register('name', { required: 'Name is required' })}
                                className="w-full px-4 py-3 border border-ui-border rounded-brand bg-card text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-slate-400"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>}
                        </div>

                        {/* University Email */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">
                                {currentRole === 'student' ? 'University Email' : 'Business Email'}
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder={currentRole === 'student' ? "studentnumber@mycput.ac.za" : "hello@yourbusiness.com"}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    className="w-full pl-4 pr-10 py-3 border border-ui-border rounded-brand bg-card text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-slate-400"
                                />
                                {/* Mail Icon */}
                                <svg className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Passwords - Side by Side on Desktop, Stacked on Mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-primary mb-1.5">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Minimum 6 characters' }
                                    })}
                                    className="w-full px-4 py-3 border border-ui-border rounded-brand bg-card text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-slate-300 tracking-widest"
                                />
                                {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-primary mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm password',
                                        validate: (val) => val === password || "Passwords do not match"
                                    })}
                                    className="w-full px-4 py-3 border border-ui-border rounded-brand bg-card text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-slate-300 tracking-widest"
                                />
                                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {/* Terms and Conditions Checkbox */}
                        <div className="pt-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('terms', { required: 'You must agree to the terms' })}
                                    className="w-5 h-5 rounded border-ui-border text-brand-primary focus:ring-brand-primary/20 cursor-pointer"
                                />
                                <span className="text-sm text-muted">
                  I agree to the <span className="font-bold text-primary hover:underline">Terms of Service</span> and <span className="font-bold text-primary hover:underline">Privacy Policy</span>.
                </span>
                            </label>
                            {errors.terms && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.terms.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3.5 rounded-brand transition-colors disabled:opacity-50 mt-4 flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && (
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:text-brand-accent transition-colors">
                                Sign in
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