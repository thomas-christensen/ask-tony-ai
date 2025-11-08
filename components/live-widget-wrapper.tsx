"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { LiveIndicator } from "./live-indicator";
import type { Widget, PlanResult } from "@/lib/widget-schema";

interface LiveWidgetWrapperProps {
  widget: Widget;
  plan: PlanResult;
  query: string;
  dataMode?: 'web-search' | 'example-data';
  renderWidget: (widget: Widget) => ReactNode;
}
export function LiveWidgetWrapper({
  widget,
  plan,
  query,
  dataMode,
  renderWidget
}: LiveWidgetWrapperProps) {
  const [currentWidget, setCurrentWidget] = useState<Widget>(widget);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [remainingRefreshes, setRemainingRefreshes] = useState<number>(50);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const widgetIdRef = useRef<string>(`widget-${Date.now()}-${Math.random()}`);

  const updateInterval = currentWidget.updateInterval || 30000;
  const minInterval = Math.max(updateInterval, 5000);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        startRefreshInterval();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    startRefreshInterval();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [minInterval, plan, query, dataMode]);

  const startRefreshInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isPaused || document.hidden) {
      return;
    }

    intervalRef.current = setInterval(() => {
      void refreshData();
    }, minInterval);
  };

  const refreshData = async () => {
    if (isPaused) return;

    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          query,
          dataMode,
          widgetId: widgetIdRef.current
        }),
      });

      if (response.status === 429) {
        const errorData = await response.json();
        console.warn('Rate limit exceeded:', errorData.message);
        setIsPaused(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const refreshData = await response.json();

      setCurrentWidget((prev: Widget) => ({
        ...prev,
        data: refreshData.data,
        lastUpdated: refreshData.refreshedAt
      }));

      setLastUpdated(refreshData.refreshedAt);
      setRemainingRefreshes(refreshData.remainingRefreshes || 50);

    } catch (error) {
      console.error('Failed to refresh widget:', error);
    }
  };

  return (
    <div className="relative">
      <LiveIndicator
        updateInterval={minInterval}
        isPaused={isPaused}
        lastUpdated={lastUpdated}
        remainingRefreshes={remainingRefreshes}
      />

      {renderWidget(currentWidget)}
    </div>
  );
}

