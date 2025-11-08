"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent } from "@/components/ui/card";

interface MediaItem {
  url: string;
  caption: string;
  title?: string;
  alt?: string;
}

interface MediaGridProps {
  data: MediaItem[];
  config?: ComponentConfig;
}

export const MediaGrid = ({ data, config = {} }: MediaGridProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const columns = config.columns || 2;
  const variant = config.variant || "grid";
  const size = config.size || "md";

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  const aspectRatio = {
    sm: "aspect-video",
    md: "aspect-square",
    lg: "aspect-[4/3]",
  };

  return (
    <div className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <div
        className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[2]} gap-3`}
      >
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className={aspectRatio[size]}>
                  <img
                    src={item.url}
                    alt={item.alt || item.caption || item.title || `Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay with caption */}
                {(item.caption || item.title) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {item.title && (
                        <div className="text-sm font-semibold text-white mb-1">
                          {item.title}
                        </div>
                      )}
                      {item.caption && (
                        <div className="text-xs text-white/90">{item.caption}</div>
                      )}
                    </div>
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

