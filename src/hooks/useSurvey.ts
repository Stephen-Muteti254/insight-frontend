import { useState, useCallback } from "react";
import api from "@/lib/api";
import type {
  Survey,
  SurveyRunnerState,
  SurveyError,
} from "@/types/survey";

export function useSurvey() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [state, setState] = useState<SurveyRunnerState>("loading");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<SurveyError | null>(null);
  const [rewardCredited, setRewardCredited] = useState<number | null>(null);

  const fetchSurvey = useCallback(async (surveyId: string) => {
    try {
      setState("loading");
      const res = await api.get(`/surveys/${surveyId}`);
      setSurvey(res.data.data);
      setState("ready");
    } catch (err: any) {
      setError({
        code: "FETCH_ERROR",
        message: err.message,
      });
      setState("error");
    }
  }, []);

  const startSurvey = useCallback(async (surveyId: string) => {
    try {
      setState("loading");
      const res = await api.post(`/surveys/${surveyId}/start`);
      setExpiresAt(res.data.data?.expiresAt || res.data.attempt.expiresAt);
      setState("in_progress");
      return true;
    } catch (err: any) {
      setError({
        code: "START_ERROR",
        message: err.message,
      });
      setState("error");
      return false;
    }
  }, []);

  const completeSurvey = useCallback(async (surveyId: string) => {
    try {
      setState("completing");
      const res = await api.post(`/surveys/${surveyId}/complete`);
      setRewardCredited(res.data.data.rewardCredited);
      setState("completed");
      return true;
    } catch (err: any) {
      if (err.status === 400 && err.message.includes("expired")) {
        setState("expired");
      } else {
        setError({
          code: "COMPLETE_ERROR",
          message: err.message,
        });
        setState("error");
      }
      return false;
    }
  }, []);

  return {
    survey,
    state,
    expiresAt,
    error,
    rewardCredited,
    fetchSurvey,
    startSurvey,
    completeSurvey,
  };
}