import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';
import { campusImages } from '../assets/campus/images';
import campusTrading from '../assets/campus/trading.svg';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    status: string;
    seller_name?: string;
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod-1',
        title: 'Engineering Mathematics (8th Edition)',
        description: 'Barely used, textbook for 1st & 2nd year Engineering students. No missing pages.',
        price: 350.00,
        category: 'Textbooks',
        image_url: campusImages.textbooks,
        status: 'active',
        seller_name: 'Sipho N.'
    },
    {
        id: 'prod-2',
        title: 'Casio FX-991ZA Plus II Scientific Calculator',
        description: 'Second-hand scientific calculator with protective case. Check your module requirements before buying.',
        price: 220.00,
        category: 'Electronics',
        image_url: campusImages.calculator,
        status: 'active',
        seller_name: 'Jessica M.'
    },
    {
        id: 'prod-3',
        title: 'White Lab Coat (Size Medium)',
        description: 'Clean second-hand lab coat for Chemistry and Biology practicals. Check the required size and safety specifications.',
        price: 150.00,
        category: 'Clothing',
        image_url: campusImages.labCoat,
        status: 'active',
        seller_name: 'David K.'
    },
    {
        id: 'prod-4',
        title: 'District Six Printing & Binding (per set)',
        description: 'Affordable printing and binding for lecture notes, assignments, and project submissions near campus.',
        price: 25.00,
        category: 'Services',
        image_url: campusImages.printing,
        status: 'active',
        seller_name: 'District Six Print Hub'
    },
    {
        id: 'prod-5',
        title: 'Java Programming & Data Structures Notes',
        description: 'Comprehensive printed & bound study guides with practice past papers and solutions.',
        price: 80.00,
        category: 'Stationery',
        image_url: campusImages.stationery,
        status: 'active',
        seller_name: 'Matthew B.'
    },
    {
        id: 'prod-6',
        title: 'Dorm Desk Lamp with USB Charging Port',
        description: 'Adjustable LED study lamp with 3 brightness modes. Perfect for late night studying.',
        price: 180.00,
        category: 'Dorm Gear',
        image_url: campusImages.lamp,
        status: 'active',
        seller_name: 'Jayden R.'
    },
    {
        id: 'prod-7',
        title: 'Economics 1A Prescribed Textbook (Latest Edition)',
        description: 'Current CPUT reading list copy with clean pages and no highlights. Includes transparent cover.',
        price: 390.00,
        category: 'Textbooks',
        image_url: campusImages.economics,
        status: 'active',
        seller_name: 'Zanele P.'
    },
    {
        id: 'prod-8',
        title: 'Project Management 3 Prescribed Book + Summary Pack',
        description: 'Prescribed PRM text with chapter summaries and assignment tips, ideal for semester planning.',
        price: 310.00,
        category: 'Textbooks',
        image_url: campusImages.projectManagement,
        status: 'active',
        seller_name: 'Nomsa L.'
    },
    {
        id: 'prod-9',
        title: 'Hoodie (Orange, Large)',
        description: 'Second-hand orange hoodie in excellent condition for cold early lectures and residence life.',
        price: 280.00,
        category: 'Clothing',
        image_url: campusImages.hoodie,
        status: 'active',
        seller_name: 'Liam S.'
    },
    {
        id: 'prod-10',
        title: 'Residence Starter Bundle (Kettle + Storage Crates)',
        description: 'Reliable dorm essentials for first-years moving into Bellville and District Six residences.',
        price: 680.00,
        category: 'Dorm Gear',
        image_url: campusImages.residence,
        status: 'active',
        seller_name: 'Ayanda G.'
    },
    {
        id: 'prod-11',
        title: 'HP Laptop Backpack (Water Resistant)',
        description: 'Fits up to 15.6" laptop, with padded straps and extra compartments.',
        price: 240.00,
        category: 'Dorm Gear',
        image_url: campusImages.backpack,
        status: 'active',
        seller_name: 'Mpho D.'
    },
    {
        id: 'prod-12',
        title: 'Civil Engineering Drawing Instrument Kit',
        description: 'Set square, compass, adjustable ruler, and mechanical pencils used for 1st-year engineering modules.',
        price: 360.00,
        category: 'Stationery',
        image_url: campusImages.engineeringKit,
        status: 'active',
        seller_name: 'Karen V.'
    }
];

const CATEGORIES = ['All', 'Textbooks', 'Electronics', 'Clothing', 'Stationery', 'Dorm Gear', 'Services'];

