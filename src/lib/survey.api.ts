import api from './api';

export const getAllSurveysAdmin = async () => {
  const res = await api.get('/admin/surveys');
  return res.data.data;
};

export const createSurveyAdmin = async (formData: FormData) => {
  const res = await api.post('/admin/surveys', formData);
  return res.data.data;
};

export const updateSurveyAdmin = async (id: string, payload: any) => {
  const res = await api.put(`/admin/surveys/${id}`, payload);
  return res.data.data;
};

export const deleteSurveyAdmin = async (id: string) => {
  await api.delete(`/admin/surveys/${id}`);
};

export const getAvailableSurveys = async () => {
  const res = await api.get('/surveys/public');
  return res.data.data;
};

export const startSurvey = async (surveyId: string) => {
  const res = await api.post(`/surveys/${surveyId}/start`);
  return res.data.data;
};
