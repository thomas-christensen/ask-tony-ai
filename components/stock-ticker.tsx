"use client";

import { motion } from "framer-motion";
import {
  LineChart as RechartsLineChart,
  Line,
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

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  history?: Array<{ date: string; price: number }>;
  volume?: number;
}

interface StockTickerProps {
  data: StockData;
  config?: ComponentConfig;
}

export const StockTicker = ({ data, config = {} }: StockTickerProps) => {
  if (!data) {
    return null;
  }

  const variant = config.variant || "detailed";
  const showSparkline = config.showSparkline ?? true;
  const positiveColor = config.colors?.[0] || MONOCHROME_COLORS[0];
  const negativeColor = config.colors?.[1] || MONOCHROME_COLORS[1];

  const isPositive = data.change >= 0;
  const changeColor = isPositive ? positiveColor : negativeColor;

  // Prepare sparkline data for Recharts
  const sparklineData = data.history
    ? data.history.map((h) => ({
        date: h.date,
        price: h.price,
      }))
    : null;

  // Create chart config for shadcn
  const chartConfig: ChartConfig = {
    price: {
      label: "Price",
      color: changeColor,
    },
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader>
          <CardTitle>{data.symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-foreground">
                <NumberFlow 
                  value={data.price} 
                  format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 2 }}
                />
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-semibold ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                <NumberFlow 
                  value={data.change} 
                  format={{ signDisplay: 'always', minimumFractionDigits: 2 }}
                />
              </div>
              <div
                className={`text-sm font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                <NumberFlow 
                  value={data.changePercent} 
                  format={{ signDisplay: 'always', minimumFractionDigits: 2 }}
                  suffix="%"
                />
              </div>
            </div>
          </div>

          {/* Sparkline */}
          {showSparkline && sparklineData && variant === "detailed" && (
            <div className="mt-4">
              <ChartContainer config={chartConfig} className="h-[80px]">
                <RechartsLineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={changeColor}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={false}
                  />
                </RechartsLineChart>
              </ChartContainer>
            </div>
          )}

          {/* Additional Info */}
          {variant === "detailed" && data.volume && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-medium text-foreground">
                  <NumberFlow 
                    value={data.volume / 1000000} 
                    format={{ maximumFractionDigits: 2 }}
                    suffix="M"
                  />
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

