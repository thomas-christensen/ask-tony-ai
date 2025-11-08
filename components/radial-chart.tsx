"use client";

import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { ComponentConfig } from "@/lib/agent-wrapper";
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
  label?: string;
  value: number;
}

interface RadialChartProps {
  data: DataPoint[] | { points: DataPoint[] };
  config?: ComponentConfig;
}

export const RadialChart = ({ data, config = {} }: RadialChartProps) => {
  if (!data) {
    return null;
  }

  // Normalize data format
  const points = Array.isArray(data) ? data : data.points || [];
  
  if (points.length === 0) {
    return null;
  }

  // For single value (progress/gauge style)
  if (points.length === 1) {
    const point = points[0];
    const value = point.value;
    const maxValue = config.maxValue || 100;
    const percentage = Math.min((value / maxValue) * 100, 100);
    
    // Determine color based on percentage thresholds
    let fillColor = config.colors?.[0] || CHART_COLORS[0];
    if (config.threshold) {
      if (percentage >= (config.threshold.high || 80)) {
        fillColor = "#10b981"; // green
      } else if (percentage >= (config.threshold.mid || 50)) {
        fillColor = "#f59e0b"; // orange
      } else {
        fillColor = "#ef4444"; // red
      }
    }

    const chartData = [
      {
        name: point.label || "value",
        value: percentage,
        fill: fillColor,
      }
    ];

    const chartConfig: ChartConfig = {
      value: {
        label: point.label || "Progress",
        color: fillColor,
      },
    };

    return (
      <div className="w-full px-6 pt-6 pb-2 space-y-4">
        {(config.title || config.subtitle) && (
          <div className="space-y-1">
            {config.title && <h3 className="text-base font-semibold tracking-tight">{config.title}</h3>}
            {config.subtitle && <p className="text-sm text-muted-foreground">{config.subtitle}</p>}
          </div>
        )}
        <div className="relative">
          <div className="w-full h-[200px]">
            <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                barSize={20}
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: "hsl(var(--muted))" }}
                  dataKey="value"
                  cornerRadius={10}
                  fill={fillColor}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </RadialBarChart>
            </ChartContainer>
          </div>

          {/* Center Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-foreground">
              <NumberFlow value={value} format={{ maximumFractionDigits: 1 }} suffix="%" />
            </div>
            {point.label && (
              <div className="text-sm text-muted-foreground mt-1">
                {point.label}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // For multiple values (stacked radial chart)
  const chartData = points.map((point, index) => ({
    name: point.label || `Item ${index + 1}`,
    value: point.value,
    fill: config.colors?.[index] || CHART_COLORS[index % CHART_COLORS.length],
  }));

  const chartConfig: ChartConfig = points.reduce((acc, point, index) => {
    const name = point.label || `Item ${index + 1}`;
    acc[name] = {
      label: name,
      color: config.colors?.[index] || CHART_COLORS[index % CHART_COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="w-full px-6 pt-6 pb-2 space-y-4">
      {(config.title || config.subtitle) && (
        <div className="space-y-1">
          {config.title && <h3 className="text-base font-semibold tracking-tight">{config.title}</h3>}
          {config.subtitle && <p className="text-sm text-muted-foreground">{config.subtitle}</p>}
        </div>
      )}
      <div className="w-full h-[280px]">
            <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={5}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadialBarChart>
            </ChartContainer>
          </div>
    </div>
  );
};

