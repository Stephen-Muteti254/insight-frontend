import api from "@/lib/api";

export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard-stats");
  return res.data;
};

export const getWithdrawals = async () => {
  const res = await api.get("/admin/withdrawals");
  return res.data;
};

export const updateWithdrawal = async (id: string, action: string) => {
  const res = await api.post(`/admin/withdrawals/${id}/action`, {
    action,
  });

  return res.data;
};