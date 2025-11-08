"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import NumberFlow from "@number-flow/react";

interface StatItem {
  value: string | number;
  label: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: string;
}

interface StatCardProps {
  data: StatItem[];
  config?: ComponentConfig;
}

export const StatCard = ({ data, config = {} }: StatCardProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const size = config.size || "md";
  const variant = config.variant || "default";
  const showTrend = config.showTrend ?? true;

  const getTrendColor = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-600 dark:text-green-400";
      case "down":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const valueSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <div
        className={`grid gap-3 ${
          data.length === 1
            ? "grid-cols-1"
            : data.length === 2
              ? "grid-cols-2"
              : data.length === 3
                ? "grid-cols-3"
                : "grid-cols-2 sm:grid-cols-2"
        }`}
      >
        {data.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card
              className={`
                ${sizeClasses[size]}
                ${
                  variant === "highlighted"
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800"
                    : variant === "minimal"
                      ? "bg-transparent border border-border"
                      : ""
                }
              `}
            >
              <CardContent className="p-0">
                {/* Icon */}
                {stat.icon && (
                  <div className="text-2xl mb-2 opacity-80">{stat.icon}</div>
                )}

                {/* Value */}
                <div
                  className={`${valueSizeClasses[size]} font-bold text-foreground`}
                >
                  {typeof stat.value === 'number' ? (
                    <NumberFlow value={stat.value} />
                  ) : (
                    stat.value
                  )}
                </div>

                {/* Label */}
                <div
                  className={`${labelSizeClasses[size]} text-muted-foreground mt-1`}
                >
                  {stat.label}
                </div>

                {/* Change/Trend */}
                {showTrend && stat.change && (
                  <div
                    className={`flex items-center gap-1 mt-2 text-sm font-medium ${getTrendColor(stat.trend)}`}
                  >
                    <span className="text-base">
                      {getTrendIcon(stat.trend)}
                    </span>
                    <span>{stat.change}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

