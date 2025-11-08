"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ComponentConfig } from "@/lib/agent-wrapper";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

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

interface Dataset {
  name: string;
  values: number[];
  color?: string;
}

interface MultiDatasetFormat {
  labels: string[];
  datasets: Dataset[];
}

interface BarChartProps {
  data: DataPoint[] | MultiDatasetFormat;
  config?: ComponentConfig;
}

export const BarChart = ({ data, config = {} }: BarChartProps) => {
  if (!data) {
    return null;
  }

  // Detect data format: multi-dataset or single dataset
  const isMultiDataset = !Array.isArray(data) && 'labels' in data && 'datasets' in data;

  let chartData: any[];
  let chartConfig: ChartConfig;

  const variant = config.variant || "vertical";
  const theme = config.theme || "default";
  const grouping = config.grouping || "grouped";

  if (isMultiDataset) {
    // Multi-dataset format
    const multiData = data as MultiDatasetFormat;
    if (!multiData.datasets || multiData.datasets.length === 0) {
      return null;
    }
    
    // Transform to Recharts format
    chartData = multiData.labels.map((label, index) => {
      const dataPoint: any = { name: label };
      multiData.datasets.forEach((dataset) => {
        dataPoint[dataset.name] = dataset.values[index];
      });
      return dataPoint;
    });

    // Create chart config for shadcn with theme-aware colors
    chartConfig = multiData.datasets.reduce((acc, dataset, idx) => {
      const providedColor = dataset.color || config.colors?.[idx];
      
      // Validate color - reject white, transparent, or invalid colors
      const isValidColor = providedColor && 
        providedColor !== '#fff' && 
        providedColor !== '#ffffff' && 
        providedColor !== 'white' &&
        providedColor !== 'transparent' &&
        providedColor !== 'none' &&
        providedColor.trim() !== '';
      
      if (isValidColor) {
        // Use provided color
        acc[dataset.name] = {
          label: dataset.name,
          color: providedColor,
        };
      } else {
        // Use vibrant color palette as fallback
        acc[dataset.name] = {
          label: dataset.name,
          color: CHART_COLORS[idx % CHART_COLORS.length],
        };
      }
      return acc;
    }, {} as ChartConfig);
  } else {
    // Single dataset format (backward compatible)
    const singleData = data as DataPoint[];
    if (singleData.length === 0) {
      return null;
    }

    chartData = singleData.map((d) => ({
      name: d.label,
      value: d.value,
    }));

    const primaryColor = config.colors?.[0];

    chartConfig = {
      value: {
        label: "Value",
        color: primaryColor || CHART_COLORS[0],
      },
    };
  }

  const showLegend = config.showLegend ?? (isMultiDataset && Object.keys(chartConfig).length > 1);
  const title = config.title || (isMultiDataset && chartData.length > 0 ? chartConfig[Object.keys(chartConfig)[0]]?.label : null);
  const subtitle = config.subtitle;
  
  // Calculate optimal bar size based on number of data points and datasets
  const numDataPoints = chartData.length;
  const numDatasets = Object.keys(chartConfig).length;
  const isGrouped = grouping === "grouped";
  
  // Dynamic bar size calculation for better visual balance
  let barSize: number | undefined;
  if (variant === "vertical") {
    if (numDataPoints <= 6) {
      barSize = isGrouped ? 40 : 60;
    } else if (numDataPoints <= 12) {
      barSize = isGrouped ? 25 : 40;
    } else {
      barSize = isGrouped ? 15 : 25;
    }
  } else {
    // Horizontal bars can be a bit smaller
    barSize = 30;
  }
  
  return (
    <div className="w-full px-6 pt-6 pb-2 space-y-4">
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h3 className="text-base font-semibold tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className="w-full h-[280px]">
            <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
              <RechartsBarChart 
                data={chartData}
                layout={variant === "horizontal" ? "horizontal" : "vertical"}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                barSize={barSize}
                barCategoryGap={isGrouped ? "15%" : "20%"}
                barGap={isGrouped ? 4 : 0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 80%)" strokeOpacity={0.5} />
                {variant === "horizontal" ? (
                  <>
                    <XAxis 
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                      stroke="hsl(0, 0%, 40%)"
                    />
                    <YAxis 
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                      stroke="hsl(0, 0%, 40%)"
                    />
                  </>
                ) : (
                  <>
                    <XAxis 
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                      stroke="hsl(0, 0%, 40%)"
                    />
                    <YAxis 
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                      stroke="hsl(0, 0%, 40%)"
                    />
                  </>
                )}
                <ChartTooltip content={<ChartTooltipContent />} />
                {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                {Object.keys(chartConfig).map((key) => {
                  // Use CSS variable for both color and theme properties
                  return (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={`var(--color-${key})`}
                      stackId={grouping === "stacked" ? "stack" : undefined}
                      radius={[4, 4, 0, 0]}
                    />
                  );
                })}
              </RechartsBarChart>
            </ChartContainer>
          </div>
    </div>
  );
};

