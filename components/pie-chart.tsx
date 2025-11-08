"use client";

import { motion } from "framer-motion";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import NumberFlow from "@number-flow/react";

// Vibrant color palette for better visibility and distinction
const CHART_COLORS = [
  "hsl(220, 85%, 55%)",  // Bright blue
  "hsl(25, 95%, 55%)",   // Bright orange
  "hsl(140, 70%, 45%)",  // Green
  "hsl(280, 70%, 60%)",  // Purple
  "hsl(340, 85%, 55%)",  // Pink/Red
  "hsl(45, 90%, 55%)",   // Yellow
  "hsl(180, 70%, 45%)",  // Cyan
  "hsl(15, 85%, 60%)",   // Coral
];

interface DataPoint {
  label: string;
  value: number;
}

interface PieChartProps {
  data: DataPoint[];
  config?: ComponentConfig;
}

export const PieChart = ({ data, config = {} }: PieChartProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const variant = config.variant || "pie";
  const showPercentages = config.showPercentages ?? true;
  const theme = config.theme || "default";

  const colors = config.colors || CHART_COLORS;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const chartData = data.map((d, index) => ({
    name: d.label,
    value: d.value,
    color: colors[index % colors.length],
  }));

  // Create chart config for shadcn
  const chartConfig: ChartConfig = data.reduce((acc, item, index) => {
    acc[item.label] = {
      label: item.label,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as ChartConfig);

  const title = config.title;
  const subtitle = config.subtitle;

  return (
    <div className="w-full px-6 pt-6 pb-2 space-y-4">
      {(title || subtitle) && (
        <div className="space-y-1 pb-2">
          {title && <h3 className="text-base font-semibold tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
          <div className="w-full h-[280px]">
            <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={variant === "donut" ? 60 : 0}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </RechartsPieChart>
            </ChartContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground truncate">
                    {item.label}
                  </div>
                  {showPercentages && (
                    <div className="text-xs font-semibold text-foreground">
                      <NumberFlow 
                        value={(item.value / total) * 100} 
                        format={{ maximumFractionDigits: 1 }}
                        suffix="%"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
    </div>
  );
};

