"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CardItem {
  title: string;
  description?: string;
  details?: string[];
  icon?: string;
  [key: string]: any;
}

export const CardGrid = ({ items }: { items: CardItem[] }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-3">
                {item.icon && (
                  <div className="text-2xl mb-1">{item.icon}</div>
                )}
                <CardTitle className="text-sm font-semibold text-foreground">
                  {item.title}
                </CardTitle>
                {item.description && (
                  <CardDescription className="text-xs text-muted-foreground">
                    {item.description}
                  </CardDescription>
                )}
                {item.details && item.details.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1">
                    {item.details.map((detail, i) => (
                      <div
                        key={i}
                        className="text-xs text-muted-foreground"
                      >
                        {detail}
                      </div>
                    ))}
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

