import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';

import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuContract from '../Icon/Menu/IconMenuContract';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';

const UserNavbar = () => {
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
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }

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

    type SidebarItem = {
        label: string;
        icon: JSX.Element;
        link?: string;
        key: string;
        children?: { label: string; link: string }[];
    };

    const sidebarItems: SidebarItem[] = [
        {
            label: t('Dashboard'),
            icon: <IconMenuDashboard className="group-hover:!text-primary shrink-0" />,
            link: '/customer/dashboard',
            key: 'dashboard',
        },
        {
            label: t('Ticket'),
            icon: <IconMenuChat className="group-hover:!text-primary shrink-0" />,
            key: 'ticket',
            children: [
                { label: t('Create Ticket'), link: '/customer/ticket/create-ticket' },
                { label: t('All Tickets'), link: '/customer/ticket/all-tickets' },
            ],
        },
    ];

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav className={`navbar fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
                {/* Professional White Background */}
                <div className="relative">
                    {/* Multi-layered White Background */}
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 backdrop-blur-sm"></div>
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl border-b border-gray-200 dark:border-gray-700"></div>

                    {/* Subtle Decorative Elements */}
                    <div className="absolute top-2 left-8 w-8 h-8 bg-gray-100/50 dark:bg-gray-700/30 rounded-full blur-lg"></div>
                    <div className="absolute top-2 right-8 w-6 h-6 bg-gray-200/50 dark:bg-gray-600/30 rounded-full blur-lg"></div>
                    <div className="absolute top-4 left-1/2 w-4 h-4 bg-gray-100/30 dark:bg-gray-700/20 rounded-full blur-sm"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                {/* Logo Section */}
                                <div className="flex items-center">
                                    <NavLink to="/customer/dashboard" className="main-logo flex items-center shrink-0 group">
                                        <div className="relative">
                                            <img className="relative w-8 ml-[5px] flex-none" src="/assets/images/logo.svg" alt="logo" />
                                        </div>
                                        <span className="text-2xl ltr:ml-3 rtl:mr-3 font-bold align-middle lg:inline text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            {t('UPS')}
                                        </span>
                                    </NavLink>
                                </div>

                                {/* Navigation Menu */}
                                <div className="hidden md:flex items-center space-x-8">
                                    {sidebarItems.map((item) => (
                                        <div className="relative dropdown-menu" key={item.key}>
                                            {item.children ? (
                                                // Menu item with dropdown
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        className={`${currentMenu === item.key ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'} flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/40`}
                                                        onClick={() => {
                                                            const newMenu = currentMenu === item.key ? '' : item.key;
                                                            setCurrentMenu(newMenu);
                                                        }}
                                                    >
                                                        <div className="w-5 h-5 mr-2">{item.icon}</div>
                                                        {item.label}
                                                        <div className={`ml-1 transition-transform duration-300 ${currentMenu === item.key ? 'rotate-0' : '-rotate-90'}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>

                                                    {/* Professional Dropdown - Clean white styling */}
                                                    <div
                                                        className={`absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 ${
                                                            currentMenu === item.key ? 'block' : 'hidden'
                                                        }`}
                                                        style={{
                                                            zIndex: 999999,
                                                        }}
                                                    >
                                                        {item.children.map((child) => (
                                                            <NavLink
                                                                key={child.link}
                                                                to={child.link}
                                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 rounded-lg mx-1"
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
                                                        `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                                            isActive
                                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                                                : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/40'
                                                        }`
                                                    }
                                                >
                                                    <div className="w-5 h-5 mr-2">{item.icon}</div>
                                                    {item.label}
                                                </NavLink>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Menu Button */}
                                <div className="md:hidden">
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
                            <div className={`md:hidden transition-all duration-300 overflow-hidden ${themeConfig.sidebar ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-lg">
                                    {sidebarItems.map((item) => (
                                        <div key={item.key}>
                                            {item.children ? (
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-all duration-300"
                                                        onClick={() => toggleMenu(item.key)}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="w-5 h-5 mr-3">{item.icon}</div>
                                                            {item.label}
                                                        </div>
                                                        <div className={`transition-transform duration-300 ${currentMenu === item.key ? '' : '-rotate-90'}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <AnimateHeight duration={300} height={currentMenu === item.key ? 'auto' : 0}>
                                                        <div className="ml-8 mt-1 space-y-1">
                                                            {item.children.map((child) => (
                                                                <NavLink
                                                                    key={child.link}
                                                                    to={child.link}
                                                                    className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-all duration-300"
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
                                                                : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/40'
                                                        }`
                                                    }
                                                    onClick={() => dispatch(toggleSidebar())}
                                                >
                                                    <div className="w-5 h-5 mr-3">{item.icon}</div>
                                                    {item.label}
                                                </NavLink>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default UserNavbar;
