
import { useState, Fragment, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconListCheck from '../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../components/Icon/IconLayoutGrid';
import IconSearch from '../../components/Icon/IconSearch';
import IconUser from '../../components/Icon/IconUser';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconX from '../../components/Icon/IconX';

const DUMMY_USERS = [
    {
        id: 1, path: 'profile-16.jpeg', name: 'Alice Johnson', role: 'Admin', email: 'alice@mail.com', location: 'New York, USA', phone: '+1 202 555 0101', posts: 12, followers: '2K', following: 150,},
    { id: 2, path: 'profile-34.jpeg', name: 'Bob Smith', role: 'Customer', email: 'bob@mail.com', location: 'London, UK', phone: '+44 20 7946 0958', posts: 8, followers: '1.2K', following: 80 },
    { id: 3, path: 'user-profile.jpeg', name: 'Charlie Lee', role: 'Operator', email: 'charlie@mail.com', location: 'Berlin, Germany', phone: '+49 30 123456', posts: 15, followers: '3K', following: 200 },
    { id: 4, path: 'profile-16.jpeg', name: 'Diana Prince', role: 'Technician', email: 'diana@mail.com', location: 'Paris, France', phone: '+33 1 23456789', posts: 10, followers: '1.5K', following: 120 },
    { id: 5, path: 'profile-34.jpeg', name: 'Ethan Hunt', role: 'Admin', email: 'ethan@mail.com', location: 'Rome, Italy', phone: '+39 06 1234567', posts: 20, followers: '2.5K', following: 300 },
    { id: 6, path: 'user-profile.jpeg', name: 'Fiona Glenanne', role: 'Customer', email: 'fiona@mail.com', location: 'Madrid, Spain', phone: '+34 91 1234567', posts: 7, followers: '900', following: 60 },
    { id: 7, path: 'profile-16.jpeg', name: 'George Miller', role: 'Operator', email: 'george@mail.com', location: 'Toronto, Canada', phone: '+1 416 123 4567', posts: 18, followers: '2.2K', following: 180 },
    { id: 8, path: 'profile-34.jpeg', name: 'Hannah Brown', role: 'Technician', email: 'hannah@mail.com', location: 'Sydney, Australia', phone: '+61 2 1234 5678', posts: 9, followers: '1.1K', following: 90 },
    { id: 9, path: 'user-profile.jpeg', name: 'Ian Curtis', role: 'Admin', email: 'ian@mail.com', location: 'Dublin, Ireland', phone: '+353 1 234 5678', posts: 13, followers: '1.7K', following: 110 },
    { id: 10, path: 'profile-16.jpeg', name: 'Julia Roberts', role: 'Customer', email: 'julia@mail.com', location: 'Vienna, Austria', phone: '+43 1 2345678', posts: 11, followers: '1.3K', following: 100 },
    { id: 11, path: 'profile-34.jpeg', name: 'Kevin Hart', role: 'Operator', email: 'kevin@mail.com', location: 'Zurich, Switzerland', phone: '+41 44 123 4567', posts: 16, followers: '2.1K', following: 170 },
    { id: 12, path: 'user-profile.jpeg', name: 'Laura Palmer', role: 'Technician', email: 'laura@mail.com', location: 'Oslo, Norway', phone: '+47 22 123 456', posts: 14, followers: '1.6K', following: 130 },
    { id: 13, path: 'profile-16.jpeg', name: 'Mike Ross', role: 'Admin', email: 'mike@mail.com', location: 'Brussels, Belgium', phone: '+32 2 123 45 67', posts: 19, followers: '2.8K', following: 210 },
    { id: 14, path: 'profile-34.jpeg', name: 'Nina Simone', role: 'Customer', email: 'nina@mail.com', location: 'Lisbon, Portugal', phone: '+351 21 123 4567', posts: 6, followers: '800', following: 50 },
    { id: 15, path: 'user-profile.jpeg', name: 'Oscar Wilde', role: 'Operator', email: 'oscar@mail.com', location: 'Prague, Czechia', phone: '+420 2 123 4567', posts: 17, followers: '2.3K', following: 160 },
    { id: 16, path: 'profile-16.jpeg', name: 'Paula Abdul', role: 'Technician', email: 'paula@mail.com', location: 'Budapest, Hungary', phone: '+36 1 234 5678', posts: 8, followers: '1.0K', following: 70 },
    { id: 17, path: 'profile-34.jpeg', name: 'Quentin Blake', role: 'Admin', email: 'quentin@mail.com', location: 'Warsaw, Poland', phone: '+48 22 123 45 67', posts: 21, followers: '3.1K', following: 230 },
    { id: 18, path: 'user-profile.jpeg', name: 'Rachel Green', role: 'Customer', email: 'rachel@mail.com', location: 'Athens, Greece', phone: '+30 21 1234 5678', posts: 5, followers: '700', following: 40 },
    { id: 19, path: 'profile-16.jpeg', name: 'Steve Jobs', role: 'Operator', email: 'steve@mail.com', location: 'Stockholm, Sweden', phone: '+46 8 123 4567', posts: 22, followers: '3.5K', following: 250 },
    { id: 20, path: 'profile-34.jpeg', name: 'Tina Turner', role: 'Technician', email: 'tina@mail.com', location: 'Copenhagen, Denmark', phone: '+45 33 123 456', posts: 12, followers: '1.4K', following: 115 },
];

const USERS_PER_PAGE = 10;

const AllUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('All Users'));
    }, [dispatch]);

    const [addUserModal, setAddUserModal] = useState(false);
    const [view, setView] = useState('list');
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState(DUMMY_USERS);
    const [params, setParams] = useState<{ id: number | null; name: string; email: string; phone: string; role: string; location: string }>({ id: null, name: '', email: '', phone: '', role: '', location: '' });
    const [page, setPage] = useState(1);
    const [viewUserModal, setViewUserModal] = useState(false);
    const [viewUser, setViewUser] = useState<null | typeof DUMMY_USERS[number]>(null);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    const paginatedUsers = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const showMessage = (msg = '', type: 'success' | 'error' | 'warning' | 'info' | 'question' = 'success') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({ icon: type, title: msg, padding: '10px 20px' });
    };

    const saveUser = () => {
        if (!params.name) return showMessage('Name is required.', 'error');
        if (!params.email) return showMessage('Email is required.', 'error');
        if (!params.phone) return showMessage('Phone is required.', 'error');
        if (!params.role) return showMessage('Role is required.', 'error');

        if (params.id !== null) {
            setUsers(users.map(u =>
                u.id === params.id
                    ? {
                        ...u,
                        ...params,
                        id: u.id // Ensure id is always a number
                    }
                    : u
            ));
        } else {
            const maxId = users.length ? Math.max(...users.map(u => u.id)) : 0;
            setUsers([{ ...params, id: maxId + 1, path: 'profile-16.jpeg', posts: 0, followers: '0', following: 0 }, ...users]);
        }
        showMessage('User has been saved successfully.');
        setAddUserModal(false);
    };

    const editUser = (user: typeof DUMMY_USERS[number] | null = null) => {
        setParams(user ? { ...user } : { id: null, name: '', email: '', phone: '', role: '', location: '' });
        setAddUserModal(true);
    };

    const deleteUser = (user: typeof DUMMY_USERS[number]) => {
        setUsers(users.filter(u => u.id !== user.id));
        showMessage('User has been deleted successfully.');
    };

    const handleViewUser = (user: typeof DUMMY_USERS[number]) => {
        setViewUser(user);
        setViewUserModal(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">All Users</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="relative">
                        <input type="text" placeholder="Search Users" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {view === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role As</th>
                                    <th>Status</th>
                                    <th className="!text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="flex items-center w-max">
                                                {user.path && (
                                                    <div className="w-max">
                                                        <img src={`/assets/images/${user.path}`} className="h-8 w-8 rounded-full object-cover ltr:mr-2 rtl:ml-2" alt="avatar" />
                                                    </div>
                                                )}
                                                {!user.path && user.name && (
                                                    <div className="grid place-content-center h-8 w-8 ltr:mr-2 rtl:ml-2 rounded-full bg-primary text-white text-sm font-semibold"></div>
                                                )}
                                                {!user.path && !user.name && (
                                                    <div className="border border-gray-300 dark:border-gray-800 rounded-full p-2 ltr:mr-2 rtl:ml-2">
                                                        <IconUser className="w-4.5 h-4.5" />
                                                    </div>
                                                )}
                                                <div>{user.name}</div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                                        </td>
                                        <td>
                                            <div className="flex gap-4 items-center justify-center">
                                                <button type="button" className="btn btn-sm btn-outline-info" onClick={() => handleViewUser(user)}>
                                                    View
                                                </button>
                                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(user)}>
                                                    Edit
                                                </button>
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(user)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
            {/* View User Modal */}
            <Transition appear show={viewUserModal} as={Fragment}>
                <Dialog as="div" open={viewUserModal} onClose={() => setViewUserModal(false)} className="relative z-[52]">
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-md text-black dark:text-white-dark">
                                    <button type="button" onClick={() => setViewUserModal(false)} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        User Details
                                    </div>
                                    <div className="p-5">
                                        {viewUser && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={`/assets/images/${viewUser.path}`} className="h-16 w-16 rounded-full object-cover" alt="avatar" />
                                                    <div>
                                                        <div className="text-xl font-semibold">{viewUser.name}</div>
                                                        <div className="text-gray-500">{viewUser.role}</div>
                                                    </div>
                                                </div>
                                                <div><span className="font-medium">Email:</span> {viewUser.email}</div>
                                                <div><span className="font-medium">Phone:</span> {viewUser.phone}</div>
                                                <div><span className="font-medium">Address:</span> {viewUser.location}</div>
                                                <div><span className="font-medium">Status:</span> <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span></div>
                                            </div>
                                        )}
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 gap-2">
                            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                            <span>Page {page} of {totalPages}</span>
                            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                        </div>
                    )}
                </div>
            )}

            {view === 'grid' && (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                    {paginatedUsers.map(user => (
                        <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative" key={user.id}>
                            <div className="bg-white/40 rounded-t-md bg-center bg-cover p-6 pb-0" style={{ backgroundImage: `url('/assets/images/notification-bg.png')`, backgroundRepeat: 'no-repeat', width: '100%', height: '100%' }}>
                                <img className="object-contain w-4/5 max-h-40 mx-auto" src={`/assets/images/${user.path}`} alt="user_image" />
                            </div>
                            <div className="px-6 pb-24 -mt-10 relative">
                                <div className="shadow-md bg-white dark:bg-gray-900 rounded-md px-2 py-4">
                                    <div className="text-xl">{user.name}</div>
                                    <div className="text-white-dark">{user.role}</div>
                                    <div className="flex items-center justify-between flex-wrap mt-6 gap-3">
                                        <div className="flex-auto">
                                            <div className="text-info">{user.posts}</div>
                                            <div>Posts</div>
                                        </div>
                                        <div className="flex-auto">
                                            <div className="text-info">{user.following}</div>
                                            <div>Following</div>
                                        </div>
                                        <div className="flex-auto">
                                            <div className="text-info">{user.followers}</div>
                                            <div>Followers</div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <ul className="flex space-x-4 rtl:space-x-reverse items-center justify-center">
                                            <li><button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full"><IconFacebook /></button></li>
                                            <li><button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full"><IconInstagram /></button></li>
                                            <li><button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full"><IconLinkedin /></button></li>
                                            <li><button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full"><IconTwitter /></button></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                                    <div className="flex items-center"><div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div><div className="truncate text-white-dark">{user.email}</div></div>
                                    <div className="flex items-center"><div className="flex-none ltr:mr-2 rtl:ml-2">Phone :</div><div className="text-white-dark">{user.phone}</div></div>
                                    <div className="flex items-center"><div className="flex-none ltr:mr-2 rtl:ml-2">Address :</div><div className="text-white-dark">{user.location}</div></div>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-4 absolute bottom-0 w-full ltr:left-0 rtl:right-0 p-6">
                                <button type="button" className="btn btn-outline-primary w-1/2" onClick={() => editUser(user)}>Edit</button>
                                <button type="button" className="btn btn-outline-danger w-1/2" onClick={() => deleteUser(user)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="col-span-full flex justify-center items-center mt-6 gap-2">
                            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                            <span>Page {page} of {totalPages}</span>
                            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                        </div>
                    )}
                </div>
            )}

            <Transition appear show={addUserModal} as={Fragment}>
                <Dialog as="div" open={addUserModal} onClose={() => setAddUserModal(false)} className="relative z-[51]">
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button type="button" onClick={() => setAddUserModal(false)} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params.id ? 'Edit User' : 'Add User'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name">Name</label>
                                                <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={changeValue} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="email">Email</label>
                                                <input id="email" type="email" placeholder="Enter Email" className="form-input" value={params.email} onChange={changeValue} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="phone">Phone Number</label>
                                                <input id="phone" type="text" placeholder="Enter Phone Number" className="form-input" value={params.phone} onChange={changeValue} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="role">Role</label>
                                                <input id="role" type="text" placeholder="Enter Role" className="form-input" value={params.role} onChange={changeValue} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="location">Address</label>
                                                <textarea id="location" rows={3} placeholder="Enter Address" className="form-textarea resize-none min-h-[130px]" value={params.location} onChange={changeValue}></textarea>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddUserModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                    {params.id ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default AllUsers;
