const API_BASE_URL = 'https://localhost:5001/api';

import type { Patient } from '@/types';

export const api = {
  patients: {
    getAll: async (params?: { searchPhrase?: string; pageNumber?: number; pageSize?: number }): Promise<Patient[]> => {
      const queryParams = new URLSearchParams({
        pageNumber: (params?.pageNumber || 1).toString(),
        pageSize: (params?.pageSize || 30).toString(),
        ...(params?.searchPhrase && { searchPhrase: params.searchPhrase })
      });
      
      const response = await fetch(`${API_BASE_URL}/patients?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      return data.items || [];
    },
    
    getById: async (id: number): Promise<Patient> => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`);
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
        headers: { 'Content-Type': 'application/json' },
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

        // Extract validation errors
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
        headers: { 'Content-Type': 'application/json' },
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
        method: 'DELETE'
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
      const response = await fetch(`${API_BASE_URL}/ethinicities`);
      if (!response.ok) throw new Error('Failed to fetch ethnicities');
      return response.json();
    }
  }
};
