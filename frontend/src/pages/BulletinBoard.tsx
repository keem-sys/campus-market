import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface BulletinPost {
    id: string;
    title: string;
    content: string;
    type: 'event' | 'announcement' | 'service' | 'club_promo';
    author_name?: string;
    author_role?: string;
    created_at: string;
    expires_at: string;
}

interface NewPostInputs {
    title: string;
    content: string;
    type: 'event' | 'announcement' | 'service' | 'club_promo';
    durationDays: number;
}

const MOCK_POSTS: BulletinPost[] = [
    {
        id: 'post-1',
        title: 'CPUT Annual Tech Hackathon 2026 🚀',
        content: 'Join us at the Bellville IT Labs for a 24-hour coding challenge! Prizes, free pizza, and mentorship from industry tech sponsors. Teams of 2 to 4.',
        type: 'event',
        author_name: 'IT Society Committee',
        author_role: 'faculty',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days left
    },
    {
        id: 'post-2',
        title: 'Peer Tutoring: Java & Database Systems (PRM/PRG)',
        content: 'Offering affordable group or 1-on-1 tutoring sessions on weekends. R50/hour. Focus on exam preparation and SQL query optimization.',
        type: 'service',
        author_name: 'Siphesihle M.',
        author_role: 'student',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'post-3',
        title: 'Lost Student Card & Dorm Keys 🔑',
        content: 'Found a student card near the Engineering Library entrance yesterday afternoon. Handed in at Campus Security desk.',
        type: 'announcement',
        author_name: 'David K.',
        author_role: 'student',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'post-4',
        title: 'Green Campus Initiative: Textbook & E-Waste Drive 🌱',
        content: 'Donate old, unused cables, electronic accessories, and non-curriculum books at the Student Center. Help us promote campus sustainability!',
        type: 'club_promo',
        author_name: 'Eco-Campus Club',
        author_role: 'student',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'post-5',
        title: 'Safe Trade Point Update: Library Foyer Pickup Zone',
        content: 'For student-to-student sales, Security confirms the Main Library foyer as a monitored daytime meetup point. Avoid off-campus cash handovers where possible.',
        type: 'announcement',
        author_name: 'Campus Safety Office',
        author_role: 'faculty',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'post-6',
        title: 'Affordable Graphing Calculator Repairs (Student Discount)',
        content: 'Verified Bellville vendor offers same-day checks for Casio/TI calculators used in Maths and Engineering modules. Bring student card for discounted labour.',
        type: 'service',
        author_name: 'TechFix Bellville',
        author_role: 'faculty',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'post-7',
        title: 'District Six Bookstore: Prescribed Textbook Clearance',
        content: 'Partner vendor near District Six campus is running a week-long discount on Economics and Project Management prescribed titles for registered students.',
        type: 'service',
        author_name: 'CampusBooks D6',
        author_role: 'faculty',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'post-8',
        title: 'Scam Alert: Verify Seller Identity Before Payment',
        content: 'Student Affairs reminds buyers to confirm profile identity and item details before making EFT payments. Report suspicious listings immediately for review.',
        type: 'announcement',
        author_name: 'Student Affairs',
        author_role: 'faculty',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'post-9',
        title: 'Engineering Society Bulk Buy: Drawing Instruments',
        content: 'Group order opened for first-year engineering kits (set squares, compasses, mechanical pencils) at reduced pricing. Collection on campus only.',
        type: 'club_promo',
        author_name: 'Engineering Student Society',
        author_role: 'student',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString()
    }
];

const CATEGORIES = [
    { label: 'All Posts', value: 'all' },
    { label: 'Events 🎟️', value: 'event' },
    { label: 'Announcements 📢', value: 'announcement' },
    { label: 'Services 🛠️', value: 'service' },
    { label: 'Clubs & Societies 🤝', value: 'club_promo' },
];

