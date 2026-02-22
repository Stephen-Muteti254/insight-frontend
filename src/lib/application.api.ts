import api from "@/lib/api";

export interface SubmitApplicationResponse {
  success: boolean;
}

export const submitApplicationApi = async (
  answers: Record<string, string>
): Promise<SubmitApplicationResponse> => {
  const { data } = await api.post(
    "/application/submit",
    answers
  );
  return data;
};

export interface ApplicationStatusResponse {
  exists: boolean;
  status?: string;
  submittedAt?: string;
}

export const getApplicationStatusApi = async (): Promise<ApplicationStatusResponse> => {
  const { data } = await api.get("/application/status");
  return data;
};
