"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NumberFlow from "@number-flow/react";

interface TimelineItem {
  title: string;
  description: string;
  time?: string;
  icon?: string;
  status?: "completed" | "active" | "upcoming";
}

interface TimelineViewProps {
  data: TimelineItem[];
  config?: ComponentConfig;
}

export const TimelineView = ({ data, config = {} }: TimelineViewProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const orientation = config.orientation || "vertical";
  const variant = config.variant || "default";
  const showIcons = config.showIcons ?? true;
  const animated = config.animated ?? true;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 dark:bg-green-400";
      case "active":
        return "bg-primary";
      case "upcoming":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const getStatusRingColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "ring-green-200 dark:ring-green-900";
      case "active":
        return "ring-primary/20";
      case "upcoming":
        return "ring-muted";
      default:
        return "ring-muted";
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "completed":
        return "default" as const;
      case "active":
        return "secondary" as const;
      case "upcoming":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  if (orientation === "horizontal") {
    return (
      <div className="w-full p-6">
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-max">
            {data.map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center flex-shrink-0 w-[140px]"
                initial={animated ? { opacity: 0, x: -20 } : {}}
                animate={animated ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {/* Icon/Dot */}
                <div className="relative mb-3">
                  <div
                    className={`w-10 h-10 rounded-full ${getStatusColor(item.status)} ${getStatusRingColor(item.status)} ring-4 flex items-center justify-center text-white font-semibold`}
                  >
                    {showIcons && item.icon ? (
                      <span className="text-lg">{item.icon}</span>
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  {index < data.length - 1 && (
                    <div className="absolute top-5 left-12 w-[100px] h-0.5 bg-zinc-300 dark:bg-zinc-600" />
                  )}
                </div>

                {/* Content */}
                <div className="text-center">
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {item.title}
                  </div>
                  {variant === "detailed" && (
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  )}
                  {item.time && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.time}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vertical orientation (default)
  return (
    <div className="w-full p-6">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {data.map((item, index) => (
            <motion.div
              key={index}
              className="relative flex gap-4"
              initial={animated ? { opacity: 0, y: 20 } : {}}
              animate={animated ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {/* Icon/Dot */}
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full ${getStatusColor(item.status)} ${getStatusRingColor(item.status)} ring-4 flex items-center justify-center text-white font-semibold z-10 relative`}
                >
                  {showIcons && item.icon ? (
                    <span className="text-lg">{item.icon}</span>
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-base font-semibold text-foreground">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status && (
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      )}
                      {item.time && (
                        <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {item.time}
                        </div>
                      )}
                    </div>
                  </div>
                  {(variant === "default" || variant === "detailed") && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