export default function BulletinBoard() {
    const [posts, setPosts] = useState<BulletinPost[]>(MOCK_POSTS);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useAuthStore((state) => state.user);
    const session = useAuthStore((state) => state.session);
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<NewPostInputs>({
        defaultValues: { type: 'event', durationDays: 14 }
    });

    // Fetch posts from Express backend API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/bulletin_posts`);
                if (res.data && res.data.length > 0) {
                    setPosts(res.data);
                }
            } catch (err) {
                console.warn('Backend API unavailable. Using mock bulletin posts.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleOpenCreateModal = () => {
        if (!user) {
            navigate('/login');
        } else {
            setIsModalOpen(true);
        }
    };

    const onSubmitPost = async (formData: NewPostInputs) => {
        try {
            const expiresDate = new Date();
            expiresDate.setDate(expiresDate.getDate() + Number(formData.durationDays));

            const newPostData = {
                title: formData.title,
                content: formData.content,
                type: formData.type,
                expires_at: expiresDate.toISOString(),
            };

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            // Try to save to backend API if session exists
            if (session?.access_token) {
                const res = await axios.post(`${apiUrl}/api/bulletin_posts`, newPostData, {
                    headers: { Authorization: `Bearer ${session.access_token}` }
                });
                if (res.data?.post) {
                    setPosts([res.data.post, ...posts]);
                }
            } else {
                // Local state fallback
                const localPost: BulletinPost = {
                    id: `local-${Date.now()}`,
                    ...newPostData,
                    author_name: user?.user_metadata?.name || 'CPUT Member',
                    author_role: user?.user_metadata?.role || 'student',
                    created_at: new Date().toISOString()
                };
                setPosts([localPost, ...posts]);
            }

            setIsModalOpen(false);
            reset();
        } catch (err: unknown) {
            console.error('Failed to publish post:', err);
        }
    };

    const filteredPosts = posts.filter(
        (post) => selectedCategory === 'all' || post.type === selectedCategory
    );

    // Badge Color Mapper
    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'event':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'service':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'club_promo':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';
        }
    };

    // Helper to calculate days remaining
    const getDaysRemaining = (expiresAt: string) => {
        const diff = new Date(expiresAt).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days}d left` : 'Expiring soon';
    };

    return (
        <div className="min-h-screen bg-app py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

            {/* 1. Header & Create Post Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-ui-border pb-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                        Community Bulletin Board 📌
                    </h1>
                    <p className="text-muted text-sm mt-1 max-w-xl">
                        Campus announcements, event notices, study groups, and student club promotions in one place.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreateModal}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2.5 px-5 rounded-brand transition-colors flex items-center gap-2 shadow-subtle text-sm whitespace-nowrap"
                >
                    <span>+</span> Create Post
                </button>
            </div>

            {/* 2. Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`px-4 py-2 rounded-brand text-xs font-bold whitespace-nowrap transition-all border ${
                            selectedCategory === cat.value
                                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                : 'bg-card text-muted border-ui-border hover:border-slate-400 hover:text-primary'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* 3. Bulletin Posts Feed */}
            {loading ? (
                <div className="py-20 text-center text-muted font-bold animate-pulse">
                    Loading active bulletin posts...
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="bg-card rounded-brand border border-ui-border p-12 text-center shadow-subtle my-6">
                    <p className="text-muted text-sm">No active posts found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-card rounded-brand border border-ui-border p-6 shadow-subtle hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div>
                                {/* Post Top Row: Category Badge & Expiration */}
                                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getTypeBadge(post.type)}`}>
                    {post.type.replace('_', ' ')}
                  </span>
                                    <span className="text-[11px] font-bold text-muted bg-app px-2 py-0.5 rounded border border-ui-border">
                    ⏳ {getDaysRemaining(post.expires_at)}
                  </span>
                                </div>

                                {/* Title */}
                                <h2 className="text-lg font-extrabold text-primary mb-2 leading-snug">
                                    {post.title}
                                </h2>

                                {/* Content */}
                                <p className="text-muted text-sm leading-relaxed mb-6 whitespace-pre-line">
                                    {post.content}
                                </p>
                            </div>

                            {/* Author Footer */}
                            <div className="border-t border-ui-border/60 pt-3 flex justify-between items-center text-xs">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {post.author_name || 'CPUT Community Member'}
                </span>
                                <span className="text-[11px] uppercase font-bold text-muted">
                  {post.author_role || 'Student'}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 4. CREATE POST MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-sm animate-fadeIn">
                    <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative bg-card rounded-brand border border-ui-border shadow-2xl max-w-lg w-full p-6 z-10">
                        <div className="flex justify-between items-center mb-4 border-b border-ui-border pb-3">
                            <h2 className="text-xl font-extrabold text-primary">Create Bulletin Post</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-muted hover:text-primary font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmitPost)} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-primary mb-1">Post Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Chemistry Study Group Meeting"
                                    {...register('title', { required: 'Title is required' })}
                                    className="w-full px-3.5 py-2.5 border border-ui-border rounded-brand bg-app text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-primary mb-1">Category</label>
                                    <select
                                        {...register('type')}
                                        className="w-full px-3 py-2.5 border border-ui-border rounded-brand bg-app text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    >
                                        <option value="event">Campus Event 🎟️</option>
                                        <option value="announcement">Announcement 📢</option>
                                        <option value="service">Student Service 🛠️</option>
                                        <option value="club_promo">Club Promo 🤝</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-primary mb-1">Expires After</label>
                                    <select
                                        {...register('durationDays')}
                                        className="w-full px-3 py-2.5 border border-ui-border rounded-brand bg-app text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    >
                                        <option value={7}>7 Days</option>
                                        <option value={14}>14 Days (Standard)</option>
                                        <option value={30}>30 Days</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-primary mb-1">Message Content</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your announcement, event details, or service..."
                                    {...register('content', { required: 'Message content is required' })}
                                    className="w-full px-3.5 py-2.5 border border-ui-border rounded-brand bg-app text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                ></textarea>
                                {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-1/2 py-2.5 border border-ui-border rounded-brand text-xs font-bold text-muted hover:bg-app"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-brand text-xs font-bold shadow-subtle"
                                >
                                    Publish Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}