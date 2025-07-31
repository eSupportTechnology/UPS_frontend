import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';

import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconCaretDown from '../Icon/IconCaretDown';

const Sidebar = () => {
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
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

    const sidebarItems = [
        {
            label: t('Users'),
            icon: <IconMenuUsers className="group-hover:!text-primary shrink-0" />,
            key: 'users',
            children: [
                { label: t('Add'), link: '/super-admin/user-create' },
                { label: t('All'), link: '/super-admin/all-user' },
            ],

        },
        {
            label: t('Inventory'),
            icon: <IconMenuUsers className="group-hover:!text-primary shrink-0" />,
            key: 'inventory',
            children: [
                { label: t('Add'), link: '/super-admin/inventory-create' },
                { label: t('All'), link: '/super-admin/all-inventory' },
            ],

        },
        {
            label: t('Branches'),
            icon: <IconMenuUsers className="group-hover:!text-primary shrink-0" />,
            key: 'branches',
            children: [
                { label: t('Add'), link: '/super-admin/create-branch' },
                { label: t('All'), link: '/super-admin/all-branches' },
            ],

        },

    ];

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ml-[5px] flex-none" src="/assets/images/logo.svg" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">
                                {t('UPS')}
                            </span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {sidebarItems.map((item) => (
                                <li className="menu nav-item" key={item.key}>
                                    <button
                                        type="button"
                                        className={`${currentMenu === item.key ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => toggleMenu(item.key)}
                                    >
                                        <div className="flex items-center">
                                            {item.icon}
                                            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                {item.label}
                                            </span>
                                        </div>
                                        <div className={currentMenu !== item.key ? 'rtl:rotate-90 -rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === item.key ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {item.children.map((child) => (
                                                <li key={child.link}>
                                                    <NavLink to={child.link}>{child.label}</NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            ))}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
