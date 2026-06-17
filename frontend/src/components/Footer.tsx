import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
    <footer className="w-full bg-brand-primary mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Column 1: Brand & Mission */}
                <div className="md:col-span-1">
                    <Link to="/dashboard" className="text-xl font-extrabold text-white tracking-tight block mb-3">
                        Campus Market
                    </Link>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                        A trusted, mobile-first marketplace designed to connect students, faculty, and local vendors. Promoting affordability and sustainability.
                    </p>
                </div>

                {/* Column 2: Marketplace */}
                <div>
                    <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Marketplace</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/products" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Browse Products</Link></li>
                        <li><Link to="/textbooks" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Second-hand Textbooks</Link></li>
                        <li><Link to="/electronics" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Electronics</Link></li>
                        <li><Link to="/create-listing" className="text-brand-accent hover:text-white transition-colors font-bold">Sell an Item</Link></li>
                    </ul>
                </div>

                {/* Column 3: Community Hub */}
                <div>
                    <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Community</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/bulletin" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Bulletin Board</Link></li>
                        <li><Link to="/events" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Campus Events</Link></li>
                        <li><Link to="/services" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Student Services</Link></li>
                        <li><Link to="/clubs" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Clubs & Societies</Link></li>
                    </ul>
                </div>

                {/* Column 4: Legal & Support */}
                <div>
                    <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Support</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/help" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Help Center</Link></li>
                        <li><Link to="/safety" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Trust & Safety</Link></li>
                        <li><Link to="/terms" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Terms of Service</Link></li>
                        <li><Link to="/privacy" className="text-slate-300 hover:text-brand-accent transition-colors font-medium">Privacy Policy</Link></li>
                    </ul>
                </div>

            </div>

            {/* Bottom Copyright Row */}
            <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-400 font-medium">
                    &copy; {currentYear} Campus Market. All rights reserved.
                </p>
                <div className="flex gap-4">
            <span className="text-xs text-slate-300 font-bold bg-white/5 px-3 py-1.5 rounded-md border border-white/10 backdrop-blur-sm">
              PRM370/371/372S Project Demo
            </span>
                </div>
            </div>
        </div>
    </footer>
);
}