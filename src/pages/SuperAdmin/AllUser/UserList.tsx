import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, UsersFilters, ROLE_LABELS } from '../../../types/user.types';
import { PaginationData } from '../../../types/pagination.types';
import { UserService } from '../../../services/userService';
import { useAlert } from '../../../components/Alert/Alert';
import { Table } from '../../../components/UI/Table';
import { Pagination } from '../../../components/UI/Pagination';
import { PerPageSelector } from '../../../components/UI/PerPageSelector';

const UserList: React.FC = () => {
    const { showAlert, AlertContainer } = useAlert();
    const [users, setUsers] = useState<PaginationData<User> | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<UsersFilters>({
        search: '',
        role: '',
        is_active: '',
        per_page: 10,
    });

    const fetchUsers = useCallback(
        async (page: number = currentPage) => {
            setLoading(true);
            try {
                const response = await UserService.getUsers(page, filters);
                setUsers(response.users);
                setCurrentPage(page);
            } catch (error: any) {
                console.error('Error fetching users:', error);
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: error.message || 'Failed to fetch users',
                });
            } finally {
                setLoading(false);
            }
        },
        [currentPage, filters, showAlert],
    );

    useEffect(() => {
        fetchUsers(1);
    }, [filters]);

    const handlePageChange = useCallback(
        (page: number) => {
            fetchUsers(page);
        },
        [fetchUsers],
    );

    const handleFilterChange = useCallback((key: keyof UsersFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            fetchUsers(1);
        },
        [fetchUsers],
    );

    const getRoleBadge = useMemo(() => {
        return (role: number) => {
            const colors = {
                1: 'bg-purple-100 text-purple-800',
                2: 'bg-blue-100 text-blue-800',
                3: 'bg-green-100 text-green-800',
                4: 'bg-yellow-100 text-yellow-800',
                5: 'bg-gray-100 text-gray-800',
            };

            return (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors] || colors[5]}`}>{ROLE_LABELS[role as keyof typeof ROLE_LABELS] || 'Unknown'}</span>
            );
        };
    }, []);

    const getStatusBadge = useMemo(() => {
        return (isActive: boolean) => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{isActive ? 'Active' : 'Inactive'}</span>
        );
    }, []);

    const columns = useMemo(
        () => [
            {
                key: 'id',
                label: 'ID',
                className: 'w-16',
            },
            {
                key: 'name',
                label: 'Name',
                render: (value: string, row: User) => (
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                        <div className="text-sm text-gray-500">{row.email}</div>
                    </div>
                ),
            },
            {
                key: 'role_as',
                label: 'Role',
                render: (value: number) => getRoleBadge(value),
            },
            {
                key: 'phone',
                label: 'Phone',
                render: (value: string | null) => value || '-',
            },
            {
                key: 'is_active',
                label: 'Status',
                render: (value: boolean) => getStatusBadge(value),
            },
            {
                key: 'actions',
                label: 'Actions',
                render: (value: any, row: User) => (
                    <div className="flex space-x-2">
                        <Link to={`/users/${row.id}`} className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                            View
                        </Link>
                        <Link to={`/users/${row.id}/edit`} className="text-green-600 hover:text-green-900 text-sm font-medium">
                            Edit
                        </Link>
                        <Link to={`/users/${row.id}/delete`} className="text-red-600 hover:text-red-900 text-sm font-medium">
                            Delete
                        </Link>
                    </div>
                ),
            },
        ],
        [getRoleBadge, getStatusBadge],
    );

    const roleOptions = useMemo(
        () =>
            Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                    {label}
                </option>
            )),
        [],
    );

    const paginationMeta = useMemo(() => {
        if (!users) return null;

        return {
            current_page: users.current_page,
            last_page: users.last_page,
            per_page: users.per_page,
            total: users.total,
            from: users.from,
            to: users.to,
        };
    }, [users]);

    const tableData = useMemo(() => users?.data || [], [users?.data]);

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
                        <span>Users</span>
                    </li>
                </ul>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
                    <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>
                <Link to="/super-admin/user-create" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create User
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                        </label>
                        <select
                            id="role"
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
                            <option value="">All Roles</option>
                            {roleOptions}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            value={filters.is_active?.toString() || ''}
                            onChange={(e) => handleFilterChange('is_active', e.target.value === '' ? '' : e.target.value === 'true')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <PerPageSelector value={filters.per_page || 10} onChange={(value) => handleFilterChange('per_page', value)} loading={loading} />

                {users && <div className="text-sm text-gray-600">Total: {users.total} users</div>}
            </div>

            <Table data={tableData} columns={columns} loading={loading} emptyMessage="No users found" className="mb-6" />

            {paginationMeta && <Pagination meta={paginationMeta} onPageChange={handlePageChange} loading={loading} />}
        </div>
    );
};

export default UserList;
