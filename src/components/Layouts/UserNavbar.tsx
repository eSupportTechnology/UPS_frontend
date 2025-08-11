import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { logoutUser } from '../../store/authSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretDown from '../Icon/IconCaretDown';

const ZirconNavbar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const { isLoading } = useSelector((state: IRootState) => state.auth);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser() as any).unwrap();
            setCurrentMenu('');
            navigate('/login', { replace: true });
        } catch (error: any) {
            console.error('Logout error:', error);
            setCurrentMenu('');
            navigate('/login', { replace: true });
        }
    };

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
            link: '/customer/dashboard',
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
            label: t('Tickets'),
            //  icon: <IconSMS className="group-hover:!text-blue-600 shrink-0" />,
            key: 'tickets',
            children: [
                { label: t('Create Ticket'), link: '/customer/ticket/create-ticket' },
                { label: t('All Tickets'), link: '/customer/ticket/all-tickets' },
            ],
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

                                {/* Right Section - User Profile Dropdown */}
                                <div className="hidden md:flex items-center space-x-4">
                                    <div className="relative dropdown-menu">
                                        <button
                                            type="button"
                                            className={`${
                                                currentMenu === 'profile' ? 'bg-blue-600 text-white' : 'bg-yellow-300 hover:bg-blue-700 text-dark hover:text-white'
                                            } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2`}
                                            onClick={() => toggleMenu('profile')}
                                        >
                                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">N</div>
                                            <span>navod</span>
                                            <div className={`transition-transform duration-300 ${currentMenu === 'profile' ? 'rotate-180' : ''}`}>
                                                <IconCaretDown className="w-3 h-3" />
                                            </div>
                                        </button>

                                        {/* Profile Dropdown */}
                                        <div
                                            className={`absolute top-full right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 ${
                                                currentMenu === 'profile' ? 'block' : 'hidden'
                                            }`}
                                            style={{ zIndex: 999999 }}
                                        >
                                            <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">Navod Perera</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">navod@example.com</p>
                                            </div>
                                            <NavLink
                                                to="/customer/profile"
                                                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500 ml-2 mr-2 rounded"
                                                onClick={() => setCurrentMenu('')}
                                            >
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    My Profile
                                                </div>
                                            </NavLink>
                                            <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-1"></div>
                                            <button
                                                className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 rounded mx-2 disabled:opacity-50"
                                                onClick={handleLogout}
                                                disabled={isLoading}
                                            >
                                                <div className="flex items-center">
                                                    {isLoading ? (
                                                        <svg className="w-4 h-4 mr-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                            />
                                                        </svg>
                                                    )}
                                                    {isLoading ? 'Logging Out...' : 'Logout'}
                                                </div>
                                            </button>
                                        </div>
                                    </div>
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

                                    {/* Mobile Profile Section */}
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="px-3 py-2">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">N</div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Navod Perera</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">navod@example.com</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <NavLink
                                                    to="/customer/profile"
                                                    className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                                                    onClick={() => dispatch(toggleSidebar())}
                                                >
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                            />
                                                        </svg>
                                                        My Profile
                                                    </div>
                                                </NavLink>
                                                <button
                                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 disabled:opacity-50"
                                                    onClick={() => {
                                                        dispatch(toggleSidebar());
                                                        handleLogout();
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    <div className="flex items-center">
                                                        {isLoading ? (
                                                            <svg className="w-4 h-4 mr-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                                />
                                                            </svg>
                                                        )}
                                                        {isLoading ? 'Logging Out...' : 'Logout'}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
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
