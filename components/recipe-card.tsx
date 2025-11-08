"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecipeData {
  title: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  difficulty?: string;
  ingredients: string[];
  steps: string[];
  image?: string;
}

interface RecipeCardProps {
  data: RecipeData;
  config?: ComponentConfig;
}

export const RecipeCard = ({ data, config = {} }: RecipeCardProps) => {
  if (!data) {
    return null;
  }

  const layout = config.layout || "modern";
  const showTimings = config.showTimings ?? true;
  const showDifficulty = config.showDifficulty ?? true;

  const getDifficultyColor = (difficulty?: string) => {
    const lower = difficulty?.toLowerCase() || "";
    if (lower.includes("easy")) return "text-green-600 dark:text-green-400";
    if (lower.includes("medium") || lower.includes("moderate"))
      return "text-yellow-600 dark:text-yellow-400";
    if (lower.includes("hard") || lower.includes("difficult"))
      return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        {/* Image */}
        {data.image && (
          <div className="w-full h-48 bg-muted">
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-foreground mb-3">
            {data.title}
          </CardTitle>

          {/* Meta Info */}
          {(showTimings || showDifficulty) && (
            <div className="flex flex-wrap gap-3 text-sm">
              {showTimings && data.prepTime && (
                <Badge variant="outline" className="gap-1.5">
                  <span className="text-base">⏱️</span>
                  <span>Prep: {data.prepTime}</span>
                </Badge>
              )}
              {showTimings && data.cookTime && (
                <Badge variant="outline" className="gap-1.5">
                  <span className="text-base">🔥</span>
                  <span>Cook: {data.cookTime}</span>
                </Badge>
              )}
              {data.servings && (
                <Badge variant="outline" className="gap-1.5">
                  <span className="text-base">🍽️</span>
                  <span>{data.servings} servings</span>
                </Badge>
              )}
              {showDifficulty && data.difficulty && (
                <Badge 
                  variant="secondary" 
                  className={`gap-1.5 font-medium ${getDifficultyColor(data.difficulty)}`}
                >
                  <span className="text-base">📊</span>
                  <span>{data.difficulty}</span>
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        {/* Ingredients */}
        <CardContent className="px-6 py-4 bg-muted/50">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
            Ingredients
          </h4>
          <div className="space-y-2">
            {data.ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <span className="text-primary mt-0.5">•</span>
                <span>{ingredient}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>

        {/* Steps */}
        <CardContent className="px-6 py-4">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
            Instructions
          </h4>
          <div className="space-y-3">
            {data.steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1 text-sm text-muted-foreground pt-0.5">
                  {step}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

