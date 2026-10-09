import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { campusImages } from '../assets/campus/images';

interface CreateListingInputs {
    title: string;
    category: string;
    price: number;
    image_url: string;
    description: string;
}

const SAMPLE_IMAGES = [
    { label: '📚 Prescribed Textbook', url: campusImages.textbooks },
    { label: '🧮 Calculator', url: campusImages.calculator },
    { label: '🥼 Lab Gear', url: campusImages.labCoat },
    { label: '🛠️ Engineering Kit', url: campusImages.engineeringKit },
    { label: '🛋️ Residence Essential', url: campusImages.residence },
    { label: '🖨️ Campus Service', url: campusImages.printing },
];

export default function CreateListing() {
    const user = useAuthStore((state) => state.user);
    const session = useAuthStore((state) => state.session);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateListingInputs>({
        defaultValues: {
            category: 'Textbooks',
            image_url: new URL(SAMPLE_IMAGES[0].url, window.location.origin).href,
        }
    });

    // Watch inputs for real-time live preview card
    const watchedTitle = watch('title') || 'Your Product Title';
    const watchedPrice = watch('price') || 0;
    const watchedCategory = watch('category') || 'Textbooks';
    const watchedImageUrl = watch('image_url') || SAMPLE_IMAGES[0].url;
    const watchedDescription = watch('description') || 'Provide details about condition, edition, or pickup location...';

    const onSubmit = async (formData: CreateListingInputs) => {
        setLoading(true);
        setSubmitError('');
        setSuccessMessage('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            if (session?.access_token) {
                await axios.post(
                    `${apiUrl}/api/products`,
                    {
                        title: formData.title,
                        description: formData.description,
                        price: Number(formData.price),
                        image_url: formData.image_url,
                        category: formData.category,
                    },
                    {
                        headers: { Authorization: `Bearer ${session.access_token}` }
                    }
                );
            }

            setSuccessMessage('Listing created successfully! Redirecting to marketplace...');
            setTimeout(() => navigate('/products'), 2000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setSubmitError(err.message || 'Failed to create listing.');
            } else {
                setSubmitError('Failed to create listing. Please check your backend connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-app py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

            {/* Escape Navigation */}
            <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-primary mb-6 transition-colors group"
            >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-primary">Post a New Listing 🏷️</h1>
                <p className="text-muted text-sm mt-1">List second-hand items or vendor products for verified campus members.</p>
            </div>

            {submitError && <div className="bg-red-50 text-red-600 p-4 rounded-brand text-sm mb-6 border border-red-100 font-medium">{submitError}</div>}
            {successMessage && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-brand text-sm mb-6 border border-emerald-100 font-medium">{successMessage}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* LEFT 2 COLS: The Form */}
                <div className="lg:col-span-2 bg-card rounded-brand border border-ui-border p-6 sm:p-8 shadow-subtle">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Product Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Engineering Mathematics (8th Edition)"
                                {...register('title', { required: 'Title is required', minLength: { value: 4, message: 'Minimum 4 characters' } })}
                                className="w-full px-4 py-2.5 border border-ui-border rounded-brand bg-app text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                            />
                            {errors.title && <p className="text-xs text-red-500 mt-1 font-medium">{errors.title.message}</p>}
                        </div>

                        {/* Category & Price Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-primary mb-1.5">Category</label>
                                <select
                                    {...register('category')}
                                    className="w-full px-4 py-2.5 border border-ui-border rounded-brand bg-app text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                                >
                                    <option value="Textbooks">Textbooks</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing & Lab Gear</option>
                                    <option value="Stationery">Stationery & Notes</option>
                                    <option value="Dorm Gear">Dorm Gear</option>
                                    <option value="Services">Services</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-primary mb-1.5">Price (ZAR - Rands)</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-muted">R</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="250.00"
                                        {...register('price', { required: 'Price is required', min: { value: 1, message: 'Price must be greater than 0' } })}
                                        className="w-full pl-8 pr-4 py-2.5 border border-ui-border rounded-brand bg-app text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm font-bold"
                                    />
                                </div>
                                {errors.price && <p className="text-xs text-red-500 mt-1 font-medium">{errors.price.message}</p>}
                            </div>
                        </div>

                        {/* Image URL & Quick Sample Presets */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold text-primary">Image URL</label>
                                <span className="text-[11px] text-muted font-medium">Quick presets for demo:</span>
                            </div>

                            {/* Preset buttons */}
                            <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-none">
                                {SAMPLE_IMAGES.map((sample) => (
                                    <button
                                        key={sample.label}
                                        type="button"
                                        onClick={() => setValue('image_url', new URL(sample.url, window.location.origin).href)}
                                        className="text-[11px] font-bold bg-app hover:bg-brand-primary/10 text-primary border border-ui-border px-2.5 py-1 rounded-md transition-colors whitespace-nowrap"
                                    >
                                        {sample.label}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="url"
                                placeholder="https://example.com/item-photo.jpg"
                                {...register('image_url', { required: 'Image URL is required' })}
                                className="w-full px-4 py-2.5 border border-ui-border rounded-brand bg-app text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                            />
                            <p className="text-[11px] text-muted mt-2">
                                Presets are illustrations for demos. For a real listing, use a photo of your actual item.
                            </p>
                            {errors.image_url && <p className="text-xs text-red-500 mt-1 font-medium">{errors.image_url.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-primary mb-1.5">Item Description</label>
                            <textarea
                                rows={4}
                                placeholder="Include item condition, subject codes, meeting points on campus, etc."
                                {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Please provide at least 10 characters' } })}
                                className="w-full px-4 py-2.5 border border-ui-border rounded-brand bg-app text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                            ></textarea>
                            {errors.description && <p className="text-xs text-red-500 mt-1 font-medium">{errors.description.message}</p>}
                        </div>

                        {/* Escrow Seller Protection Notice */}
                        <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-brand p-3.5 flex items-start gap-2.5">
                            <svg className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <p className="text-xs text-brand-primary font-medium leading-relaxed">
                                <strong>Seller Escrow Policy:</strong> When a buyer purchases this item, funds are locked in escrow. Once you complete the campus handover, the funds are immediately cleared to your account.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3.5 rounded-brand transition-colors text-sm shadow-subtle disabled:opacity-50"
                        >
                            {loading ? 'Publishing Listing...' : 'Publish to Marketplace →'}
                        </button>
                    </form>
                </div>

                {/* RIGHT 1 COL: Live Card Preview */}
                <div className="sticky top-24">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted">Live Feed Preview</span>
                        <span className="text-[10px] font-bold bg-brand-accent/20 text-brand-primary px-2 py-0.5 rounded">Real-Time</span>
                    </div>

                    <div className="bg-card rounded-brand border border-ui-border shadow-md overflow-hidden flex flex-col pointer-events-none">
                        <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                            <img
                                src={watchedImageUrl}
                                alt="Preview"
                                onError={(e) => {
                                    if (e.currentTarget.src !== new URL(campusImages.unavailable, window.location.origin).href) {
                                        e.currentTarget.src = campusImages.unavailable;
                                    }
                                }}
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-brand-primary/80 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                {watchedCategory}
              </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-lg font-black text-brand-primary">
                    R {Number(watchedPrice || 0).toFixed(2)}
                  </span>
                                    <span className="text-[11px] font-bold text-muted">
                    by {user?.user_metadata?.name || 'You'}
                  </span>
                                </div>

                                <h2 className="font-bold text-primary text-sm line-clamp-1">
                                    {watchedTitle}
                                </h2>
                                <p className="text-muted text-xs line-clamp-2 mt-1 leading-relaxed">
                                    {watchedDescription}
                                </p>
                            </div>

                            <div className="w-full mt-4 py-2 bg-slate-200 text-slate-500 rounded-brand font-bold text-xs text-center">
                                Add to Cart Preview
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}