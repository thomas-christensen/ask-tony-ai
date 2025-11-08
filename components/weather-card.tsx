"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberFlow from "@number-flow/react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon?: string;
  humidity?: number;
  wind?: string;
  forecast?: Array<{ day: string; temp: number; condition: string }>;
}

interface WeatherCardProps {
  data: WeatherData;
  config?: ComponentConfig;
}

export const WeatherCard = ({ data, config = {} }: WeatherCardProps) => {
  if (!data) {
    return null;
  }

  const variant = config.variant || "current";
  const units = config.units || "celsius";
  const theme = config.theme || "default";

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes("sun") || lower.includes("clear")) return "☀️";
    if (lower.includes("cloud")) return "☁️";
    if (lower.includes("rain")) return "🌧️";
    if (lower.includes("storm")) return "⛈️";
    if (lower.includes("snow")) return "❄️";
    if (lower.includes("fog") || lower.includes("mist")) return "🌫️";
    return "🌤️";
  };

  const displayIcon = data.icon || getWeatherIcon(data.condition);
  const tempSymbol = units === "fahrenheit" ? "°F" : "°C";

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
          theme === "vibrant"
            ? "bg-gradient-to-br from-blue-400 to-cyan-500 text-white border-0"
            : ""
        }
        overflow-hidden
      `}
      >
        <CardHeader className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <CardTitle
                className={`text-lg font-medium mb-1 ${
                  theme === "vibrant"
                    ? "text-white"
                    : "text-foreground"
                }`}
              >
                {data.location}
              </CardTitle>
              <div
                className={`text-sm ${
                  theme === "vibrant"
                    ? "text-white/80"
                    : "text-muted-foreground"
                }`}
              >
                {data.condition}
              </div>
            </div>
            <div className="text-5xl">{displayIcon}</div>
          </div>

          <div
            className={`text-6xl font-bold mb-4 ${
              theme === "vibrant"
                ? "text-white"
                : "text-foreground"
            }`}
          >
            <NumberFlow value={data.temperature} suffix={tempSymbol} />
          </div>

          {/* Additional Details */}
          {(variant === "detailed" || variant === "forecast") &&
            (data.humidity || data.wind) && (
              <div
                className={`flex gap-6 pt-4 border-t ${
                  theme === "vibrant"
                    ? "border-white/20"
                    : "border-border"
                }`}
              >
                {data.humidity && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💧</span>
                    <div>
                      <div
                        className={`text-xs ${
                          theme === "vibrant"
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        Humidity
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          theme === "vibrant"
                            ? "text-white"
                            : "text-foreground"
                        }`}
                      >
                        <NumberFlow value={data.humidity} suffix="%" />
                      </div>
                    </div>
                  </div>
                )}
                {data.wind && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💨</span>
                    <div>
                      <div
                        className={`text-xs ${
                          theme === "vibrant"
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        Wind
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          theme === "vibrant"
                            ? "text-white"
                            : "text-foreground"
                        }`}
                      >
                        {data.wind}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
        </CardHeader>

        {/* Forecast */}
        {variant === "forecast" && data.forecast && data.forecast.length > 0 && (
          <CardContent
            className={`px-6 pb-6 pt-2 ${
              theme === "vibrant" ? "bg-black/10" : "bg-muted/50"
            }`}
          >
            <div className="grid grid-cols-3 gap-3">
              {data.forecast.slice(0, 3).map((day, index) => (
                <motion.div
                  key={index}
                  className={`text-center p-3 rounded-lg ${
                    theme === "vibrant"
                      ? "bg-white/10"
                      : "bg-background"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`text-xs font-medium mb-2 ${
                      theme === "vibrant"
                        ? "text-white/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {day.day}
                  </div>
                  <div className="text-2xl mb-1">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      theme === "vibrant"
                        ? "text-white"
                        : "text-foreground"
                    }`}
                  >
                    <NumberFlow value={day.temp} suffix={tempSymbol} />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

