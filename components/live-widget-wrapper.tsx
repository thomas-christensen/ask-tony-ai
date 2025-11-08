"use client";

import { useState, useEffect, useRef } from "react";
import { LiveIndicator } from "./live-indicator";
import type { Widget, PlanResult } from "@/lib/widget-schema";

interface LiveWidgetWrapperProps {
  widget: Widget;
  plan: PlanResult;
  query: string;
  dataMode?: 'web-search' | 'example-data';
  renderWidget: (widget: Widget) => React.ReactNode;
}

/**
 * Wraps widgets with auto-refresh capability
 * Handles periodic data fetching and state updates
 */
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const widgetIdRef = useRef<string>(`widget-${Date.now()}-${Math.random()}`);

  const updateInterval = currentWidget.updateInterval || 30000; // Default 30s
  const minInterval = Math.max(updateInterval, 5000); // Enforce minimum 5s

  useEffect(() => {
    // Pause when tab is hidden to save credits
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🛑 Tab hidden - pausing widget refresh');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        console.log('▶️ Tab visible - resuming widget refresh');
        startRefreshInterval();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start initial interval
    startRefreshInterval();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [minInterval, plan, query, dataMode]);

  const startRefreshInterval = () => {
    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Don't start if paused or tab hidden
    if (isPaused || document.hidden) {
      return;
    }

    // Set up new interval
    intervalRef.current = setInterval(async () => {
      await refreshData();
    }, minInterval);
  };

  const refreshData = async () => {
    if (isPaused) return;

    try {
      console.log('🔄 Refreshing widget data...');

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
        // Rate limit exceeded - pause updates
        const errorData = await response.json();
        console.warn('⚠️ Rate limit exceeded:', errorData.message);
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
      
      // Update widget with new data - this triggers a re-render
      setCurrentWidget(prev => ({
        ...prev,
        data: refreshData.data,
        lastUpdated: refreshData.refreshedAt
      }));

      setLastUpdated(refreshData.refreshedAt);
      setRemainingRefreshes(refreshData.remainingRefreshes || 50);

      console.log('✅ Widget data refreshed', refreshData.data);
    } catch (error) {
      console.error('❌ Failed to refresh widget:', error);
      // Don't pause on error - keep trying
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
      
      {/* Render widget with current data - re-renders when currentWidget changes */}
      {renderWidget(currentWidget)}
    </div>
  );
}

