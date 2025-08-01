import api from '../config/api.config';
import { AMCContractFormData, CreateContractResponse } from '../types/amcContract.types';


export class AMCContractService {
    static async createContract(data: AMCContractFormData): Promise<CreateContractResponse> {
        try {
            const response = await api.post<CreateContractResponse>('/create-contract', data);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                throw error.response.data;
            }
            throw {
                status: 'error',
                message: 'Network error. Please try again.',
                error: error.message,
            };
        }
    }
}
