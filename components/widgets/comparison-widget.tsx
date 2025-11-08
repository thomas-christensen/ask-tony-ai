'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';
import type { ComparisonData, Interaction } from '@/lib/widget-schema';

interface ComparisonWidgetProps {
  data: ComparisonData;
  config?: { variant?: 'table' | 'cards'; highlightDifferences?: boolean };
  interactions?: Interaction[];
}

export function ComparisonWidget({ data, config, interactions }: ComparisonWidgetProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(config?.variant || 'table');
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const hasToggleInteraction = interactions?.some(i => i.type === 'toggle');
  const hasHoverInteraction = interactions?.some(i => i.type === 'hover');

  // Get all unique feature keys with null safety
  const allFeatures = Array.from(
    new Set((data.options || []).flatMap(opt => Object.keys(opt?.features || {})))
  );

  const renderValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Icons.Check className="h-5 w-5 text-green-600 dark:text-green-400" />
      ) : (
        <Icons.X className="h-5 w-5 text-red-600 dark:text-red-400" />
      );
    }
    if (typeof value === 'number') {
      return <NumberFlow value={value} />;
    }
    return <span>{String(value)}</span>;
  };

  if (viewMode === 'cards') {
    return (
      <div className="w-full p-6 space-y-4">
        {(data.title || data.subtitle || hasToggleInteraction) && (
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {data.title && (
                <h3 className="text-base font-semibold tracking-tight">{data.title}</h3>
              )}
              {data.subtitle && (
                <p className="text-sm text-muted-foreground">{data.subtitle}</p>
              )}
            </div>
            {hasToggleInteraction && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex-shrink-0"
              >
                <Icons.Table className="h-4 w-4 mr-1" />
                Table
              </Button>
            )}
          </div>
        )}
        
        <div className="grid gap-3">
          {(data.options || []).map((option, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border transition-all",
                option.highlighted && "ring-2 ring-primary border-primary",
                hasHoverInteraction && hoveredOption === option.name && "shadow-lg"
              )}
              onMouseEnter={() => hasHoverInteraction && setHoveredOption(option.name)}
              onMouseLeave={() => hasHoverInteraction && setHoveredOption(null)}
            >
              <div className="pb-3">
                <div className="text-base font-semibold flex items-center justify-between">
                  {option.name}
                  {option.highlighted && (
                    <Badge>Recommended</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(option.features || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{renderValue(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Table view
  return (
    <div className="w-full p-6 space-y-4">
      {(data.title || data.subtitle || hasToggleInteraction) && (
        <div className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            {data.title && (
              <h3 className="text-base font-semibold tracking-tight">{data.title}</h3>
            )}
            {data.subtitle && (
              <p className="text-sm text-muted-foreground">{data.subtitle}</p>
            )}
          </div>
          {hasToggleInteraction && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('cards')}
              className="flex-shrink-0"
            >
              <Icons.LayoutGrid className="h-4 w-4 mr-1" />
              Cards
            </Button>
          )}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                Feature
              </th>
              {(data.options || []).map((option, index) => (
                <th
                  key={index}
                  className={cn(
                    "text-center p-3 text-sm font-medium",
                    option.highlighted && "bg-primary/5"
                  )}
                  onMouseEnter={() => hasHoverInteraction && setHoveredOption(option.name)}
                  onMouseLeave={() => hasHoverInteraction && setHoveredOption(null)}
                >
                  <div className="flex flex-col items-center gap-1">
                    {option.name}
                    {option.highlighted && (
                      <Badge variant="secondary" className="text-xs">Best</Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((feature, featureIndex) => (
              <tr
                key={featureIndex}
                className="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td className="p-3 text-sm font-medium">{feature}</td>
                {(data.options || []).map((option, optIndex) => (
                  <td
                    key={optIndex}
                    className={cn(
                      "text-center p-3 text-sm",
                      option.highlighted && "bg-primary/5"
                    )}
                  >
                    {renderValue(option.features?.[feature] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

