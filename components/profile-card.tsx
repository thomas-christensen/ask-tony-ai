"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
  name: string;
  title?: string;
  description: string;
  avatar?: string;
  stats?: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; url: string }>;
}

interface ProfileCardProps {
  data: ProfileData;
  config?: ComponentConfig;
}

export const ProfileCard = ({ data, config = {} }: ProfileCardProps) => {
  if (!data) {
    return null;
  }

  const variant = config.variant || "default";
  const showStats = config.showStats ?? true;
  const theme = config.theme || "default";

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`
        ${
          theme === "minimal"
            ? "bg-transparent border border-border"
            : ""
        }
        overflow-hidden
      `}
      >
        <CardHeader className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="w-16 h-16">
              {data.avatar ? (
                <AvatarImage src={data.avatar} alt={data.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                  {data.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Name and Title */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground truncate">
                {data.name}
              </h3>
              {data.title && (
                <p className="text-sm text-muted-foreground mt-1">
                  {data.title}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            {data.description}
          </p>
        </CardHeader>

        {/* Stats */}
        {showStats && data.stats && data.stats.length > 0 && (
          <div className="px-6 py-4 bg-muted/50 border-t border-border">
            <div className="grid grid-cols-3 gap-4">
              {data.stats.slice(0, 3).map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <div className="text-xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {data.links && data.links.length > 0 && variant !== "compact" && (
          <div className="px-6 py-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {data.links.map((link, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => window.open(link.url, '_blank')}
                >
                  <span className="mr-1">🔗</span>
                  {link.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

