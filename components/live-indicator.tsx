"use client";

import { useState, useEffect } from "react";

interface LiveIndicatorProps {
  updateInterval: number; // milliseconds
  isPaused: boolean;
  lastUpdated?: string;
  remainingRefreshes?: number;
}

/**
 * Subtle live indicator showing auto-refresh status
 * Displays as a small pulsing dot in the top-right corner of widgets
 */
export function LiveIndicator({ 
  updateInterval, 
  isPaused, 
  lastUpdated,
  remainingRefreshes = 50
}: LiveIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const intervalSeconds = Math.round(updateInterval / 1000);
  const intervalDisplay = intervalSeconds < 60 
    ? `${intervalSeconds}s` 
    : `${Math.round(intervalSeconds / 60)}m`;

  const lastUpdatedDisplay = lastUpdated 
    ? new Date(lastUpdated).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    : 'Just now';

  return (
    <div 
      className="absolute top-2 right-2 z-10"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Pulsing dot */}
      <div className="relative">
        <div
          className={`
            w-2 h-2 rounded-full
            ${isPaused 
              ? 'bg-gray-400 dark:bg-gray-600' 
              : 'bg-green-500 dark:bg-green-400 animate-pulse'
            }
          `}
        />
        
        {/* Tooltip */}
        {showTooltip && (
          <div
            className="
              absolute top-full right-0 mt-2
              px-3 py-2 rounded-lg
              bg-black dark:bg-white
              text-white dark:text-black
              text-xs font-medium
              whitespace-nowrap
              shadow-lg
              z-20
            "
          >
            {isPaused ? (
              <div>
                <div className="font-semibold">Updates paused</div>
                <div className="text-gray-300 dark:text-gray-700 mt-0.5">
                  Refresh limit reached
                </div>
              </div>
            ) : (
              <div>
                <div className="font-semibold">Live • Updates every {intervalDisplay}</div>
                <div className="text-gray-300 dark:text-gray-700 mt-0.5">
                  Last updated: {lastUpdatedDisplay}
                </div>
                {remainingRefreshes <= 10 && (
                  <div className="text-yellow-400 dark:text-yellow-600 mt-0.5">
                    {remainingRefreshes} refreshes remaining
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

