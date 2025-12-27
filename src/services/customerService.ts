import api from '../config/api.config';

interface BranchData {
    name: string;
}

interface CreateCustomerData {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    customer_type: 'personal' | 'company';
    company_name?: string;
    headquarters_branch_id?: string;
    branch_ids?: string[];
    branches?: BranchData[];
}

interface CustomerResponse {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    customer_type: 'personal' | 'company';
    company_name?: string;
    is_active: boolean;
    created_at?: string;
}

class CustomerService {
    async createCustomer(data: CreateCustomerData) {
        try {
            const response = await api.post('/create-customer', data);
            return {
                success: true,
                message: response.data.message || 'Customer created successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Create customer error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create customer',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getCustomer(id: string) {
        try {
            const response = await api.get(`/customer/${id}`);
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Get customer error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch customer',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getAllCustomers() {
        try {
            const response = await api.get('/all-users', {
                params: { role: 5 }, // role = 5 for customers
            });

            console.log('Get customers full response:', response);
            console.log('Get customers response.data:', response.data);

            // Response format: { status: 200, users: { data: [...], current_page: 1, ... } }
            let users: any[] = [];

            if (response.data && response.data.users) {
                const usersData = response.data.users;
                console.log('usersData:', usersData);

                // Extract the data array from paginated response
                if (Array.isArray(usersData.data)) {
                    users = usersData.data;
                } else if (Array.isArray(usersData)) {
                    users = usersData;
                }
            }

            console.log('Extracted customers:', users);
            console.log('Customers count:', users.length);

            return {
                success: true,
                data: users,
            };
        } catch (error: any) {
            console.error('Get customers error:', error);
            console.error('Error details:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch customers',
                errors: error.response?.data?.errors,
            };
        }
    }

    async updateCustomer(id: string, data: Partial<CreateCustomerData>) {
        try {
            const response = await api.put(`/update-users/${id}`, data);

            return {
                success: true,
                message: response.data.message || 'Customer updated successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Update customer error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update customer',
                errors: error.response?.data?.errors,
            };
        }
    }

    async deleteCustomer(id: string) {
        try {
            const response = await api.delete(`/delete-users/${id}`);

            return {
                success: true,
                message: response.data.message || 'Customer deleted successfully',
            };
        } catch (error: any) {
            console.error('Delete customer error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete customer',
                errors: error.response?.data?.errors,
            };
        }
    }

    async addCompanyCustomerBranches(
        customerId: string,
        branchNames: string[]
    ) {
        try {
            const response = await api.post(`/customer/${customerId}/add-branches`, {
                branch_names: branchNames,
            });

            return {
                success: true,
                message: response.data.message || 'Branches added successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Add branches error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add branches',
                errors: error.response?.data?.errors,
            };
        }
    }

    async updateCompanyCustomerBranch(customerId: string, branchId: string, data: { name: string }) {
        try {
            const response = await api.put(`/customer/${customerId}/update-branch/${branchId}`, {
                branch_name: data.name
            });

            return {
                success: true,
                message: response.data.message || 'Branch updated successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Update branch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update branch',
                errors: error.response?.data?.errors,
            };
        }
    }

    async removeCompanyCustomerBranch(customerId: string, branchId: string) {
        try {
            const response = await api.delete(`/customer/${customerId}/remove-branch/${branchId}`);

            return {
                success: true,
                message: response.data.message || 'Branch removed successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Remove branch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to remove branch',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getCompanyCustomerBranches(customerId: string) {
        try {
            const response = await api.get(`/customer/${customerId}/branches`);
            console.log('getCompanyCustomerBranches full response:', response);

            // Response structure: { status: 200, message: '...', data: { customer_id: '...', branches: [...] } }
            let branches: any[] = [];

            if (response.data) {
                console.log('response.data:', response.data);

                // Check direct data.branches first
                if (response.data.data && response.data.data.branches && Array.isArray(response.data.data.branches)) {
                    branches = response.data.data.branches;
                    console.log('Branches from response.data.data.branches:', branches);
                }
                // Check if data itself is the wrapper
                else if (response.data.branches && Array.isArray(response.data.branches)) {
                    branches = response.data.branches;
                    console.log('Branches from response.data.branches:', branches);
                }
                // Check if entire response.data is array
                else if (Array.isArray(response.data)) {
                    branches = response.data;
                    console.log('Branches from response.data array:', branches);
                }
            }

            console.log('Final extracted branches:', branches);
            console.log('Branches count:', branches.length);

            return {
                success: branches.length > 0,
                data: { branches },
            };
        } catch (error: any) {
            console.error('Error fetching branches:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch branches',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getActiveBranches() {
        try {
            const response = await api.get('/active-branches');

            return {
                success: true,
                data: Array.isArray(response.data.data) ? response.data.data : response.data,
            };
        } catch (error: any) {
            console.error('Get branches error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch branches',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getActiveCustomers() {
        try {
            const response = await api.get('/active-customers');

            let customers: any[] = [];

            // Response structure: { status: 200, customers: [...] }
            if (response.data && response.data.customers && Array.isArray(response.data.customers)) {
                customers = response.data.customers;
            }

            return {
                success: true,
                data: customers,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch active customers',
                errors: error.response?.data?.errors,
            };
        }
    }
}

export { CustomerService };
export default new CustomerService();
