import { useState, Fragment, useEffect, useMemo } from 'react';
import { Transition } from '@headlessui/react';
import EditAllUsers from './EditAllUsers';
import ViewAllUsers from './ViewAllUsers';
import Pagination from '../../../components/Pagination.tsx/Pagination';
import Swal from 'sweetalert2';
import { useAlert } from '../../../components/Alert/Alert';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconSearch from '../../../components/Icon/IconSearch';

import { Link } from 'react-router-dom';

const DUMMY_USERS = [
    {
        id: 1,
        path: 'profile-16.jpeg',
        name: 'Alice Johnson',
        role: 'Admin',
        email: 'alice@mail.com',
        location: 'New York, USA',
        phone: '+1 202 555 0101',
        posts: 12,
        followers: '2K',
        following: 150,
    },
    { id: 2, path: 'profile-34.jpeg', name: 'Bob Smith', role: 'Customer', email: 'bob@mail.com', location: 'London, UK', phone: '+44 20 7946 0958', posts: 8, followers: '1.2K', following: 80 },
    {
        id: 3,
        path: 'user-profile.jpeg',
        name: 'Charlie Lee',
        role: 'Operator',
        email: 'charlie@mail.com',
        location: 'Berlin, Germany',
        phone: '+49 30 123456',
        posts: 15,
        followers: '3K',
        following: 200,
    },
    {
        id: 4,
        path: 'profile-16.jpeg',
        name: 'Diana Prince',
        role: 'Technician',
        email: 'diana@mail.com',
        location: 'Paris, France',
        phone: '+33 1 23456789',
        posts: 10,
        followers: '1.5K',
        following: 120,
    },
    { id: 5, path: 'profile-34.jpeg', name: 'Ethan Hunt', role: 'Admin', email: 'ethan@mail.com', location: 'Rome, Italy', phone: '+39 06 1234567', posts: 20, followers: '2.5K', following: 300 },
    {
        id: 6,
        path: 'user-profile.jpeg',
        name: 'Fiona Glenanne',
        role: 'Customer',
        email: 'fiona@mail.com',
        location: 'Madrid, Spain',
        phone: '+34 91 1234567',
        posts: 7,
        followers: '900',
        following: 60,
    },
    {
        id: 7,
        path: 'profile-16.jpeg',
        name: 'George Miller',
        role: 'Operator',
        email: 'george@mail.com',
        location: 'Toronto, Canada',
        phone: '+1 416 123 4567',
        posts: 18,
        followers: '2.2K',
        following: 180,
    },
    {
        id: 8,
        path: 'profile-34.jpeg',
        name: 'Hannah Brown',
        role: 'Technician',
        email: 'hannah@mail.com',
        location: 'Sydney, Australia',
        phone: '+61 2 1234 5678',
        posts: 9,
        followers: '1.1K',
        following: 90,
    },
    { id: 9, path: 'user-profile.jpeg', name: 'Ian Curtis', role: 'Admin', email: 'ian@mail.com', location: 'Dublin, Ireland', phone: '+353 1 234 5678', posts: 13, followers: '1.7K', following: 110 },
    {
        id: 10,
        path: 'profile-16.jpeg',
        name: 'Julia Roberts',
        role: 'Customer',
        email: 'julia@mail.com',
        location: 'Vienna, Austria',
        phone: '+43 1 2345678',
        posts: 11,
        followers: '1.3K',
        following: 100,
    },
    {
        id: 11,
        path: 'profile-34.jpeg',
        name: 'Kevin Hart',
        role: 'Operator',
        email: 'kevin@mail.com',
        location: 'Zurich, Switzerland',
        phone: '+41 44 123 4567',
        posts: 16,
        followers: '2.1K',
        following: 170,
    },
    {
        id: 12,
        path: 'user-profile.jpeg',
        name: 'Laura Palmer',
        role: 'Technician',
        email: 'laura@mail.com',
        location: 'Oslo, Norway',
        phone: '+47 22 123 456',
        posts: 14,
        followers: '1.6K',
        following: 130,
    },
    {
        id: 13,
        path: 'profile-16.jpeg',
        name: 'Mike Ross',
        role: 'Admin',
        email: 'mike@mail.com',
        location: 'Brussels, Belgium',
        phone: '+32 2 123 45 67',
        posts: 19,
        followers: '2.8K',
        following: 210,
    },
    {
        id: 14,
        path: 'profile-34.jpeg',
        name: 'Nina Simone',
        role: 'Customer',
        email: 'nina@mail.com',
        location: 'Lisbon, Portugal',
        phone: '+351 21 123 4567',
        posts: 6,
        followers: '800',
        following: 50,
    },
    {
        id: 15,
        path: 'user-profile.jpeg',
        name: 'Oscar Wilde',
        role: 'Operator',
        email: 'oscar@mail.com',
        location: 'Prague, Czechia',
        phone: '+420 2 123 4567',
        posts: 17,
        followers: '2.3K',
        following: 160,
    },
    {
        id: 16,
        path: 'profile-16.jpeg',
        name: 'Paula Abdul',
        role: 'Technician',
        email: 'paula@mail.com',
        location: 'Budapest, Hungary',
        phone: '+36 1 234 5678',
        posts: 8,
        followers: '1.0K',
        following: 70,
    },
    {
        id: 17,
        path: 'profile-34.jpeg',
        name: 'Quentin Blake',
        role: 'Admin',
        email: 'quentin@mail.com',
        location: 'Warsaw, Poland',
        phone: '+48 22 123 45 67',
        posts: 21,
        followers: '3.1K',
        following: 230,
    },
    {
        id: 18,
        path: 'user-profile.jpeg',
        name: 'Rachel Green',
        role: 'Customer',
        email: 'rachel@mail.com',
        location: 'Athens, Greece',
        phone: '+30 21 1234 5678',
        posts: 5,
        followers: '700',
        following: 40,
    },
    {
        id: 19,
        path: 'profile-16.jpeg',
        name: 'Steve Jobs',
        role: 'Operator',
        email: 'steve@mail.com',
        location: 'Stockholm, Sweden',
        phone: '+46 8 123 4567',
        posts: 22,
        followers: '3.5K',
        following: 250,
    },
    {
        id: 20,
        path: 'profile-34.jpeg',
        name: 'Tina Turner',
        role: 'Technician',
        email: 'tina@mail.com',
        location: 'Copenhagen, Denmark',
        phone: '+45 33 123 456',
        posts: 12,
        followers: '1.4K',
        following: 115,
    },
];

