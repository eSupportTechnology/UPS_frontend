import React from 'react';
import { useTranslation } from 'react-i18next';

const UserFooter = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-screen">
                <div className="absolute inset-0 bg-primary"></div>

                <div className="relative">
                    {/* Main Footer Content */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Company Info */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center p-2">
                                        <img className="w-full h-full flex-none" src="/assets/images/logo.svg" alt="logo" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">UPS Support</h3>
                                </div>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    Your trusted partner for comprehensive customer support solutions. We're committed to delivering exceptional service and innovative ticketing solutions.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            Dashboard
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            Create Ticket
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            All Tickets
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            Knowledge Base
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            FAQ
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            Help Center
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            Contact Us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            System Status
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            API Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                                            Community
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-white/90 text-sm">
                                            123 Business Avenue
                                            <br />
                                            Suite 100, City 12345
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        <p className="text-white/90 text-sm">+1 (555) 123-4567</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p className="text-white/90 text-sm">support@ups-support.com</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-white/90 text-sm">24/7 Support Available</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-8 pt-6">
                            <div className="border-t border-white/20"></div>
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 mt-3">
                                <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                                    <p className="text-white/90 text-sm">© {currentYear} UPS Support. All rights reserved.</p>
                                    <div className="flex items-center space-x-6">
                                        <a href="#" className="text-white/80 hover:text-white text-sm transition-colors duration-200">
                                            Privacy Policy
                                        </a>
                                        <a href="#" className="text-white/80 hover:text-white text-sm transition-colors duration-200">
                                            Terms of Service
                                        </a>
                                        <a href="#" className="text-white/80 hover:text-white text-sm transition-colors duration-200">
                                            Cookie Policy
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer to maintain layout */}
            <div className="h-48"></div>
        </footer>
    );
};

export default UserFooter;
