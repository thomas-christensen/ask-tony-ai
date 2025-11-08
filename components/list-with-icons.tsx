"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ListItem {
  text: string;
  icon?: string;
  subtext?: string;
  highlight?: boolean;
}

interface ListWithIconsProps {
  data: ListItem[];
  config?: ComponentConfig;
}

export const ListWithIcons = ({ data, config = {} }: ListWithIconsProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const variant = config.variant || "default";
  const size = config.size || "md";
  const showIcons = config.showIcons ?? true;

  const getDefaultIcon = (index: number) => {
    if (variant === "checklist") return "✓";
    if (variant === "numbered") return `${index + 1}`;
    return "•";
  };

  const itemClasses = {
    sm: "py-2 gap-3",
    md: "py-3 gap-3",
    lg: "py-4 gap-4",
  };

  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {data.map((item, index) => (
              <motion.div
                key={index}
                className={`flex items-start px-4 ${itemClasses[size]} ${
                  item.highlight
                    ? "bg-blue-50 dark:bg-blue-950/30"
                    : "hover:bg-muted/50"
                } transition-colors`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Icon */}
                {showIcons && (
                  <div className="flex-shrink-0 mt-0.5">
                    {variant === "checklist" ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 dark:bg-green-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {item.icon || getDefaultIcon(index)}
                        </span>
                      </div>
                    ) : variant === "numbered" ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-bold">
                          {item.icon || getDefaultIcon(index)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl leading-none">
                        {item.icon || "•"}
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`${textClasses[size]} font-medium text-foreground ${
                      item.highlight ? "font-semibold" : ""
                    }`}
                  >
                    {item.text}
                  </div>
                  {item.subtext && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.subtext}
                    </div>
                  )}
                </div>

                {/* Highlight Badge */}
                {item.highlight && (
                  <Badge variant="secondary" className="ml-2">
                    Featured
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

