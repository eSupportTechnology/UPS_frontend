import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { logoutUser } from '../../store/authSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretDown from '../Icon/IconCaretDown';

const Navbar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const { isLoading, user } = useSelector((state: IRootState) => state.auth);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const getUserInitials = (name?: string) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    const getUserFirstName = (name?: string) => {
        if (!name) return 'User';
        return name.split(' ')[0];
    };

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
        <div className={`${semidark ? 'dark' : ''} sticky top-0 z-50`}>
            {/* Professional Top Contact Bar */}
            <div className="bg-gradient-to-r from-primary via-primary-dark to-primary bg-opacity-95 backdrop-blur-md text-white py-2 px-4 text-sm shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center group cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2 group-hover:bg-white/20 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <span className="font-medium">support@ups.lk</span>
                        </div>
                        <div className="hidden md:flex items-center">
                            <div className="w-1 h-1 rounded-full bg-white/40 mx-3"></div>
                            <span className="text-white/80 text-xs">Available 24/7</span>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center space-x-6">
                        <div className="flex items-center group cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2 group-hover:bg-white/20 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </div>
                            <span className="font-medium">077 77 00 255</span>
                        </div>
                        <div className="h-4 w-px bg-white/20"></div>
                        <button className="px-3 py-1 text-white/90 hover:text-white transition-colors font-medium text-sm">
                            Support Center
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Main Navigation */}
            <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-none">
                <div className="relative">
                    {/* Elegant gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-white/10 to-purple-50/20 dark:from-gray-800/20 dark:via-gray-900/10 dark:to-gray-800/20"></div>

                    {/* Subtle decorative elements */}
                    <div className="absolute top-3 left-12 w-6 h-6 bg-primary/5 rounded-full blur-xl"></div>
                    <div className="absolute top-1 right-16 w-8 h-8 bg-primary/8 rounded-full blur-lg"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16 py-2">
                                {/* Clean Logo Section */}
                                <div className="flex items-center">
                                    <NavLink to="/" className="main-logo flex items-center shrink-0 group">
                                        <img className="w-8 h-8 flex-none" src="/assets/images/logo.svg" alt="UPS" />
                                        <div className="ltr:ml-4 rtl:mr-4">
                                            <div className="text-2xl font-bold align-middle lg:inline text-gray-800 dark:text-white group-hover:text-primary transition-colors duration-300">
                                                UPS
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none">
                                                Client Portal
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>

                                {/* Professional Navigation Menu */}
                                <div className="hidden lg:flex items-center space-x-2 ml-auto mr-8">
                                    {navigationItems.map((item) => (
                                        <div className="relative dropdown-menu" key={item.key}>
                                            {item.children ? (
                                                // Menu item with dropdown
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        className={`${
                                                            currentMenu === item.key
                                                                ? 'text-primary bg-primary/10 border-primary/20 shadow-sm'
                                                                : 'text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-primary/5'
                                                        } flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-transparent hover:border-primary/10 hover:shadow-sm relative`}
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
                                                                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 border-l-2 border-transparent hover:border-primary ml-2 mr-2 rounded"
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
                                                        `flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-transparent hover:border-primary/10 hover:shadow-sm relative ${
                                                            isActive
                                                                ? 'text-primary bg-primary/10 border-primary/20 shadow-sm'
                                                                : 'text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-primary/5'
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

                                {/* Clean User Profile Section */}
                                <div className="hidden md:flex items-center space-x-4">
                                    <div className="relative dropdown-menu">
                                        <button
                                            type="button"
                                            className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors duration-300 flex items-center space-x-2 text-sm font-medium"
                                            onClick={() => toggleMenu('profile')}
                                        >
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                                {getUserInitials(user?.name)}
                                            </div>
                                            <span>{getUserFirstName(user?.name)}</span>
                                            <div className={`transition-transform duration-300 ${currentMenu === 'profile' ? 'rotate-180' : ''}`}>
                                                <IconCaretDown className="w-3 h-3" />
                                            </div>
                                        </button>

                                        {/* Profile Dropdown */}
                                        <div
                                            className={`absolute top-full right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${
                                                currentMenu === 'profile' ? 'block' : 'hidden'
                                            }`}
                                            style={{ zIndex: 999999 }}
                                        >
                                            {/* User Info Header */}
                                            <div className="px-4 py-3 bg-primary/5 dark:bg-primary/10 border-b border-primary/20 dark:border-primary/30">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">{getUserInitials(user?.name)}</div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <NavLink
                                                    to="/customer/profile"
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200"
                                                    onClick={() => setCurrentMenu('')}
                                                >
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    My Profile
                                                </NavLink>
                                            </div>

                                            {/* Separator */}
                                            <div className="border-t border-gray-200/50 dark:border-gray-700/50"></div>

                                            {/* Logout Button */}
                                            <div className="py-2">
                                                <button
                                                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50"
                                                    onClick={handleLogout}
                                                    disabled={isLoading}
                                                >
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
                                                </button>
                                            </div>
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
                                                                    className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
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
                                                                ? 'text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10'
                                                                : 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10'
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
                                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">{getUserInitials(user?.name)}</div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <NavLink
                                                    to="/customer/profile"
                                                    className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
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

export default Navbar;
