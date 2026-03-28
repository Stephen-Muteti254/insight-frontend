import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSurveyTimerProps {
  expiresAt: string | null;
  onExpire: () => void;
}

interface UseSurveyTimerReturn {
  timeRemaining: number; // in seconds
  isExpired: boolean;
  percentElapsed: number;
  formattedTime: string;
}

export function useSurveyTimer({ expiresAt, onExpire }: UseSurveyTimerProps): UseSurveyTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const initialDuration = useRef<number>(0);
  const onExpireRef = useRef(onExpire);

  // Keep onExpire ref updated
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!expiresAt) {
      setIsExpired(false)
      setTimeRemaining(0)
      return
    }

    const expiryTime = new Date(expiresAt).getTime()

    if (isNaN(expiryTime)) {
      console.error("Invalid expiresAt:", expiresAt)
      setIsExpired(false)
      setTimeRemaining(0)
      return
    }

    // RESET when new survey starts
    initialDuration.current = 0

    const now = Date.now();
    const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
    
    // Set initial duration on first calculation
    if (initialDuration.current === 0) {
      initialDuration.current = remaining;
    }
    
    setTimeRemaining(remaining);

    if (remaining <= 0 && expiresAt) {
      setIsExpired(true);
      onExpireRef.current();
      return;
    }

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const newRemaining = Math.max(0, Math.floor((expiryTime - currentTime) / 1000));
      
      setTimeRemaining(newRemaining);
      
      if (newRemaining <= 0) {
        setIsExpired(true);
        onExpireRef.current();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const percentElapsed = initialDuration.current > 0 
    ? ((initialDuration.current - timeRemaining) / initialDuration.current) * 100
    : 0;

  return {
    timeRemaining,
    isExpired,
    percentElapsed,
    formattedTime: formatTime(timeRemaining),
  };
}
