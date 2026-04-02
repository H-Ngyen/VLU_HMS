const API_BASE_URL = 'https://localhost:5001/api';

import type { Patient } from '@/types';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const getHeaders = (headers: Record<string, string> = {}) => {
  const baseHeaders: Record<string, string> = { ...headers };
  if (accessToken) {
    baseHeaders['Authorization'] = `Bearer ${accessToken}`;
  }
  return baseHeaders;
};

export const api = {
  patients: {
    getAll: async (params?: { searchPhrase?: string; pageNumber?: number; pageSize?: number }): Promise<Patient[]> => {
      const queryParams = new URLSearchParams({
        pageNumber: (params?.pageNumber || 1).toString(),
        pageSize: (params?.pageSize || 30).toString(),
        ...(params?.searchPhrase && { searchPhrase: params.searchPhrase })
      });
      
      const response = await fetch(`${API_BASE_URL}/patients?${queryParams}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      return data.items || [];
    },
    
    getById: async (id: number): Promise<Patient> => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch patient');
      return response.json();
    },
    
    create: async (data: {
      name: string;
      dateOfBirth: string;
      gender: number;
      ethnicityId: number;
      healthInsuranceNumber: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          throw new Error(`Failed to create patient (Status: ${response.status})`);
        }
        console.error('API Error:', error);

        if (error?.errors) {
          const messages = Object.entries(error.errors)
            .map(([field, msgs]: [string, any]) => `${field}: ${msgs.join(', ')}`)
            .join('\n');
          throw new Error(messages);
        }

        throw new Error(error?.title || error?.message || 'Failed to create patient');
      }

      return response.json();
    },    
    update: async (id: number, data: {
      name: string;
      dateOfBirth: string;
      gender: number;
      ethnicityId: number;
      healthInsuranceNumber: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          throw new Error(`Failed to update patient (Status: ${response.status})`);
        }
        console.error('API Error:', error);

        if (error?.errors) {
          const messages = Object.entries(error.errors)
            .map(([field, msgs]: [string, any]) => `${field}: ${msgs.join(', ')}`)
            .join('\n');
          throw new Error(messages);
        }

        throw new Error(error?.title || error?.message || 'Failed to update patient');
      }

      if (response.status === 204) {
        return;
      }
      return response.json();
    },

    delete: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          throw new Error(`Failed to delete patient (Status: ${response.status})`);
        }
        throw new Error(error?.title || error?.message || 'Failed to delete patient');
      }
    }  },
  
  ethnicities: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/ethinicities`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch ethnicities');
      return response.json();
    }
  },

  medicalRecords: {
    getAll: async (params?: { searchPhrase?: string; pageNumber?: number; pageSize?: number; recordType?: number }) => {
      const queryParams = new URLSearchParams({
        pageNumber: (params?.pageNumber || 1).toString(),
        pageSize: (params?.pageSize || 30).toString(),
        ...(params?.searchPhrase && { searchPhrase: params.searchPhrase }),
        ...(params?.recordType && { recordType: params.recordType.toString() })
      });

      const response = await fetch(`${API_BASE_URL}/medical-records?${queryParams}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch medical records');
      return response.json();
    },

    getById: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch medical record');
      return response.json();
    },

    delete: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          throw new Error(`Failed to delete medical record (Status: ${response.status})`);
        }
        throw new Error(error?.title || error?.message || 'Failed to delete medical record');
      }
    }
  },

  xRays: {
    create: async (recordId: number, data: any) => {
      const response = await fetch(`${API_BASE_URL}/medical-records/${recordId}/clinicals/x-rays`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create X-Ray');
      return response.text(); // Return ID if available
    },
    changeStatus: async (recordId: number, id: number, data: { status?: number, departmentName: string }) => {
      const response = await fetch(`${API_BASE_URL}/medical-records/${recordId}/clinicals/x-rays/${id}`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update X-Ray status');
    },
    complete: async (recordId: number, id: number, data: { resultDescription?: string, doctorAdvice?: string, completedAt?: string }) => {
      const response = await fetch(`${API_BASE_URL}/medical-records/${recordId}/clinicals/x-rays/${id}/complete`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to complete X-Ray');
    }
  },

  identities: {
    sync: async (data: {
      auth0Id: string;
      email: string;
      emailVerify: boolean;
      name: string;
      pictureUrl: string;
      updateAt: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/identities`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          throw new Error(`Failed to sync user identity (Status: ${response.status})`);
        }
        throw new Error(error?.message || 'Failed to sync user identity');
      }

      if (response.status === 201) {
        return response.json();
      }
      return null;
    },

    getAllUsers: async (): Promise<User[]> => {
      const response = await fetch(`${API_BASE_URL}/identities/users`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },

    changeActiveStatus: async (userId: number, isActive: boolean) => {
      const response = await fetch(`${API_BASE_URL}/identities/users/${userId}/active`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ active: isActive })
      });
      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          const text = await response.text();
          throw new Error(text || 'Failed to change user status');
        }
        throw new Error(error?.message || error?.title || 'Failed to change user status');
      }
    },

    changeRole: async (userId: number, roleName: string) => {
      const response = await fetch(`${API_BASE_URL}/identities/users/${userId}/roles`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ role: roleName })
      });
      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          const text = await response.text();
          throw new Error(text || 'Failed to change user role');
        }
        throw new Error(error?.message || error?.title || 'Failed to change user role');
      }
    }
  }
};