export default function Marketplace() {
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
    const [loading, setLoading] = useState(false);
    const [addedId, setAddedId] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showingDemoProducts, setShowingDemoProducts] = useState(true);

    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        const fetchLiveProducts = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/products`);
                if (res.data && res.data.length > 0) {
                    setProducts(res.data);
                    setShowingDemoProducts(false);
                }
            } catch (err) {
                console.warn('Backend API unavailable or empty. Using local mock dataset.');
            } finally {
                setLoading(false);
            }
        };

        fetchLiveProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            title: product.title,
            price: Number(product.price)
        });
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    // Filter & Sorting Logic
    const filteredProducts = products
        .filter((product) => {
            const matchesSearch =
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return 0;
        });

    return (
        <div className="min-h-screen bg-app py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

            <section className="mb-8 overflow-hidden rounded-brand bg-brand-primary grid md:grid-cols-2">
                <div className="p-6 sm:p-8 flex flex-col justify-center text-left">
                    <p className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-3">Made for campus life</p>
                    <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                        Pass it on.<br />Keep the cost down.
                    </h2>
                    <p className="text-slate-200 text-sm leading-relaxed max-w-md">
                        Give textbooks, calculators, and residence essentials a second life.
                        Connect with fellow students and small businesses around District Six and Bellville.
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed mt-5">
                        Campus handovers: choose a busy, public meeting point and inspect the item before accepting it.
                    </p>
                </div>
                <img
                    src={campusTrading}
                    alt="Two students exchanging a course book on campus beside a local printing stall"
                    className="w-full h-auto md:h-full object-contain bg-[#eaf4f1]"
                    fetchPriority="high"
                />
            </section>

            {/* 1. Header & Hero Search Bar */}
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-2">
                    Campus Marketplace
                </h1>
                <p className="text-muted text-sm sm:text-base max-w-2xl">
                    Find affordable course essentials and residence gear from verified campus sellers, or discover services from nearby vendors.
                </p>

                {/* Search & Sort Row */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search textbooks, calculators, dorm gear..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-card border border-ui-border rounded-brand text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-sm placeholder:text-slate-400 shadow-subtle"
                        />
                        {/* Search Icon */}
                        <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className="text-xs font-bold text-muted uppercase tracking-wider hidden sm:inline">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2.5 bg-card border border-ui-border rounded-brand text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer shadow-subtle"
                        >
                            <option value="newest">Featured & Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* 2. Category Filter Chips */}
                <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-brand text-xs font-bold whitespace-nowrap transition-all border ${
                                selectedCategory === cat
                                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                    : 'bg-card text-muted border-ui-border hover:border-slate-400 hover:text-primary'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Product Grid */}
            {loading ? (
                <div className="py-20 text-center">
                    <p className="text-muted font-bold animate-pulse">Loading verified listings...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                /* Empty State */
                <div className="bg-card rounded-brand border border-ui-border p-12 text-center max-w-lg mx-auto shadow-subtle my-12">
                    <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-1">No products found</h3>
                    <p className="text-sm text-muted mb-6">
                        We couldn't find any listings matching "{searchQuery}". Try adjusting your search query or category filter.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                /* Responsive Grid */
                <>
                {showingDemoProducts && (
                    <p className="text-xs text-muted mb-4">
                        Demo listings with illustrative images, not actual seller photos. Live listings use sellers&apos; own images.
                    </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="bg-card rounded-brand border border-ui-border shadow-subtle hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
                        >
                            {/* Product Image */}
                            <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    onError={(e) => {
                                        if (e.currentTarget.src !== new URL(campusImages.unavailable, window.location.origin).href) {
                                            e.currentTarget.src = campusImages.unavailable;
                                        }
                                    }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Category Badge overlay */}
                                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-brand-primary/80 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                  {product.category || 'General'}
                </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-lg font-black text-brand-primary">
                      R {Number(product.price).toFixed(2)}
                    </span>
                                        {product.seller_name && (
                                            <span className="text-[11px] font-bold text-muted">
                        by {product.seller_name}
                      </span>
                                        )}
                                    </div>

                                    <h2 className="font-bold text-primary text-sm line-clamp-1 group-hover:text-brand-accent transition-colors" title={product.title}>
                                        {product.title}
                                    </h2>
                                    <p className="text-muted text-xs line-clamp-2 mt-1 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                    className={`w-full mt-4 py-2.5 px-4 rounded-brand font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                                        addedId === product.id
                                            ? 'bg-emerald-600 text-white shadow'
                                            : 'bg-brand-primary hover:bg-brand-primary/90 text-white shadow-subtle'
                                    }`}
                                >
                                    {addedId === product.id ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Added to Bag
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                </>
            )}
            {/* PRODUCT DETAIL MODAL */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-sm animate-fadeIn">
                    {/* Click outside backdrop to close */}
                    <div className="absolute inset-0" onClick={() => setSelectedProduct(null)}></div>

                    <div className="relative bg-card rounded-brand border border-ui-border shadow-2xl max-w-lg w-full overflow-hidden z-10 flex flex-col max-h-[90vh]">

                        {/* Close 'X' Button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-brand-primary/80 text-white flex items-center justify-center hover:bg-brand-primary transition-colors"
                        >
                            ✕
                        </button>

                        {/* Large Image */}
                        <div className="w-full h-64 bg-slate-100 relative overflow-hidden">
                            <img
                                src={selectedProduct.image_url}
                                alt={selectedProduct.title}
                                onError={(e) => {
                                    if (e.currentTarget.src !== new URL(campusImages.unavailable, window.location.origin).href) {
                                        e.currentTarget.src = campusImages.unavailable;
                                    }
                                }}
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-3 left-3 px-3 py-1 bg-brand-primary/90 text-white text-xs font-bold uppercase tracking-wider rounded-md">
          {selectedProduct.category}
        </span>
                        </div>

                        {/* Details Body */}
                        <div className="p-6 overflow-y-auto">
                            <div className="flex justify-between items-baseline mb-2">
          <span className="text-2xl font-black text-brand-primary">
            R {Number(selectedProduct.price).toFixed(2)}
          </span>

                                {/* Trust Badge */}
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            ✓ Verified Seller: {selectedProduct.seller_name || 'CPUT Student'}
          </span>
                            </div>

                            <h2 className="text-xl font-extrabold text-primary mb-3">
                                {selectedProduct.title}
                            </h2>

                            <p className="text-muted text-sm leading-relaxed mb-6">
                                {selectedProduct.description}
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={() => {
                                    handleAddToCart(selectedProduct);
                                    setSelectedProduct(null); // Close modal on add
                                }}
                                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3.5 rounded-brand transition-colors flex items-center justify-center gap-2 shadow-subtle"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Add to Cart (R {Number(selectedProduct.price).toFixed(2)})
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}