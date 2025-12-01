import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-brand-brown-dark text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                
                {/* Column 1: Brand Info */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-brand-gold">Al Asad Foundation</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                        Dedicated to transforming lives through Qur'an-centered education, community development, and humanitarian aid across Nigeria.
                    </p>
                    <div className="flex space-x-4 pt-2">
                        <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition"><Facebook className="w-4 h-4" /></a>
                        <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition"><Twitter className="w-4 h-4" /></a>
                        <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition"><Instagram className="w-4 h-4" /></a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-6 border-b border-brand-gold/30 pb-2 inline-block">Quick Links</h4>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li><Link href="/about" className="hover:text-brand-gold transition flex items-center gap-2">About Us</Link></li>
                        <li><Link href="/programs" className="hover:text-brand-gold transition flex items-center gap-2">Our Programs</Link></li>
                        <li><Link href="/news" className="hover:text-brand-gold transition flex items-center gap-2">News & Updates</Link></li>
                        <li><Link href="/contact" className="hover:text-brand-gold transition flex items-center gap-2">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Column 3: Get Involved */}
                <div>
                    <h4 className="text-lg font-semibold mb-6 border-b border-brand-gold/30 pb-2 inline-block">Get Involved</h4>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li><Link href="/donate" className="hover:text-brand-gold transition">Make a Donation</Link></li>
                        <li><Link href="/volunteer" className="hover:text-brand-gold transition">Volunteer With Us</Link></li>
                        <li><Link href="/partners" className="hover:text-brand-gold transition">Become a Partner</Link></li>
                        <li><Link href="/admin" className="hover:text-brand-gold transition">Staff Portal</Link></li>
                    </ul>
                </div>

                {/* Column 4: Contact Info */}
                <div>
                    <h4 className="text-lg font-semibold mb-6 border-b border-brand-gold/30 pb-2 inline-block">Contact Us</h4>
                    <ul className="space-y-4 text-sm text-gray-300">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
                            <span>Mani Road, Opp. Gidan Dawa Primary School, Katsina, Katsina State.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                            <span>08067168669</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                            <span>alaseducationfoundation@yahoo.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Al Asad Education Foundation. All rights reserved.</p>
            </div>
        </footer>
    );
};