const USERS_PER_PAGE = 10;

const AllUsers = () => {
    const { showAlert, AlertContainer } = useAlert();
    const dispatch = useMemo(() => useDispatch(), []);
    useEffect(() => {
        dispatch(setPageTitle('All Users'));
    }, [dispatch]);

    const [addUserModal, setAddUserModal] = useState(false);
    const [view, setView] = useState('list');
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState(DUMMY_USERS);
    const [params, setParams] = useState<{ id: number | null; name: string; email: string; phone: string; role: string; location: string }>({
        id: null,
        name: '',
        email: '',
        phone: '',
        role: '',
        location: '',
    });
    const [page, setPage] = useState(1);
    const [viewUserModal, setViewUserModal] = useState(false);
    const [viewUser, setViewUser] = useState<null | (typeof DUMMY_USERS)[number]>(null);

    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()));
    // Pagination logic is now handled in Pagination component

    const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const showMessage = (msg = '', type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        showAlert({
            type: type as 'success' | 'error' | 'warning' | 'info',
            title: msg,
        });
    };

    const updateUser = () => {
        if (!params.name) return showMessage('Name is required.', 'error');
        if (!params.email) return showMessage('Email is required.', 'error');
        if (!params.phone) return showMessage('Phone is required.', 'error');
        if (!params.role) return showMessage('Role is required.', 'error');

        if (params.id !== null) {
            setUsers(
                users.map((u) =>
                    u.id === params.id
                        ? {
                              ...u,
                              ...params,
                              id: u.id, // Ensure id is always a number
                          }
                        : u,
                ),
            );
            showAlert({ type: 'success', title: 'User has been updated successfully.' });
        } else {
            const maxId = users.length ? Math.max(...users.map((u) => u.id)) : 0;
            setUsers([{ ...params, id: maxId + 1, path: 'profile-16.jpeg', posts: 0, followers: '0', following: 0 }, ...users]);
            showAlert({ type: 'success', title: 'User has been saved successfully.' });
        }
        setAddUserModal(false);
    };

    const editUser = (user: (typeof DUMMY_USERS)[number] | null = null) => {
        setParams(user ? { ...user } : { id: null, name: '', email: '', phone: '', role: '', location: '' });
        setAddUserModal(true);
    };

    const deleteUser = async (user: (typeof DUMMY_USERS)[number]) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${user.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            setUsers(users.filter((u) => u.id !== user.id));
            showAlert({ type: 'success', title: 'User has been deleted successfully.' });
        }
    };

    const handleViewUser = (user: (typeof DUMMY_USERS)[number]) => {
        setViewUser(user);
        setViewUserModal(true);
    };

    return (
        <div>
            <AlertContainer />
            <div className="mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                    <li>
                        <Link to="/super-admin" className="text-primary hover:underline transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>All Users</span>
                    </li>
                </ul>
            </div>

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Users</h1>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl"></h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Users"
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {view === 'list' && (
                <Pagination
                    users={filteredUsers}
                    page={page}
                    setPage={setPage}
                    usersPerPage={50}
                    renderUsers={(paginatedUsers) => (
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
                                        {paginatedUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
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
                                                <ViewAllUsers open={viewUserModal} onClose={() => setViewUserModal(false)} viewUser={viewUser} setViewUserModal={setViewUserModal} />
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                />
            )}

            <EditAllUsers open={addUserModal} onClose={() => setAddUserModal(false)} params={params} changeValue={changeValue} saveUser={updateUser} setAddUserModal={setAddUserModal} />
        </div>
    );
};

export default AllUsers;
