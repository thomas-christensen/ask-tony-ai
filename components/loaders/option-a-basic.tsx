"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface BasicSkeletonProps {
  stage: number;
  plan: any;
  dataResult: any;
  userQuery: string;
}

/**
 * Option A: Basic Shimmer Skeleton
 * Creative morphing layouts with shimmer effect that become more granular each stage
 */
export function OptionABasic({ stage, plan }: BasicSkeletonProps) {
  const intent = plan?.intent || 'generic';
  const [seed] = useState(() => Math.random());
  
  // Pick different layout based on stage for morphing effect
  const layoutIndex = Math.floor((stage + seed * 100) % 8);

  // Determine skeleton shape based on stage and intent
  const getSkeletonLayout = () => {
    // Stage 1: 8 random generic layout variants that change per stage
    if (stage === 1) {
      switch (layoutIndex) {
        case 0:
          return (
            <div>
              <div className="flex items-center justify-between">
                <motion.div layoutId="header-main" className="h-7 w-40 rounded-lg bg-muted/30" />
                <motion.div layoutId="header-action" className="h-7 w-7 rounded-full bg-muted/30" />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <motion.div layoutId="grid-1" className="h-28 col-span-2 rounded-lg bg-muted/30" />
                <motion.div layoutId="grid-2" className="h-28 rounded-lg bg-muted/30" />
              </div>
              <div className="flex gap-3 mt-3">
                <motion.div layoutId="sec-1" className="h-14 flex-1 rounded-lg bg-muted/30" />
                <motion.div layoutId="sec-2" className="h-14 flex-1 rounded-lg bg-muted/30" />
              </div>
            </div>
          );
        
        case 1:
          return (
            <div>
              <motion.div layoutId="header-main" className="h-8 w-full rounded-lg bg-muted/30" />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <motion.div layoutId="grid-1" className="h-32 rounded-lg bg-muted/30" />
                <motion.div layoutId="grid-2" className="h-32 rounded-lg bg-muted/30" />
              </div>
              <div className="flex gap-2 mt-3">
                <motion.div layoutId="sec-1" className="h-10 w-20 rounded-lg bg-muted/30" />
                <motion.div layoutId="sec-2" className="h-10 w-20 rounded-lg bg-muted/30" />
                <motion.div layoutId="header-action" className="h-10 w-20 rounded-lg bg-muted/30" />
              </div>
            </div>
          );
        
        case 2:
          return (
            <div>
              <div className="flex gap-3">
                <motion.div layoutId="header-action" className="h-10 w-10 rounded-full bg-muted/30" />
                <motion.div layoutId="header-main" className="h-10 flex-1 rounded-lg bg-muted/30" />
              </div>
              <motion.div layoutId="grid-1" className="h-40 w-full rounded-lg bg-muted/30 mt-3" />
              <div className="grid grid-cols-3 gap-2 mt-3">
                <motion.div layoutId="grid-2" className="h-12 rounded-lg bg-muted/30" />
                <motion.div layoutId="sec-1" className="h-12 rounded-lg bg-muted/30" />
                <motion.div layoutId="sec-2" className="h-12 rounded-lg bg-muted/30" />
              </div>
            </div>
          );
        
        case 3:
          return (
            <div>
              <motion.div layoutId="header-main" className="h-6 w-32 rounded-lg bg-muted/30" />
              <div className="flex gap-3 mt-3">
                <motion.div layoutId="grid-1" className="h-36 flex-1 rounded-lg bg-muted/30" />
                <div className="flex flex-col gap-3">
                  <motion.div layoutId="header-action" className="h-16 w-16 rounded-lg bg-muted/30" />
                  <motion.div layoutId="grid-2" className="h-16 w-16 rounded-lg bg-muted/30" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <motion.div layoutId="sec-1" className="h-8 rounded bg-muted/30" />
                <motion.div layoutId="sec-2" className="h-8 rounded bg-muted/30" />
                <div className="h-8 rounded bg-muted/30" />
                <div className="h-8 rounded bg-muted/30" />
              </div>
            </div>
          );
        
        case 4:
          return (
            <div>
              <div className="grid grid-cols-2 gap-3">
                <motion.div layoutId="header-main" className="h-24 rounded-lg bg-muted/30" />
                <motion.div layoutId="grid-1" className="h-24 rounded-lg bg-muted/30" />
              </div>
              <div className="flex items-center gap-3 mt-3">
                <motion.div layoutId="header-action" className="h-12 w-12 rounded-full bg-muted/30" />
                <motion.div layoutId="grid-2" className="h-12 flex-1 rounded-lg bg-muted/30" />
              </div>
              <div className="flex gap-2 mt-3">
                <motion.div layoutId="sec-1" className="h-10 flex-1 rounded-lg bg-muted/30" />
                <motion.div layoutId="sec-2" className="h-10 flex-1 rounded-lg bg-muted/30" />
              </div>
            </div>
          );
        
        case 5:
          return (
            <div>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <motion.div layoutId="header-main" className="h-6 w-36 rounded-lg bg-muted/30" />
                  <motion.div layoutId="sec-1" className="h-4 w-28 rounded bg-muted/30" />
                </div>
                <motion.div layoutId="header-action" className="h-8 w-8 rounded-lg bg-muted/30" />
              </div>
              <motion.div layoutId="grid-1" className="h-44 w-full rounded-xl bg-muted/30 mt-3" />
              <div className="flex gap-3 mt-3">
                <motion.div layoutId="grid-2" className="h-12 flex-1 rounded-lg bg-muted/30" />
                <motion.div layoutId="sec-2" className="h-12 w-24 rounded-lg bg-muted/30" />
              </div>
            </div>
          );
        
        case 6:
          return (
            <div>
              <div className="flex gap-3">
                <div className="space-y-3 flex-1">
                  <motion.div layoutId="header-main" className="h-8 w-full rounded-lg bg-muted/30" />
                  <motion.div layoutId="sec-1" className="h-20 w-full rounded-lg bg-muted/30" />
                </div>
                <motion.div layoutId="header-action" className="h-28 w-28 rounded-xl bg-muted/30" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <motion.div layoutId="grid-1" className="h-10 rounded bg-muted/30" />
                <motion.div layoutId="grid-2" className="h-10 rounded bg-muted/30" />
                <motion.div layoutId="sec-2" className="h-10 rounded bg-muted/30" />
              </div>
            </div>
          );
        
        case 7:
        default:
          return (
            <div>
              <motion.div layoutId="grid-1" className="h-32 w-full rounded-xl bg-muted/30" />
              <div className="flex items-center gap-3 mt-3">
                <motion.div layoutId="header-action" className="h-10 w-10 rounded-full bg-muted/30" />
                <div className="flex-1 space-y-2">
                  <motion.div layoutId="header-main" className="h-5 w-40 rounded bg-muted/30" />
                  <motion.div layoutId="sec-1" className="h-4 w-32 rounded bg-muted/30" />
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <motion.div layoutId="grid-2" className="h-12 flex-1 rounded-lg bg-muted/30" />
                <motion.div layoutId="sec-2" className="h-12 flex-1 rounded-lg bg-muted/30" />
              </div>
            </div>
          );
      }
    }

    // Stage 2+: Intent-based shapes
    switch (intent) {
      case 'weather':
      case 'weather-card':
        return (
          <div>
            <div className="flex items-center justify-between">
              <motion.div layoutId="header-main" className="h-7 w-40 rounded-lg bg-muted/30" />
              <motion.div layoutId="header-action" className="h-14 w-14 rounded-xl bg-muted/30" />
            </div>
            <motion.div layoutId="grid-1" className="h-20 rounded-xl bg-muted/30 mt-3" />
            <div className="grid grid-cols-3 gap-3 mt-3">
              <motion.div layoutId="grid-2" className="h-14 rounded-lg bg-muted/30" />
              <motion.div layoutId="sec-1" className="h-14 rounded-lg bg-muted/30" />
              <motion.div layoutId="sec-2" className="h-14 rounded-lg bg-muted/30" />
            </div>
          </div>
        );

      case 'stock':
      case 'stock-ticker':
        return (
          <div>
            <div className="flex items-center justify-between">
              <motion.div layoutId="header-main" className="h-9 w-24 rounded-lg bg-muted/30" />
              <motion.div layoutId="header-action" className="h-9 w-28 rounded-lg bg-muted/30" />
            </div>
            <motion.div layoutId="grid-1" className="h-36 rounded-xl bg-muted/30 mt-3" />
            <div className="grid grid-cols-4 gap-2 mt-3">
              <motion.div layoutId="grid-2" className="h-10 rounded-lg bg-muted/30" />
              <motion.div layoutId="sec-1" className="h-10 rounded-lg bg-muted/30" />
              <motion.div layoutId="sec-2" className="h-10 rounded-lg bg-muted/30" />
              <div className="h-10 rounded-lg bg-muted/30" />
            </div>
          </div>
        );

      case 'chart':
        return (
          <div>
            <motion.div layoutId="header-main" className="h-7 w-56 rounded-lg bg-muted/30" />
            <motion.div layoutId="grid-1" className="h-64 rounded-xl bg-muted/30 mt-3" />
            <div className="flex gap-2 mt-3">
              <motion.div layoutId="sec-1" className="h-6 w-20 rounded bg-muted/30" />
              <motion.div layoutId="sec-2" className="h-6 w-20 rounded bg-muted/30" />
              <motion.div layoutId="grid-2" className="h-6 w-20 rounded bg-muted/30" />
            </div>
          </div>
        );

      case 'comparison':
      case 'comparison-table':
        return (
          <div>
            <motion.div layoutId="header-main" className="h-8 w-full rounded-lg bg-muted/30" />
            <div className="space-y-2 mt-3">
              <div className="flex gap-2">
                <motion.div layoutId="grid-1" className="h-10 flex-1 rounded-lg bg-muted/30" />
                <motion.div layoutId="grid-2" className="h-10 w-24 rounded-lg bg-muted/30" />
              </div>
              <div className="flex gap-2">
                <motion.div layoutId="sec-1" className="h-10 flex-1 rounded-lg bg-muted/30" />
                <div className="h-10 w-24 rounded-lg bg-muted/30" />
              </div>
              <div className="flex gap-2">
                <motion.div layoutId="sec-2" className="h-10 flex-1 rounded-lg bg-muted/30" />
                <div className="h-10 w-24 rounded-lg bg-muted/30" />
              </div>
              <div className="flex gap-2">
                <motion.div layoutId="header-action" className="h-10 flex-1 rounded-lg bg-muted/30" />
                <div className="h-10 w-24 rounded-lg bg-muted/30" />
              </div>
            </div>
          </div>
        );

      case 'recipe':
      case 'recipe-card':
        return (
          <div>
            <motion.div layoutId="header-main" className="h-8 w-full rounded-lg bg-muted/30" />
            <div className="flex gap-3 mt-3">
              <motion.div layoutId="header-action" className="h-7 w-24 rounded-lg bg-muted/30" />
              <motion.div layoutId="grid-2" className="h-7 w-24 rounded-lg bg-muted/30" />
              <div className="h-7 w-20 rounded-lg bg-muted/30" />
            </div>
            <motion.div layoutId="grid-1" className="h-44 rounded-xl bg-muted/30 mt-3" />
            <div className="space-y-2 mt-3">
              <motion.div layoutId="sec-1" className="h-5 w-full rounded bg-muted/30" />
              <motion.div layoutId="sec-2" className="h-5 w-4/5 rounded bg-muted/30" />
              <div className="h-5 w-3/4 rounded bg-muted/30" />
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <motion.div layoutId="header-action" className="h-10 w-10 rounded-full bg-muted/30 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <motion.div layoutId="header-main" className="h-6 w-48 rounded-lg bg-muted/30" />
                  <motion.div layoutId="grid-1" className="h-12 w-full rounded-lg bg-muted/30" />
                </div>
              </div>
              <div className="flex gap-3">
                <motion.div layoutId="grid-2" className="h-10 w-10 rounded-full bg-muted/30 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <motion.div layoutId="sec-1" className="h-6 w-40 rounded-lg bg-muted/30" />
                  <div className="h-10 w-full rounded-lg bg-muted/30" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-muted/30 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <motion.div layoutId="sec-2" className="h-6 w-36 rounded-lg bg-muted/30" />
                  <div className="h-8 w-full rounded-lg bg-muted/30" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'list':
      case 'list-with-icons':
        return (
          <div>
            <div className="space-y-2">
              <div className="flex gap-3 items-center">
                <motion.div layoutId="header-action" className="h-8 w-8 rounded-lg bg-muted/30" />
                <motion.div layoutId="header-main" className="h-7 flex-1 rounded-lg bg-muted/30" />
              </div>
              <div className="flex gap-3 items-center">
                <motion.div layoutId="grid-2" className="h-8 w-8 rounded-lg bg-muted/30" />
                <motion.div layoutId="grid-1" className="h-7 flex-1 rounded-lg bg-muted/30" />
              </div>
              <div className="flex gap-3 items-center">
                <div className="h-8 w-8 rounded-lg bg-muted/30" />
                <motion.div layoutId="sec-1" className="h-7 flex-1 rounded-lg bg-muted/30" />
              </div>
              <div className="flex gap-3 items-center">
                <div className="h-8 w-8 rounded-lg bg-muted/30" />
                <motion.div layoutId="sec-2" className="h-7 flex-1 rounded-lg bg-muted/30" />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <motion.div layoutId="header-main" className="h-7 w-56 rounded-lg bg-muted/30" />
            <motion.div layoutId="grid-1" className="h-36 w-full rounded-xl bg-muted/30 mt-3" />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <motion.div layoutId="sec-1" className="h-16 rounded-lg bg-muted/30" />
              <motion.div layoutId="sec-2" className="h-16 rounded-lg bg-muted/30" />
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="rounded-lg bg-muted/20 overflow-hidden">
        <div className="p-6">
          {getSkeletonLayout()}
        </div>
      </div>
    </motion.div>
  );
}

