import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Clock, CheckCircle2, LogOut } from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { Button } from './Button';

export const InactivityTimeoutModal: React.FC = () => {
  const { isLive, toggleLiveStatus } = useStream();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const lastActivityRef = useRef(Date.now());
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset activity timestamp on user interaction
  const resetActivity = () => {
    lastActivityRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
      setCountdown(60);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
  };

  useEffect(() => {
    if (!isLive) return;

    const handleUserActivity = () => {
      if (!showWarning) {
        lastActivityRef.current = Date.now();
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    // Inactivity check interval: 5 minutes (300,000 ms)
    const checkInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityRef.current;
      if (inactiveTime >= 300000 && !showWarning) {
        setShowWarning(true);
        setCountdown(60);
      }
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      clearInterval(checkInterval);
    };
  }, [isLive, showWarning]);

  // 60-second auto-close countdown
  useEffect(() => {
    if (showWarning) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!);
            toggleLiveStatus(); // auto-end meeting
            setShowWarning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [showWarning, toggleLiveStatus]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center animate-slide-up">
        
        {/* Warning Icon */}
        <div className="h-16 w-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <Clock className="h-8 w-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold text-obsidian tracking-tight">
            Are you still in the meeting?
          </h3>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            You've been inactive for over 5 minutes. To conserve WebRTC bandwidth and server resources, this call will automatically close in:
          </p>
        </div>

        {/* 60s Visual Timer Display */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-2">
          <span className="text-3xl font-heading font-bold text-amber-700 font-mono tracking-tight">
            00:{countdown.toString().padStart(2, '0')}
          </span>
          <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-1000 rounded-full"
              style={{ width: `${(countdown / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setShowWarning(false);
              toggleLiveStatus();
            }}
            className="flex-1 rounded-2xl text-xs font-semibold border-slate-200"
            leftIcon={<LogOut className="h-4 w-4 text-slate-500" />}
          >
            Leave Call
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={resetActivity}
            className="flex-1 rounded-2xl text-xs font-semibold shadow-solar-sm hover:shadow-solar-md"
            rightIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Stay in Call
          </Button>
        </div>

      </div>
    </div>
  );
};
