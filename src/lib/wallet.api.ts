// src/api/wallet.api.ts
import api from './api';

export const walletApi = {
  getWallet: async () => {
    const res = await api.get('/wallet');
    return res.data;
  },

  withdraw: async (payload: { amount: number; paypalEmail: string }) => {
    const res = await api.post('/wallet/withdraw', payload);
    return res.data;
  },
};