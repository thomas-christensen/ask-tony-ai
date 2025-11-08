"use client";

import { motion } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
} from "recharts";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import NumberFlow from "@number-flow/react";

// Monochrome color palette
const MONOCHROME_COLORS = [
  "hsl(var(--foreground))",        // Primary black/dark
  "hsl(var(--muted-foreground))",  // Secondary grey
  "hsl(var(--muted))",             // Light grey
  "hsl(var(--border))",            // Border grey
  "hsl(var(--secondary))",         // Secondary background
  "hsl(var(--accent))",            // Accent grey
  "hsl(var(--card-foreground))",    // Card text
  "hsl(var(--popover-foreground))", // Popover text
];

interface GaugeData {
  value: number;
  max: number;
  label: string;
}

interface GaugeChartProps {
  data: GaugeData;
  config?: ComponentConfig;
}

export const GaugeChart = ({ data, config = {} }: GaugeChartProps) => {
  if (!data) {
    return null;
  }

  const color = config.color || MONOCHROME_COLORS[0];
  const variant = config.variant || "semi";
  const showValue = config.showValue ?? true;

  const percentage = (data.value / data.max) * 100;
  const remaining = data.max - data.value;

  // Color based on thresholds
  let gaugeColor = color;
  if (config.threshold) {
    if (percentage < config.threshold.low) {
      gaugeColor = "#ef4444"; // red
    } else if (percentage < config.threshold.mid) {
      gaugeColor = "#f59e0b"; // orange
    } else {
      gaugeColor = "#10b981"; // green
    }
  }

  // Prepare data for RadialBarChart
  const chartData = [
    {
      name: "value",
      value: data.value,
      fill: gaugeColor,
    },
    {
      name: "remaining",
      value: remaining,
      fill: "hsl(var(--muted))",
    },
  ];

  // Create chart config for shadcn
  const chartConfig: ChartConfig = {
    value: {
      label: data.label,
      color: gaugeColor,
    },
    remaining: {
      label: "Remaining",
      color: "hsl(var(--muted))",
    },
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{data.label}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative">
            <div className="w-full h-[240px]">
              <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                <RadialBarChart
                  cx="50%"
                  cy={variant === "semi" ? "80%" : "50%"}
                  innerRadius={variant === "semi" ? "20%" : "30%"}
                  outerRadius={variant === "semi" ? "70%" : "80%"}
                  barSize={variant === "semi" ? 20 : 15}
                  data={chartData}
                  startAngle={variant === "semi" ? 180 : 0}
                  endAngle={variant === "semi" ? 0 : 360}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={gaugeColor}
                  />
                </RadialBarChart>
              </ChartContainer>
            </div>

            {/* Center Value */}
            {showValue && (
              <div
                className={`absolute inset-0 flex flex-col items-center ${
                  variant === "semi" ? "justify-end pb-8" : "justify-center"
                }`}
              >
                <div className="text-4xl font-bold text-foreground">
                  <NumberFlow value={data.value} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  out of {data.max}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <NumberFlow value={percentage} format={{ maximumFractionDigits: 1 }} suffix="%" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

