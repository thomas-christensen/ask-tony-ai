'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';
import type { MetricCardData, Interaction } from '@/lib/widget-schema';

interface MetricCardProps {
  data: MetricCardData;
  interactions?: Interaction[];
}

export function MetricCard({ data, interactions }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasHoverInteraction = interactions?.some(i => i.type === 'hover');
  const hasClickInteraction = interactions?.some(i => i.type === 'click');

  // Get icon component dynamically
  const IconComponent = data.icon ? (Icons as any)[data.icon] : null;

  const getTrendColor = () => {
    switch (data.trendDirection) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (data.trendDirection) {
      case 'up': return <Icons.TrendingUp className="h-4 w-4" />;
      case 'down': return <Icons.TrendingDown className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div
      className={cn(
        "w-full p-6 space-y-4 transition-all duration-200",
        hasClickInteraction && "cursor-pointer",
        isExpanded && "ring-2 ring-primary"
      )}
      onMouseEnter={() => hasHoverInteraction && setIsHovered(true)}
      onMouseLeave={() => hasHoverInteraction && setIsHovered(false)}
      onClick={() => hasClickInteraction && setIsExpanded(!isExpanded)}
    >
      {(data.title || hasClickInteraction) && (
        <div className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            {data.title && (
              <h3 className="text-base font-semibold tracking-tight">{data.title}</h3>
            )}
            {data.subtitle && (
              <p className="text-sm text-muted-foreground">{data.subtitle}</p>
            )}
          </div>
          {hasClickInteraction && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isExpanded ? (
                <Icons.ChevronUp className="h-4 w-4" />
              ) : (
                <Icons.ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {data.label}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold">
                {typeof data.value === 'number' ? (
                  <NumberFlow value={data.value} />
                ) : (
                  data.value
                )}
              </div>
              {data.unit && (
                <span className="text-xl text-muted-foreground">{data.unit}</span>
              )}
            </div>
          </div>
        </div>

        {data.trend && (
          <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
            {getTrendIcon()}
            <span>{data.trend}</span>
          </div>
        )}

        {(isHovered || isExpanded) && data.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-4 border-t border-border"
          >
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface MetricGridProps {
  data: { title?: string; subtitle?: string; metrics: MetricCardData[] };
  interactions?: Interaction[];
}

export function MetricGrid({ data, interactions }: MetricGridProps) {
  return (
    <div className="w-full p-6 space-y-4">
      {(data.title || data.subtitle) && (
        <div className="space-y-1">
          {data.title && (
            <h3 className="text-base font-semibold tracking-tight">{data.title}</h3>
          )}
          {data.subtitle && (
            <p className="text-sm text-muted-foreground">{data.subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {(data.metrics || []).map((metric, index) => (
          <div key={index} className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border/40">
            <div className="text-xs font-medium text-muted-foreground">
              {metric.label}
            </div>
            <div className="text-2xl font-bold">
              {typeof metric.value === 'number' ? (
                <NumberFlow value={metric.value} />
              ) : (
                metric.value
              )}
              {metric.unit && (
                <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
              )}
            </div>
            {metric.trend && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                metric.trendDirection === 'up' ? 'text-green-600 dark:text-green-400' :
                metric.trendDirection === 'down' ? 'text-red-600 dark:text-red-400' :
                'text-muted-foreground'
              )}>
                {metric.trendDirection === 'up' && <Icons.TrendingUp className="h-3 w-3" />}
                {metric.trendDirection === 'down' && <Icons.TrendingDown className="h-3 w-3" />}
                <span>{metric.trend}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

