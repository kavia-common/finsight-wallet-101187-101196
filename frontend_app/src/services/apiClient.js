import axios from 'axios';
import { mockApi } from './mockApi';

/**
 * API service that wraps axios and can switch to a mock implementation
 * via REACT_APP_FEATURE_MOCK_API.
 */

const useMock = String(process.env.REACT_APP_FEATURE_MOCK_API || '').toLowerCase() === 'true';

const baseURL = process.env.REACT_APP_API_BASE_URL || '';

const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  // You may add interceptors for auth tokens etc.
});

async function handle(promise) {
  const { data } = await promise;
  return data;
}

// PUBLIC_INTERFACE
export const api = useMock
  ? mockApi
  : {
      auth: {
        // PUBLIC_INTERFACE
        register: (payload) => handle(http.post('/auth/register', payload)),
        // PUBLIC_INTERFACE
        login: (payload) => handle(http.post('/auth/login', payload)),
      },
      accounts: {
        // PUBLIC_INTERFACE
        list: () => handle(http.get('/accounts')),
        // PUBLIC_INTERFACE
        create: (payload) => handle(http.post('/accounts', payload)),
        // PUBLIC_INTERFACE
        update: (id, payload) => handle(http.put(`/accounts/${id}`, payload)),
        // PUBLIC_INTERFACE
        remove: (id) => handle(http.delete(`/accounts/${id}`)),
      },
      transactions: {
        // PUBLIC_INTERFACE
        listByAccount: (accountId, params = {}) =>
          handle(http.get(`/accounts/${accountId}/transactions`, { params })),
        // PUBLIC_INTERFACE
        create: (accountId, payload) =>
          handle(http.post(`/accounts/${accountId}/transactions`, payload)),
        // PUBLIC_INTERFACE
        remove: (id) => handle(http.delete(`/transactions/${id}`)),
      },
      insights: {
        // PUBLIC_INTERFACE
        summary: () => handle(http.get('/insights/summary')),
      },
    };
