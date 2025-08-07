import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretDown from '../Icon/IconCaretDown';

const ZirconNavbar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.dropdown-menu') && !target.closest('button')) {
                setCurrentMenu('');
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

    type NavItem = {
        label: string;
        icon?: JSX.Element;
        link?: string;
        key: string;
        children?: { label: string; link: string }[];
        isNew?: boolean;
        isHot?: boolean;
    };

    const navigationItems: NavItem[] = [
        {
            label: t('Home'),
            link: '/',
            key: 'home',
        },
        {
            label: t('Domains'),
            key: 'domains',
            children: [
                { label: t('Register Domain'), link: '/domains/register' },
                { label: t('Transfer Domain'), link: '/domains/transfer' },
                { label: t('Domain Search'), link: '/domains/search' },
                { label: t('Manage Domains'), link: '/domains/manage' },
            ],
        },
        {
            label: t('Billing'),
            // icon: <IconBilling className="group-hover:!text-blue-600 shrink-0" />,
            key: 'billing',
            children: [
                { label: t('My Invoices'), link: '/billing/invoices' },
                { label: t('Payment Methods'), link: '/billing/payment-methods' },
                { label: t('Billing History'), link: '/billing/history' },
            ],
        },
        {
            label: t('Support'),
            // icon: <IconSupport className="group-hover:!text-blue-600 shrink-0" />,
            key: 'support',
            children: [
                { label: t('Submit Ticket'), link: '/support/create-ticket' },
                { label: t('My Tickets'), link: '/support/my-tickets' },
                { label: t('Knowledge Base'), link: '/support/knowledge-base' },
                { label: t('Contact Us'), link: '/support/contact' },
            ],
        },
        {
            label: t('Hosting'),
            // icon: <IconHosting className="group-hover:!text-blue-600 shrink-0" />,
            key: 'hosting',
            isHot: true,
            children: [
                { label: t('Shared Hosting'), link: '/hosting/shared' },
                { label: t('VPS Hosting'), link: '/hosting/vps' },
                { label: t('Dedicated Servers'), link: '/hosting/dedicated' },
                { label: t('Cloud Hosting'), link: '/hosting/cloud' },
            ],
        },
        {
            label: t('SMS Gateway'),
            //  icon: <IconSMS className="group-hover:!text-blue-600 shrink-0" />,
            key: 'sms',
            isNew: true,
            children: [
                { label: t('Send SMS'), link: '/sms/send' },
                { label: t('SMS History'), link: '/sms/history' },
                { label: t('API Documentation'), link: '/sms/api-docs' },
            ],
        },
        {
            label: t('Web Design'),
            // icon: <IconWebDesign className="group-hover:!text-blue-600 shrink-0" />,
            link: '/web-design',
            key: 'web-design',
        },
    ];

    return (
        <div className={semidark ? 'dark' : ''}>
            {/* Top Contact Bar */}
            <div className="bg-blue-600/80 backdrop-blur-md text-white py-2 px-4 text-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            contact@yourdomain.com
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            07777 00 255
                        </span>
                        <button className="text-white hover:text-blue-200 transition-colors">Support Center</button>
                        <button className="text-white hover:text-blue-200 transition-colors">Affiliates</button>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="bg-transparent shadow-none border-none sticky top-0 z-50">
                <div className="relative">
                    {/* Subtle Decorative Elements */}
                    <div className="absolute top-2 left-8 w-8 h-8 bg-blue-100/50 dark:bg-blue-900/30 rounded-full blur-lg"></div>
                    <div className="absolute top-2 right-8 w-6 h-6 bg-blue-200/50 dark:bg-blue-800/30 rounded-full blur-lg"></div>
                    <div className="absolute top-4 left-1/2 w-4 h-4 bg-blue-100/30 dark:bg-blue-900/20 rounded-full blur-sm"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                {/* Logo Section */}
                                <div className="flex items-center">
                                    <NavLink to="/" className="main-logo flex items-center shrink-0 group">
                                        <div className="relative">
                                            <img className="relative w-8 h-8 flex-none" src="/assets/images/logo.svg" alt="Zircon" />
                                        </div>
                                        <span className="text-2xl ltr:ml-3 rtl:mr-3 font-bold align-middle lg:inline text-dark dark:text-white group-hover:text-blue-200 dark:group-hover:text-blue-200 transition-colors duration-300">
                                            UPS
                                        </span>
                                    </NavLink>
                                </div>

                                {/* Navigation Menu */}
                                <div className="hidden lg:flex items-center space-x-1">
                                    {navigationItems.map((item) => (
                                        <div className="relative dropdown-menu" key={item.key}>
                                            {item.children ? (
                                                // Menu item with dropdown
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        className={`${
                                                            currentMenu === item.key ? 'text-white bg-white/20' : 'text-white/90 hover:text-white'
                                                        } flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 relative`}
                                                        onClick={() => toggleMenu(item.key)}
                                                    >
                                                        {item.icon && <div className="w-4 h-4 mr-2">{item.icon}</div>}
                                                        {item.label}
                                                        {item.isNew && <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>}
                                                        {item.isHot && <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">Hot</span>}
                                                        <div className={`ml-1 transition-transform duration-300 ${currentMenu === item.key ? 'rotate-180' : ''}`}>
                                                            <IconCaretDown className="w-3 h-3" />
                                                        </div>
                                                    </button>

                                                    {/* Professional Dropdown */}
                                                    <div
                                                        className={`absolute top-full left-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 ${
                                                            currentMenu === item.key ? 'block' : 'hidden'
                                                        }`}
                                                        style={{ zIndex: 999999 }}
                                                    >
                                                        {item.children.map((child) => (
                                                            <NavLink
                                                                key={child.link}
                                                                to={child.link}
                                                                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500 ml-2 mr-2 rounded"
                                                                onClick={() => setCurrentMenu('')}
                                                            >
                                                                {child.label}
                                                            </NavLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                // Single menu item
                                                <NavLink
                                                    to={item.link!}
                                                    className={({ isActive }) =>
                                                        `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                                                            isActive ? 'text-white bg-white/20' : 'text-white/90 hover:text-white hover:bg-white/10'
                                                        }`
                                                    }
                                                >
                                                    {item.icon && <div className="w-4 h-4 mr-2">{item.icon}</div>}
                                                    {item.label}
                                                    {item.isNew && <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>}
                                                    {item.isHot && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">Hot</span>}
                                                </NavLink>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Right Section - Login/Account Button */}
                                <div className="hidden md:flex items-center space-x-4">
                                    <button className="bg-yellow-300 hover:bg-blue-700 text-dark px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">navod</button>
                                </div>

                                {/* Mobile Menu Button */}
                                <div className="lg:hidden">
                                    <button
                                        type="button"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700/40 text-gray-700 dark:text-gray-200 transition-all duration-300"
                                        onClick={() => dispatch(toggleSidebar())}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Menu */}
                            <div className={`lg:hidden transition-all duration-300 overflow-hidden ${themeConfig.sidebar ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200/30 dark:border-gray-700/30 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md rounded-b-lg">
                                    {navigationItems.map((item) => (
                                        <div key={item.key}>
                                            {item.children ? (
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-all duration-300"
                                                        onClick={() => toggleMenu(item.key)}
                                                    >
                                                        <div className="flex items-center">
                                                            {item.icon && <div className="w-5 h-5 mr-3">{item.icon}</div>}
                                                            <span className="flex items-center">
                                                                {item.label}
                                                                {item.isNew && <span className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>}
                                                                {item.isHot && <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">Hot</span>}
                                                            </span>
                                                        </div>
                                                        <div className={`transition-transform duration-300 ${currentMenu === item.key ? 'rotate-180' : ''}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <AnimateHeight duration={300} height={currentMenu === item.key ? 'auto' : 0}>
                                                        <div className="ml-8 mt-1 space-y-1">
                                                            {item.children.map((child) => (
                                                                <NavLink
                                                                    key={child.link}
                                                                    to={child.link}
                                                                    className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                                                                    onClick={() => dispatch(toggleSidebar())}
                                                                >
                                                                    {child.label}
                                                                </NavLink>
                                                            ))}
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            ) : (
                                                <NavLink
                                                    to={item.link!}
                                                    className={({ isActive }) =>
                                                        `flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                                                            isActive
                                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                                                : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                                        }`
                                                    }
                                                    onClick={() => dispatch(toggleSidebar())}
                                                >
                                                    {item.icon && <div className="w-5 h-5 mr-3">{item.icon}</div>}
                                                    <span className="flex items-center">
                                                        {item.label}
                                                        {item.isNew && <span className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>}
                                                        {item.isHot && <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">Hot</span>}
                                                    </span>
                                                </NavLink>
                                            )}
                                        </div>
                                    ))}

                                    {/* Mobile Login Button */}
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">navod</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default ZirconNavbar;
