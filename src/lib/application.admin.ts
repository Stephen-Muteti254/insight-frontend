import api from "@/lib/api";

export interface AdminApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  answers: {
    experience: string;
    motivation: string;
    availability: string;
    bio: string;
  };
}

export const getAllApplicationsAdminApi = async (): Promise<AdminApplication[]> => {
  const { data } = await api.get("/application/admin/all");
  return data.applications;
};

export const approveApplicationAdminApi = async (applicationId: string) => {
  const { data } = await api.post(
    `/application/admin/${applicationId}/approve`
  );

  console.log(data);
  return data;
};

export const rejectApplicationAdminApi = async (
  applicationId: string,
  reason?: string
) => {
  const { data } = await api.post(
    `/application/admin/${applicationId}/reject`,
    { reason }
  );
  console.log(data);
  return data;
};
